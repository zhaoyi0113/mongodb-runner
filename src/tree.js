const vscode = require('vscode');
const { TreeItemCollapsibleState, TreeDataProvider } = require('vscode');
const EventEmitter = require('events');
const mongodbTree = require('mongodb-tree');

const config = require('./config');
const IDS = {
  root: 0,
  dbs: 1,
  users: 2,
  roles: 3
}
const root = {
  label: 'MongoDB',
  id: IDS.root,
  tooltip: 'MongoDB',
  collapsibleState: TreeItemCollapsibleState.Collapsed,
  // command: {   command: 'mongoRunner.refresh' }
};

const loadMongoTree = (provider) => {
  const mongoConfig = config.getMongoConfiguration();
  if (mongoConfig.url) {
    return connectMongoDB(mongoConfig).then((data) => {
      console.log('tree:', data);
      provider.loadTree(data);
    });
  }
  vscode
        .window
        .showInformationMessage('No Mongo Configuration.');
  return Promise.resolve();
}

const connectMongoDB = (mongoConfig) => {
  // connect to mongodb instance
  console.log('mongo config ', mongoConfig);
  return mongodbTree
    .connect(mongoConfig.url, {})
    .then((inspector) => {
      return inspector.inspect();
    })
    .catch((err) => {
      console.error(err);
    })
};

const convertMongoTree = (data) => {
  const treeItems = [];
  const dbs = data
    .databases
    .map((db, i) => {
      return {
        id: `db_${i}`,
        label: db.name,
        collapsibleState: db.children && db.children.length > 0
          ? TreeItemCollapsibleState.Collapsed
          : null
      }
    });
  treeItems.push(dbs);
  return treeItems;
};

class MongoTreeProvider {

  loadTree(data) {
    this.treeData = data;
    this._onDidChangeTreeData = new EventEmitter();
    this.onDidChangeTreeData= this._onDidChangeTreeData.event;
    this.onDidChangeTreeData.emit('');
  }

  getTreeItem(element) {
    console.log('get tree item ', element);
    if (element.type === 'database') {
      return { id: `db_${element.name}`, label: element.name, collapsibleState: true, command: '' }
    }
    return element;
  }

  getChildren(element) {
    if (!element) {
      return [root];
    }
    if (element.id === IDS.root) {
      if (!element.children) {
        return loadMongoTree(this);
      }
      return this.treeData;
    }
    return element.children;
  }
}

class TreeExplorer {
  constructor(context) {
    this.provider = new MongoTreeProvider();
    context
      .subscriptions
      .push(vscode.workspace.registerTextDocumentContentProvider('Data', this.provider));
    this.treeViewer = vscode
      .window
      .createTreeView('mongoRunner', { treeDataProvider: this.provider });
    this.registerCommands();

    const mongoConfig = config.getMongoConfiguration();
    if (mongoConfig.activeOnStartUp) {
      loadMongoTree(this.provider);
    }
  }

  registerCommands() {
    vscode
      .commands
      .registerCommand('mongoRunner.refresh', () => {
        vscode
          .window
          .showInformationMessage('Refresh Mongo Connection');
        loadMongoTree(this.provider);
      });
    vscode
      .commands
      .registerCommand('extension.mongoRunner.getConfiguration', () => {
        loadMongoTree(this.provider);
      })
  }
}

module.exports = {
  TreeExplorer: TreeExplorer
};
