<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [cognito-tool](#cognito-tool)
  - [Notes for cognito user restore](#notes-for-cognito-user-restore)
  - [Install](#install)
  - [Usage](#usage)
  - [Examples](#examples)
    - [Backup](#backup)
    - [Restore](#restore)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

[![npm version](https://badge.fury.io/js/cognito-tool.svg)](https://badge.fury.io/js/cognito-tool)

# cognito-tool
Amazon doesn't have any ways of backing up and restore heir AWS Cognito User Pools currently.

`cognito-tool` is a CLI for backing up and restoring the users. <b>Note: AWS has no way of extracting the passwords of cognito users</b>

This repo is forked from  [mifi/cognito-backup](https://github.com/mifi/cognito-backup) and added restore features. Package name is changed from `cognito-backup` to `cognito-tool` to adapt the new functions which are not only focus on backup tasks

## Notes for cognito user restore

1) When restoring, this tool sets the default password to `P@ssw@rd1234` to all cognito users.
2) Cognito user's `sub` (The UUID of the cognito user) is unique in aws globally. When restoring, the original sub can't be restored. New sub will be set when restoring.

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
