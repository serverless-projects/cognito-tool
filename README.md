<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [cognito-tool 👫→💾](#cognito-tool-%E2%86%92)
  - [Install](#install)
  - [Usage](#usage)
  - [Examples](#examples)
    - [Backup](#backup)
    - [Restore](#restore)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

[![npm version](https://badge.fury.io/js/cognito-tool.svg)](https://badge.fury.io/js/cognito-tool)

# cognito-tool 👫→💾
Amazon doesn't have any way of backing up and restore heir AWS Cognito User Pools.
cognito-tool is a CLI for backing up and restore the data. <b>Note: AWS has no way of extracting the passwords of your users so you need to store these separately 😵</b>

This repo is forked from  [mifi/cognito-backup](https://github.com/mifi/cognito-backup) and added restore features

1) Package name change from `cognito-backup` to `cognito-tool` to adapt the new functions which are not only focus on backup tasks
2) When restore, set the default password to `P@ssw@rd1234`
3) When restore, user's sub (The UUID of the authenticated user) is unique, can't be restored. AWS will create new sub for each cognito user.

## Install
```
npm install -g cognito-tool
```

## Usage
```
$ cognito-tool backup-users <user-pool-id> <options>  Backup all users in a single user pool

$ cognito-tool backup-all-users <options>  Backup all users in all user pools for this account

$ cognito-tool restore <user-pool-id> --file <JSON_users_file>  Restore users to user pool

```

## Examples

### Backup
```
$ cognito-tool backup-users eu-west-1_1_12345
$ cat eu-west-1_1_12345.json

$ cognito-tool backup-all-users eu-west-1_1_12345 --dir 20180326
$ cd 20180326
$ cat eu-west-1_1_12345.json

# Nominate region if not set in environment variable or ~/.aws/credentials
$ AWS_region=ap-southeast-2 cognito-tool backup-all-users ap-southeast-2_123456
```

### Restore

```
$ cognito-tool restore ap-southeast-2_345678 --file eu-west-1_1_12345.json
```
