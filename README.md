# MongoDB Runner

Mongo Runner is a VSCode plugin helps developers to connect to their MongoDB instance to do some basic operations such as: `simple query`, `tree topology`, `index`, `server statistics` etc.

## Features

Mongo Runner provides general operations about using MongoDB. It can connect to Mongo Single Instance, Mongo Replicaset and Mongo Shard Cluster.


For example below is a sceenshot of Mongo Shard Cluster Topology:

![MongoDB Runner](https://github.com/zhaoyi0113/mongodb-runner/blob/master/images/demo-med.gif?raw=true)

![MongoDB Shard Cluster Topology](https://raw.githubusercontent.com/zhaoyi0113/mongodb-runner/master/images/shard-ss.png)

## Requirements

NA

## Extension Settings

Setup MongoDB Connection in your workspace setting. 

```json
"mongoRunner": {
        "connection": {
            "url": "mongodb://localhost:27017",
            "activeOnStartUp": true,
            "user": "username",
        }
    }
```

In order to secure user's password, we don't support put password in the configuration file as plain text. Instead, when you specify the user name in the configuration file, `MongoDB Runner` will prompt you to input the password.

For SSl connection, please use `options` configuration. You can also put all other mongo connection options there.

```json
"mongoRunner": {
        "connection": {
            "url": "mongodb://localhost:27017",
            "activeOnStartUp": true,
            "user": "username",
            "options": {
                "ssl": true
            }
        }
    }
```

## Known Issues

Please submit any issues you found or any suggestions on github issues.

## Release Notes

### 0.0.1

Initial release.

### 0.0.2

Update plugin icon.

### 0.0.3

Support all mongodb connection options. 