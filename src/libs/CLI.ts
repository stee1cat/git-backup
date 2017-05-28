/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as path from 'path';
import * as parseArgs from 'minimist';

export interface ICommandLineArguments {
    user: string;
    output: string;
    error: boolean;
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
                'user',
                'output'
            ]
        };

        let args: IParsedArgs = parseArgs(this.args, options);

        return this.prepareArguments(args);
    }

    protected prepareArguments(args: IParsedArgs): ICommandLineArguments {
        let result: ICommandLineArguments = {
            user: '',
            output: '',
            error: false
        };
        let executionPath = path.dirname(args._[1]);

        if (!args.user) {
            result.error = true;
        } else  {
            result.user = args.user;
        }

        if (args.output) {
            result.output = path.resolve(executionPath, args.output);
        } else {
            result.output = executionPath;
        }

        return result;
    }

}
