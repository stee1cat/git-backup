import * as path from 'path';
import * as program from 'commander';

import { ICredentials } from './ICredentials';
import { GitHub } from './services/GitHub';
import { BitBucket } from './services/BitBucket';
import { GitLab } from './services/GitLab';
import * as packageInfo from '../../package.json';

program.version(packageInfo.version, '--version')
    .name('git-backup')
    .requiredOption('--service <string>', `can take values: ${GitHub.NAME}, ${BitBucket.NAME} or ${GitLab.NAME}`, (value: string) => {
        const service = `${value}`.toLowerCase();
        const services = [
            BitBucket.NAME,
            GitHub.NAME,
            GitLab.NAME,
        ];

        if (services.indexOf(service) > -1) {
            return service;
        }

        return GitHub.NAME;
    }, GitHub.NAME)
    .requiredOption('--owner <string>', 'the owner of the repositories that need to be backed up')
    .option('--output <string>', 'the output directory', (value: string = '') => {
        return path.resolve(process.cwd(), value);
    }, process.cwd())
    .option('--username <string>', 'login for authorization', '')
    .option('--password <string>', 'password for authorization', '')
    .option('--host <string>', 'optional host for service', '')
    .option('--compress', 'archiving flag', false);

program.parse(process.argv);

export interface ICommandLineArguments {
    owner: string;
    output: string;
    credentials?: ICredentials;
    service: 'github' | 'bitbucket' | 'gitlab';
    compress: boolean;
    host: string;
}

export class CLI {
    public getArguments(): ICommandLineArguments {
        const options = program.opts();

        return {
            compress: options.compress,
            host: options.host,
            output: options.output,
            owner: options.owner,
            service: options.service,
            credentials: {
                username: options.username,
                password: options.password,
            },
        };
    }
}
