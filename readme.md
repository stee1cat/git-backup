# git-backup

`git-backup` - CLI utility for backing up git repositories.

Currently all user repositories on [GitHub](https://github.com/), [BitBucket](https://bitbucket.com/) and GitLab are supported. If authentication is required, authorization is available via login/password pair.

## Run

```bash
npx git-backup --<option1 value> --<option2 value>
```

## Options

* `help` - output usage information.

* `owner` - the owner of the repositories that need to be backed up.

* `output` - the output directory.

* `service` - can take values: `github`, `bitbucket` or `gitlab`.

* `host` - optional host for service.

* `username` - login for authorization.

* `password` - password for authorization.

* `compress` - archiving flag.
