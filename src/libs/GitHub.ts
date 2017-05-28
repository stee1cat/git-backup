/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

import * as request from 'request';

export interface IGitRepo {
    name: string;
    url: string;
}

let requestOptions: request.CoreOptions = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
};

export class GitHub {

    public static fetchUserRepos(user: string): Promise<IGitRepo[]> {
        return new Promise(function (resolve, reject) {
            request.get(`https://api.github.com/users/${user}/repos`, requestOptions, function (error, response) {
                if (!error && response.statusCode === 200) {
                    try {
                        let repos = JSON.parse(response.body);
                        let result: IGitRepo[] = repos.map(function (repo) {
                            return {
                                name: repo.name,
                                url: repo.html_url
                            };
                        });

                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(error || response.body);
                }
            });
        });
    }

}
