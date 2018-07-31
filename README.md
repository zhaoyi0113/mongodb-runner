# mongo-runner README

Mongo Runner is a VSCode plugin helps developers to connect to their MongoDB instance to do some basic operations such as: `simple query`, `tree topology`, `index`, `server statistics` etc.

## Features

Mongo Runner provides general operations about using MongoDB. It can connect to Mongo Single Instance, Mongo Replicaset and Mongo Shard Cluster.


For example below is a sceenshot of Mongo Shard Cluster Topology:

![MongoDB Runner](https://raw.githubusercontent.com/zhaoyi0113/mongodb-runner/master/images/demo.gif)

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
            "userName": "username",
            "password": "password"
        }
    }
```

## Known Issues

Please submit any issues you found or any suggestions on github issues.

## Release Notes

### 0.0.1

Initial release.
