const mongodbUri = require('mongodb-uri');
const ShortUniqueId = require('short-unique-id');

const { ConnectStatus } = require('./types');

const uid = new ShortUniqueId();

const getConnectionName = config => {
  if (config.name) {
    return config.name;
  }
  const uriObject = mongodbUri.parse(config.url);
  let name = 'MongoServer';
  if (uriObject.options && uriObject.options.replicaSet) {
    name = uriObject.options.replicaSet;
  } else if (uriObject.hosts && uriObject.hosts.length > 0) {
    name = uriObject.hosts[0].host;
  }
  return name;
};

const getConfiguration = config => {
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
    children: [],
    rawValue: config
  };
};

const getRawMongoRunnerConfigurations = (vscode) => {
  const wsConfiguration = vscode.workspace.getConfiguration();
  const connectsConfig = wsConfiguration.get('mongoRunner.connections');
  const connectConfig = wsConfiguration.get('mongoRunner.connection');
  if (Array.isArray(connectsConfig)) {
    return connectsConfig;
  }
  return [connectConfig];
};

const getMongoConfigurations = (vscode) => {
  const rawConfigs = getRawMongoRunnerConfigurations(vscode);
  return rawConfigs.map(config => getConfiguration(config));
};

const TreeType = {
  host: 0,
  dbs: 1,
  users: 2,
  roles: 3
};

module.exports = {
  getMongoConfigurations,
  TreeType,
  getConfiguration,
  getConnectionName,
  getRawMongoRunnerConfigurations
};
