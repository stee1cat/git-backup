/**
 * Copyright (c) 2018 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as deepmerge from 'deepmerge';
import * as request from 'request';

import { IRepository } from '../IRepository';
import { IService } from '../IService';
import { RepositoryManager } from '../RepositoryManager';

export class GitLab extends RepositoryManager implements IService {

    public static readonly NAME = 'gitlab';

    protected accessToken: string;

    public get NAME(): string {
        return GitLab.NAME;
    }

    public fetchUserRepos(user: string): Promise<IRepository[]> {
        let { host } = this.options;

        return this.getAccessToken()
            .then(accessToken => {
                let options: request.CoreOptions = deepmerge(this.requestOptions, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    qs: {
                        per_page: 100
                    }
                });

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

                                resolve(result);
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
                ...this.credentials
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
