/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as fs from 'fs';
import * as path from 'path';
import * as NodeGit from 'nodegit';
import * as moment from 'moment';

import { CLI } from './libs/CLI';
import { GitHub } from './libs/GitHub';

const cli = new CLI();
const args = cli.getArguments();

if (args.error) {
    process.exit(1);
}

const currentDate = moment().format('YYYY-MM-DD_HH-mm');
const backupPath = path.resolve(args.output, `github_${currentDate}`);

if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath);
}

GitHub.fetchUserRepos(args.user)
    .then(function (repos) {
        return new Promise(function (resolve, reject) {
            if (!repos.length) {
                resolve();
            } else {
                let chain = Promise.resolve();

                for (let i = 0; i < repos.length; i++) {
                    let repo = repos[i];
                    let repoPath = path.resolve(backupPath, repo.name);

                    chain = chain.then(() => NodeGit.Clone.clone(repo.url, repoPath))
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
