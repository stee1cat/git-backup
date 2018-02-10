/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as path from 'path';
import * as parseArgs from 'minimist';

import { ICredentials } from './ICredentials';

export interface ICommandLineArguments {
    owner: string;
    output: string;
    credentials?: ICredentials;
    service: 'github' | 'bitbucket' | 'gitlab';
    error: boolean;
    compress: boolean;
    host: string;
}

export interface IParsedArgs {
    _: string[];
    [key: string]: any;
}

export class CLI {

    protected args: string[];

    constructor() {
        this.args = process.argv;
    }

    public getArguments(): ICommandLineArguments {
        let options = {
            string: [
                'owner',
                'output',
                'username',
                'password',
                'service',
                'host'
            ],
            boolean: [
                'compress'
            ]
        };

        let args: IParsedArgs = parseArgs(this.args, options);

        return this.prepareArguments(args);
    }

    protected prepareArguments(args: IParsedArgs): ICommandLineArguments {
        let result: ICommandLineArguments = {
            service: 'github',
            owner: '',
            output: '',
            error: false,
            compress: false,
            host: ''
        };
        let executionPath = path.dirname(args._[1]);

        if (!args.owner) {
            result.error = true;
        } else  {
            result.owner = args.owner;
        }

        if (!args.service) {
            result.error = true;
        } else  {
            result.service = args.service.toLowerCase();
        }

        if (args.output) {
            result.output = path.resolve(executionPath, args.output);
        } else {
            result.output = executionPath;
        }

        if (args.username && args.password) {
            result.credentials = {
                username: args.username,
                password: args.password
            };
        }

        if (args.compress) {
            result.compress = true;
        }

        if (args.host) {
            result.host = args.host;
        }

        return result;
    }

}
