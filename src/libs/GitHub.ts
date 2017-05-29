/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as request from 'request';

import { IService } from './IService';
import { IRepository } from './IRepository';
import { ICredentials } from './ICredentials';

let requestOptions: request.CoreOptions = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
};

export class GitHub implements IService {

    public readonly NAME = 'github';

    protected credentials: ICredentials;

    public setCredentials(credentials: ICredentials): void {
        this.credentials = credentials;
    }

    public fetchUserRepos(user: string): Promise<IRepository[]> {
        return new Promise(function (resolve, reject) {
            request.get(`https://api.github.com/users/${user}/repos`, requestOptions, function (error, response) {
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
