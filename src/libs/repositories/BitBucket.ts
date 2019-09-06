/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as bitbucketjs from 'bitbucketjs';

import { IService } from '../IService';
import { IRepository } from '../IRepository';
import { RepositoryManager } from '../RepositoryManager';

export class BitBucket extends RepositoryManager implements IService {

    public static readonly NAME = 'bitbucket';

    public get NAME(): string {
        return BitBucket.NAME;
    }

    public async fetchUserRepos(user: string): Promise<IRepository[]> {
        let bitbucket = bitbucketjs(this.credentials);
        let data = await bitbucket.request.get(this.getRepositoriesUrl());

        return data.values.map(function (repo) {
            return {
                name: repo.name,
                owner: user,
                httpsCloneUrl: repo.links.clone.filter(url => ['https', 'http'].indexOf(url.name) > -1)
                    .map(url => url.href)
                    .pop(),
            };
        });
    }

    private getRepositoriesUrl(): string {
        const {
            host,
            owner,
        } = this.options;

        if (host && owner) {
            return `https://${host}/stash/rest/api/latest/projects/${owner}/repos?start=0&limit=100`;
        }

        return `https://api.bitbucket.org/2.0/repositories/${owner}?pagelen=100`;
    }

}
