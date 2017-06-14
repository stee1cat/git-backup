/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as bitbucketjs from 'bitbucketjs';

import { IService } from './IService';
import { ICredentials } from './ICredentials';
import { IRepository } from './IRepository';

const API_ROOT = 'https://api.bitbucket.org/2.0/';

export class BitBucket implements IService {

    public readonly NAME = 'bitbucket';
    protected credentials: ICredentials;

    public setCredentials(credentials: ICredentials): this {
        this.credentials = credentials;

        return this;
    }

    public fetchUserRepos(user: string): Promise<IRepository[]> {
        let bitbucket = bitbucketjs(this.credentials);

        return bitbucket.request.get(`${API_ROOT}repositories/${user}?pagelen=100`)
            .then(data => data.values.map(function (repo) {
                return {
                    name: repo.name,
                    owner: repo.owner.username,
                    httpsCloneUrl: repo.links.clone.filter(url => url.name === 'https')
                        .map(url => url.href)
                        .pop()
                };
            }));
    }

}
