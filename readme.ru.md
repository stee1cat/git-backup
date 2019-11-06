# git-backup

`git-backup` - CLI-утилита для выполнения резервного копиравания GIT-репозитариев.

На данный момент поддерживается бекап всех репозитариев пользователя с [GitHub](https://github.com/), [BitBucket](https://bitbucket.com/) и GitLab. Если требуется аутентификация, то авторизация доступна по паре логин/пароль.

## Установка

```bash
npm install --global git-backup
```

## Запуск

```bash
git-backup --<option1=value> --<option2=value>
```

## Опции

* `owner` - владелец репозитариев которые необходимо скопировать.

* `output` - директория сохранения.

* `service`- может принимать значения: `github`, `bitbucket` или `gitlab`.

* `username` - логин для авторизации.

* `password` - пароль для авторизации.

* `compress` - флаг архивации.