/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as request from 'request';

import { IService } from '../IService';
import { IRepository } from '../IRepository';
import { RepositoryManager } from '../RepositoryManager';

export class GitHub extends RepositoryManager implements IService {

    public static readonly NAME = 'github';

    public get NAME(): string {
        return GitHub.NAME;
    }

    public fetchUserRepos(user: string): Promise<IRepository[]> {
        return new Promise((resolve, reject) => {
            request.get(`https://api.github.com/users/${user}/repos`, this.requestOptions, function (error, response) {
                if (!error && response.statusCode === 200) {
                    try {
                        let repos = JSON.parse(response.body);
                        let result: IRepository[] = repos.map(function (repo) {
                            return {
                                name: repo.name,
                                owner: repo.owner.login,
                                httpsCloneUrl: repo.clone_url
                            };
                        });

                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(error || response.body);
                }
            });
        });
    }

}
