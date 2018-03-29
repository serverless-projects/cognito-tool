# cognito-cli 👫→💾
Amazon doesn't have any way of backing up their AWS Cognito User Pools.
cognito-cli is a CLI for backing up the data. <b>Note: AWS has no way of extracting the passwords of your users so you need to store these separately 😵</b>



## Install
```
npm install -g cognito-cli
```

## Usage
```
$ cognito-cli backup-users <user-pool-id> <options>  Backup all users in a single user pool

$ cognito-cii backup-all-users <options>  Backup all users in all user pools for this account
```

## Examples
```
$ cognito-cli backup-users eu-west-1_1_12345
$ cat eu-west-1_1_12345.json

$ cognito-cli backup-all-users eu-west-1_1_12345 --dir 20180326
$ cat eu-west-1_1_12345.json

# Nominate region if not set in environment variable or ~/.aws/credentials
$ AWS_region=ap-southeast-2 cognito-cli backup-all-users ap-southeast-2_123456
```

## TODO
- Implement restore
