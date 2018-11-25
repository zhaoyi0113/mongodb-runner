const vscode = require('vscode');
const mongodbUri = require('mongodb-uri');
const { TreeNodeTypes } = require('mongodb-topology');
const uuid = require('uuid');
const { ConnectStatus } = require('./connection');

const getConnectionName = config => {
  const uriObject = mongodbUri.parse(config.url);
  if (uriObject.options && uriObject.options.replicaSet) {
    return uriObject.options.replicaSet;
  }
  if (uriObject.hosts && uriObject.hosts.length > 0) {
    return uriObject.hosts[0].host;
  }
  return 'MongoServer';
};

const getSingleConfiguration = config => {
  const { url, activeOnStartUp, user, options } = config;
  return {
    type: `host:${ConnectStatus.CLOSED}`,
    url,
    user,
    options,
    activeOnStartUp,
    name: getConnectionName(config),
    status: ConnectStatus.CLOSED,
    uuid: uuid.v4(),
    id: TreeType.host,
    children: []
  };
};

const getMongoConfiguration = () => {
  const connectsConfig = vscode.workspace
    .getConfiguration()
    .get('mongoRunner.connections');
  const connectConfig = vscode.workspace
    .getConfiguration()
    .get('mongoRunner.connection');
  if (Array.isArray(connectsConfig)) {
    return connectsConfig.map(config => getSingleConfiguration(config));
  } else if (connectConfig) {
    return [getSingleConfiguration(connectConfig)];
  }
};

const TreeType = {
  host: 0,
  dbs: 1,
  users: 2,
  roles: 3
};

module.exports = {
  getMongoConfiguration,
  TreeType
};
