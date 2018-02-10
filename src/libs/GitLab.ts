/**
 * Copyright (c) 2018 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as request from 'request';

import { ICommandLineArguments } from './CLI';
import { ICredentials } from './ICredentials';
import { IRepository } from './IRepository';
import { IService } from './IService';

export class GitLab implements IService {

    public static readonly NAME = 'gitlab';

    protected credentials: ICredentials;
    protected accessToken: string;

    constructor(protected options: ICommandLineArguments) {}

    public setCredentials(credentials: ICredentials): this {
        this.credentials = credentials;

        return this;
    }

    public fetchUserRepos(user: string): Promise<IRepository[]> {
        let { host } = this.options;

        return this.getAccessToken()
            .then(function (accessToken) {
                let options: request.CoreOptions = {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    qs: {
                        per_page: 100
                    }
                };

                return new Promise(function (resolve, reject) {
                    request.get(`https://${host}/api/v4/projects`, options, function (error, response) {
                        if (!error && response.statusCode === 200) {
                            try {
                                let repos = JSON.parse(response.body);
                                let result: IRepository[] = repos.map(function (repo) {
                                    return {
                                        name: repo.name,
                                        owner: repo.namespace.name,
                                        httpsCloneUrl: repo.http_url_to_repo
                                    };
                                });

                                console.log(result);
                            } catch (e) {
                                reject(e);
                            }
                        } else {
                            reject(error || response.body);
                        }
                    });
                });
            });
    }

    public getAccessToken(): Promise<string> {
        let { host } = this.options;
        let params = {
            form: {
                grant_type: 'password',
                username: this.credentials.username,
                password: this.credentials.password
            }
        };

        return new Promise((resolve, reject) => {
            request.post(`https://${host}/oauth/token`, params, (error, response) => {
                if (!error && response.statusCode === 200) {
                    try {
                        let data = JSON.parse(response.body);

                        this.accessToken = data.access_token;

                        resolve(this.accessToken);
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
