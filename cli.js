#!/usr/bin/env node

'use strict';

const meow = require('meow');
const AWS = require('aws-sdk');
const cognitoIsp = new AWS.CognitoIdentityServiceProvider();
const bluebird = require('bluebird');
const fs = require('fs');
const sanitizeFilename = require('sanitize-filename');
const JSONStream = require('JSONStream');
const streamToPromise = require('stream-to-promise');
const debug = require('debug')('cognito-tool');
const mkdirp = bluebird.promisify(require('mkdirp'));
const assert = require('assert');

const cli = meow(`
    Usage
      $ cognito-tool backup-users <user-pool-id> <option>  Backup all users in a single user pool
      $ cognito-tool backup-all-users <options>  Backup all users in all user pools for this account
      $ cognito-tool restore <user-pool-id> --file <JSON_user_file> Restore users to a single user pool

      AWS_ACCESS_KEY_ID , AWS_SECRET_ACCESS_KEY and AWS_REGION
        (optional for assume role: AWS_SESSION_TOKEN)
      is specified in env variables or ~/.aws/credentials

    Options
      --dir Path to export all pools, all users to (defaults to current dir), only for backup
      --file Path to file with user details, only for retore 
`);

const methods = {
    'backup-users': backupUsersCli,
    'backup-all-users': backupAllUsersCli,
    'restore': restore,
};

const method = methods[cli.input[0]] || cli.showHelp();

bluebird.resolve(method.call(undefined, cli))
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    });


function backupUsersCli(cli) {
    const userPoolId = cli.input[1];
    const file = sanitizeFilename(getFilename(userPoolId));

    if (!userPoolId) {
        console.error('user-pool-id is required');
        cli.showHelp();
    }

    return backupUsers(cognitoIsp, userPoolId, file);
}

function backupAllUsersCli(cli) {
    const dir = cli.flags.dir || '.';

    return mkdirp(dir)
        .then(() => bluebird.mapSeries(listUserPools(), userPoolId => {
            const file = sanitizeFilename(getFilename(userPoolId));
            console.error(`Exporting ${userPoolId} to ${file}`);
            return backupUsers(cognitoIsp, userPoolId, file);
        }));
}

function getFilename(userPoolId) {
    return `${userPoolId}.json`;
}

function listUserPools() {
    return cognitoIsp.listUserPools({
            MaxResults: 60
        }).promise()
        .then(data => {
            assert(!data.NextToken, 'More than 60 user pools is not yet supported');
            const userPools = data.UserPools;
            debug({
                userPools
            });
            return userPools.map(p => p.Id);
        });
}

function backupUsers(cognitoIsp, userPoolId, file) {
    const writeStream = fs.createWriteStream(file);
    const stringify = JSONStream.stringify();

    stringify.pipe(writeStream);

    const params = {
        UserPoolId: userPoolId
    };
    const page = () => {
        debug(`Fetching users - page: ${params.PaginationToken || 'first'}`);
        return bluebird.resolve(cognitoIsp.listUsers(params).promise())
            .then(data => {
                data.Users.forEach(item => stringify.write(item));

                if (data.PaginationToken !== undefined) {
                    params.PaginationToken = data.PaginationToken;
                    return page();
                }
            });
    }

    return page()
        .finally(() => {
            stringify.end();
            return streamToPromise(stringify);
        })
        .finally(() => writeStream.end());
}

function restore(cli) {
    const userPoolId = cli.input[1];
    const file = cli.flags.file

    var new_attributes = [];

    if (!userPoolId || !file) {
        console.error('user-pool-id or input file is required');
        cli.showHelp();
    }

    fs.readFile(file, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var users = JSON.parse(data);
            users.forEach(function(user) {

                // sub is non-mutable attribute
                var attributes = user.Attributes;
                attributes.forEach(function(attribute) {
                    if (attribute.Name != "sub") {
                        new_attributes.push(attribute);
                    }
                });

                // create users
                var params = {
                    UserPoolId: userPoolId,
                    Username: user.Username,
                    DesiredDeliveryMediums: ['EMAIL'],
                    ForceAliasCreation: false,
                    TemporaryPassword: 'P@ssw@rd1234',
                    UserAttributes: new_attributes
                };
                cognitoIsp.adminCreateUser(params, function(err, data) {
                    if (err) console.log(err, err.stack);
                    else console.log(data);
                });

            });
        }
    });

}