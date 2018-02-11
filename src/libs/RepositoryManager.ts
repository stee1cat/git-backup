/**
 * Copyright (c) 2018 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as request from 'request';

import { ICommandLineArguments } from './CLI';
import { ICredentials } from './ICredentials';

export abstract class RepositoryManager {

    protected credentials: ICredentials;
    protected requestOptions: request.CoreOptions = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    };

    constructor(protected options: ICommandLineArguments) {}

    public setCredentials(credentials: ICredentials): this {
        this.credentials = credentials;

        return this;
    }

}
