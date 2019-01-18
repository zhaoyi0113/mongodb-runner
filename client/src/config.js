const vscode = require('vscode');
const mongodbUri = require('mongodb-uri');
const ShortUniqueId = require('short-unique-id')

const { ConnectStatus } = require('./connection');

const uid = new ShortUniqueId();

const getConnectionName = config => {
  const uriObject = mongodbUri.parse(config.url);
  let name = 'MongoServer';
  if (uriObject.options && uriObject.options.replicaSet) {
    name = uriObject.options.replicaSet;
  }
  if (uriObject.hosts && uriObject.hosts.length > 0) {
    name = uriObject.hosts[0].host;
  }
  return name;
};

const getSingleConfiguration = config => {
  const { url, activeOnStartUp, user, options } = config;
  const id = uid.randomUUID(6);
  return {
    type: `host:${ConnectStatus.CLOSED}`,
    url,
    user,
    options,
    activeOnStartUp,
    name: `${getConnectionName(config)} : ${id}`,
    status: ConnectStatus.CLOSED,
    uuid: id, 
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
