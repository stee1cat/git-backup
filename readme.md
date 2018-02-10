# git-backup

```git-backup``` - CLI-утилита для выполнения резервного копиравания GIT-репозитариев.

На данный момент поддерживается бекап всех репозитариев пользователя с [GitHub](https://github.com/) или [BitBucket](https://bitbucket.com/). Если требуется аутентификация, то авторизация доступна по паре логин/пароль.

## Установка

```npm install --global git-backup```

## Запуск

```git-backup --<option1=value> --<option2=value>```

## Опции

```owner``` - владелец репозитариев которые необходимо скопировать.

```output``` - директория сохранения.

```service```- может принимать значение ```github``` или ```bitbucket```.

```username``` - логин для авторизации.

```password``` - пароль для авторизации.

```compress``` - архивировать.