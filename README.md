# MongoDB Runner

Mongo Runner is a VSCode plugin helps developers to connect to their MongoDB instance to do some basic operations such as: `simple query`, `tree topology`, `index`, `server statistics` etc.

## Features

Mongo Runner provides general operations about using MongoDB. It can connect to Mongo Single Instance, Mongo Replicaset and Mongo Shard Cluster.

For example below is a sceenshot of Mongo Shard Cluster Topology:

![MongoDB Shard Cluster Topology](https://raw.githubusercontent.com/zhaoyi0113/mongodb-runner/master/images/shard-ss.png)

### MongoDB Runner Editor

By open MongoDB Runner editor, you can running MongoDB NodeJS driver inside VSCode and get the output on the right view. 

![MongoDB Runner Editor](https://raw.githubusercontent.com/zhaoyi0113/mongodb-runner/master/images/mr-editor.png)

## Requirements

NA

## Extension Settings

Setup MongoDB Connection in your workspace setting. Be aware that the name for each connection need to be unique.

```json
"mongoRunner": {
        "connections": [
            {
                "name": "connection1",
                "url": "mongodb://localhost:27017/test"
            },
            {
                "name": "connection2",
                "url": "mongodb://localhost:27018/test"
            }
        ]
    }
```

In order to secure user's password, we don't support put password in the configuration file as plain text. Instead, when you specify the user name in the configuration file, `MongoDB Runner` will prompt you to input the password.

### SSL Connection

For SSl connection, please use `options` configuration. You can also put all other mongo connection options there.

```json
"mongoRunner": {
        "connection": [{
            "name": "connectionName",
            "url": "mongodb://localhost:27017",
            "user": "username",
            "options": {
                "ssl": true
            }
        }]
    }
```

### Private key connection setting

```json
"mongoRunner": {
        "connection": [{
            "name": "connectionName",
            "url": "mongodb://localhost:27017",
            "user": "username",
            "options": {
                "sslCert": "/Users/Document/mongodb.pem",
                "sslKey": "/Users/Document/mongodb-cert.key",
                "ssl": true
            }
        }]
    }
```

## Query

### Simple Query

User below format for querying `ObjectId`:

```javascript
{ "_id": new ObjectID("5ba2bfcf6d2a0312c7ec12c6") }
```

## Known Issues

Please submit any issues you found or any suggestions on github issues.

## Support MongoDB Runner
While MongoDB Runner is generously offered to everyone free of charge, if you find it useful, please consider supporting it.

[**Donate via PayPal**](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=W75BXQ3XP6VUL&item_name=MongoDB+Runner&currency_code=USD&source=url)

## Slack
Feel free join slack channel for `MongoDB Runner` at: mongodb-runner.slack.com
