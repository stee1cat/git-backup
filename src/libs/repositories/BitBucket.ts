/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as bitbucketjs from 'bitbucketjs';

import { IService } from '../IService';
import { IRepository } from '../IRepository';
import { RepositoryManager } from '../RepositoryManager';

const API_ROOT = 'https://api.bitbucket.org/2.0/';

export class BitBucket extends RepositoryManager implements IService {

    public static readonly NAME = 'bitbucket';

    public get NAME(): string {
        return BitBucket.NAME;
    }

    public async fetchUserRepos(user: string): Promise<IRepository[]> {
        let bitbucket = bitbucketjs(this.credentials);
        let data = await bitbucket.request.get(`${API_ROOT}repositories/${user}?pagelen=100`);

        return data.values.map(function (repo) {
            return {
                name: repo.name,
                owner: repo.owner.username,
                httpsCloneUrl: repo.links.clone.filter(url => url.name === 'https')
                    .map(url => url.href)
                    .pop()
            };
        });
    }

}
