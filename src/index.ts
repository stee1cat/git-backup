#!/usr/bin/env node

/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as NodeGit from 'nodegit';
import * as moment from 'moment';

import { CLI, ICommandLineArguments } from './libs/CLI';
import { GitHub } from './libs/repositories/GitHub';
import { BitBucket } from './libs/repositories/BitBucket';
import { GitLab } from './libs/repositories/GitLab';
import { Util } from './libs/Util';
import { IService } from './libs/IService';

const cli = new CLI();
const args = cli.getArguments();
const currentDate = moment().format('YYYY-MM-DD_HH-mm');

function createService(options: ICommandLineArguments): IService {
    let cvs: IService;

    switch (options.service) {
        case BitBucket.NAME:
            cvs = new BitBucket(options);
            break;
        case GitLab.NAME:
            cvs = new GitLab(options);
            break;
        case GitHub.NAME:
        default:
            cvs = new GitHub(options);
    }

    return cvs;
}

if (args.error) {
    console.log('input error');
    process.exit(1);
}

let service = createService(args);
let cloneOptions: NodeGit.CloneOptions = {};

if (args.credentials) {
    cloneOptions.fetchOpts = {
        callbacks: {
            certificateCheck: () => 1,
            credentials: () => NodeGit.Cred.userpassPlaintextNew(args.credentials.username, args.credentials.password)
        }
    };
}

service.setCredentials(args.credentials)
    .fetchUserRepos(args.owner)
    .then(function (repos) {
        return new Promise(function (resolve, reject) {
            if (!repos.length) {
                resolve();
            } else {
                let chain = Promise.resolve();

                for (let i = 0; i < repos.length; i++) {
                    let repo = repos[i];
                    let clonePath = path.resolve(args.output, `${(service as any).NAME}_${currentDate}`, repo.owner, repo.name);

                    if (!fs.existsSync(clonePath)) {
                        fs.mkdirsSync(clonePath);
                    }

                    chain = chain
                        .then(() => process.stdout.write(`Clone: ${repo.name}...`))
                        .then(() => NodeGit.Clone.clone(repo.httpsCloneUrl, clonePath, cloneOptions))
                        .then(() => process.stdout.write(' done\n'))
                        .then(function () {
                            return new Promise(function (compressSuccess, compressError) {
                                if (args.compress) {
                                    process.stdout.write(' Compress...');

                                    Util.createArchive(path.resolve(clonePath, '..', `${repo.name}.zip`), clonePath)
                                        .then(function () {
                                            fs.removeSync(clonePath);
                                            process.stdout.write(' done\n');

                                            compressSuccess();
                                        })
                                        .catch(compressError);
                                } else {
                                    compressSuccess();
                                }
                            });
                        })
                        .then(function () {
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
