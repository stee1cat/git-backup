/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as fs from 'fs-extra';
import * as archiver from 'archiver';

export class Util {

    public static createArchive(archiveName: string, path: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            let output = fs.createWriteStream(archiveName);
            let archive = archiver('zip', {
                zlib: {
                    level: 9
                }
            });

            archive.pipe(output);
            archive.directory(path, false);
            archive.finalize();

            output.on('close', resolve);
            output.on('error', reject);
        });
    }

    public static stdout(message: string) {
        process.stdout.write(message);
    }

    public static stderr(message: string) {
        process.stderr.write(message);
    }

}
