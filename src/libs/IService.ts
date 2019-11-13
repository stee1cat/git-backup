import { IRepository } from './IRepository';
import { ICredentials } from './ICredentials';

export interface IService {
    NAME: string;
    setCredentials(credentials: ICredentials): this;
    fetchUserRepos(user: string): Promise<IRepository[]>;
}
