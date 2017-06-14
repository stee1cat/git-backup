/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import { IRepository } from './IRepository';
import { ICredentials } from './ICredentials';

export interface IService {
    readonly NAME: string;
    setCredentials(credentials: ICredentials): this;
    fetchUserRepos(user: string): Promise<IRepository[]>;
}
