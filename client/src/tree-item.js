const path = require('path');
const { TreeNodeTypes } = require('mongodb-topology');
const { ConnectStatus } = require('./types');

const getFilePath = (name, theme) => {
  return path.join(__filename, '..', '..', `resources/${theme}/${name}`);
};

const getItemIcon = type => {
  switch (type) {
    case `host:${ConnectStatus.CLOSED}`:
      return {
        light: getFilePath('close.svg', 'light'),
        dark: getFilePath('close.svg', 'dark')
      };
    case `host:${ConnectStatus.CONNECTED}`:
      return {
        light: getFilePath('connected.svg', 'light'),
        dark: getFilePath('connected.svg', 'dark')
      };
    case TreeNodeTypes.DATABASES:
    case TreeNodeTypes.DATABASE:
      return {
        light: path.join(
          __filename,
          '..',
          '..',
          'resources/light/database.svg'
        ),
        dark: path.join(__filename, '..', '..', 'resources/dark/database.svg')
      };
    case TreeNodeTypes.USERS:
      return {
        light: path.join(__filename, '..', '..', 'resources/light/user.svg'),
        dark: path.join(__filename, '..', '..', 'resources/dark/user.svg')
      };
    case TreeNodeTypes.ROLES:
      return {
        light: path.join(__filename, '..', '..', 'resources/light/role.svg'),
        dark: path.join(__filename, '..', '..', 'resources/dark/role.svg')
      };
    case TreeNodeTypes.COLLECTION:
      return {
        light: path.join(
          __filename,
          '..',
          '..',
          'resources/light/collection.svg'
        ),
        dark: path.join(__filename, '..', '..', 'resources/dark/collection.svg')
      };
    case TreeNodeTypes.PRIMARY:
      return {
        light: path.join(__filename, '..', '..', 'resources/light/primary.svg'),
        dark: path.join(__filename, '..', '..', 'resources/dark/primary.svg')
      };
    case TreeNodeTypes.SECONDARY:
      return {
        light: path.join(
          __filename,
          '..',
          '..',
          'resources/light/secondary.svg'
        ),
        dark: path.join(__filename, '..', '..', 'resources/dark/secondary.svg')
      };
    case TreeNodeTypes.ARBITER:
      return {
        light: path.join(__filename, '..', '..', 'resources/light/arbiter.svg'),
        dark: path.join(__filename, '..', '..', 'resources/dark/arbiter.svg')
      };
    case TreeNodeTypes.REPLICASET:
      return {
        light: path.join(
          __filename,
          '..',
          '..',
          'resources/light/replicaset.svg'
        ),
        dark: path.join(__filename, '..', '..', 'resources/dark/replicaset.svg')
      };
    case TreeNodeTypes.CONFIG:
    case TreeNodeTypes.CONFIGS:
      return {
        light: path.join(__filename, '..', '..', 'resources/light/config.svg'),
        dark: path.join(__filename, '..', '..', 'resources/dark/config.svg')
      };
    case TreeNodeTypes.SHARD:
    case TreeNodeTypes.SHARDS:
      return {
        light: path.join(__filename, '..', '..', 'resources/light/shard.svg'),
        dark: path.join(__filename, '..', '..', 'resources/dark/shard.svg')
      };
    case TreeNodeTypes.MONGOS:
    case TreeNodeTypes.ROUTERS:
      return {
        light: path.join(__filename, '..', '..', 'resources/light/router.svg'),
        dark: path.join(__filename, '..', '..', 'resources/dark/router.svg')
      };
    case TreeNodeTypes.INDEX:
    case TreeNodeTypes.INDEXES:
      return {
        light: path.join(__filename, '..', '..', 'resources/light/index.svg'),
        dark: path.join(__filename, '..', '..', 'resources/dark/index.svg')
      };
    case TreeNodeTypes.FIELDS:
    case TreeNodeTypes.FIELD:
      return {
        light: path.join(__filename, '..', '..', 'resources/light/order.svg'),
        dark: path.join(__filename, '..', '..', 'resources/dark/order.svg')
      };
  }
};

class TreeItem {
  constructor(element, collapsibleState) {
    this.label = element.name;
    this.collapsibleState = collapsibleState;
    this.contextValue = element.type;
    this.iconPath = getItemIcon(element.type);
  }
}

module.exports = TreeItem;
