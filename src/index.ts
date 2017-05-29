/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as NodeGit from 'nodegit';
import * as moment from 'moment';

import { CLI } from './libs/CLI';
import { GitHub } from './libs/GitHub';
import { BitBucket } from './libs/BitBucket';
import { IService } from './libs/IService';

const cli = new CLI();
const args = cli.getArguments();
const currentDate = moment().format('YYYY-MM-DD_HH-mm');

function createService(service: string): IService {
    let cvs: IService;

    switch (service) {
        case 'bitbucket':
            cvs = new BitBucket();
            break;
        case 'github':
        default:
            cvs = new GitHub();
    }

    return cvs;
}

if (args.error) {
    console.log('input error');
    process.exit(1);
}

let service = createService(args.service);
service.setCredentials(args.credentials);
service.fetchUserRepos(args.owner)
    .then(function (repos) {
        return new Promise(function (resolve, reject) {
            if (!repos.length) {
                resolve();
            } else {
                let chain = Promise.resolve();

                for (let i = 0; i < repos.length; i++) {
                    let repo = repos[i];
                    let clonePath = path.resolve(args.output, `${service.NAME}_${currentDate}`, repo.owner, repo.name);
                    let cloneOptions: NodeGit.CloneOptions = {};

                    if (args.credentials) {
                        cloneOptions.fetchOpts = {
                            callbacks: {
                                certificateCheck: () => 1,
                                credentials: () => NodeGit.Cred.userpassPlaintextNew(args.credentials.username, args.credentials.password)
                            }
                        };
                    }

                    if (!fs.existsSync(clonePath)) {
                        fs.mkdirsSync(clonePath);
                    }

                    chain = chain.then(() => NodeGit.Clone.clone(repo.httpsCloneUrl, clonePath, cloneOptions))
                        .then(function () {
                            console.log(`Done: ${repo.name}`);

                            if (i === repos.length - 1) {
                                resolve();
                            }
                        })
                        .catch(reject);
                }
            }
        });
    })
    .then(function () {
        console.log('Backup completed');
        process.exit(0);
    })
    .catch(function (error) {
        console.error(error);
        process.exit(-1);
    });
