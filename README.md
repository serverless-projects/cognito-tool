# cognito-tool 👫→💾
Amazon doesn't have any way of backing up and restore heir AWS Cognito User Pools.
cognito-tool is a CLI for backing up and restore the data. <b>Note: AWS has no way of extracting the passwords of your users so you need to store these separately 😵</b>



## Install
```
npm install -g cognito-tool
```

## Usage
```
$ cognito-tool backup-users <user-pool-id> <options>  Backup all users in a single user pool

$ cognito-tool backup-all-users <options>  Backup all users in all user pools for this account
```

## Examples
```
$ cognito-tool backup-users eu-west-1_1_12345
$ cat eu-west-1_1_12345.json

$ cognito-tool backup-all-users eu-west-1_1_12345 --dir 20180326
$ cat eu-west-1_1_12345.json

# Nominate region if not set in environment variable or ~/.aws/credentials
$ AWS_region=ap-southeast-2 cognito-tool backup-all-users ap-southeast-2_123456
```

## TODO
- Implement restore
