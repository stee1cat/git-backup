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
    Util.stderr('Argument error');
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

    service.setCredentials(args.credentials);
}

async function bootstrap() {
    let repos = await service.fetchUserRepos(args.owner);

    try {
        if (repos.length) {
            for (let repo of repos) {
                let clonePath = path.resolve(args.output, `${(service as any).NAME}_${currentDate}`, repo.owner, repo.name);

                if (!fs.existsSync(clonePath)) {
                    fs.mkdirsSync(clonePath);
                }

                Util.stdout(`Clone: ${repo.name}...`);
                await NodeGit.Clone.clone(repo.httpsCloneUrl, clonePath, cloneOptions);
                Util.stdout(' done\n');

                if (args.compress) {
                    Util.stdout(' Compress...');

                    await Util.createArchive(path.resolve(clonePath, '..', `${repo.name}.zip`), clonePath);
                    fs.removeSync(clonePath);
                    Util.stdout(' done\n');
                }
            }
        }

        Util.stdout('Backup completed');
        process.exit(0);
    } catch (error) {
        Util.stderr(error);
        process.exit(-1);
    }
}

bootstrap();
