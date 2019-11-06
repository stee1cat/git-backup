# git-backup

`git-backup` - CLI utility for backing up git repositories.

Currently all user repositories on [GitHub](https://github.com/), [BitBucket](https://bitbucket.com/) and GitLab are supported. If authentication is required, authorization is available via login/password pair.

## Set up

```bash
npm install --global git-backup
```

## Run

```bash
git-backup --<option1=value> --<option2=value>
```

## Options

* `owner` - the owner of the repositories that need to be backed up.

* `output` - the output directory.

* `service` - can take values: `github`, `bitbucket` or `gitlab`.

* `username` - login for authorization.

* `password` - password for authorization.

* `compress` - archiving flag.
