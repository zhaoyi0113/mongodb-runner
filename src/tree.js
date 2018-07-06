const vscode = require('vscode');
const { TreeItemCollapsibleState, EventEmitter, Uri } = require('vscode');
const mongodbTree = require('mongodb-topology');
const _ = require('lodash');

const Connection = require('./connection');

const config = require('./config');
const IDS = {
  root: 0,
  dbs: 1,
  users: 2,
  roles: 3
};

const root = {
  label: 'MongoDB',
  id: IDS.root,
  tooltip: 'MongoDB',
  collapsibleState: TreeItemCollapsibleState.Collapsed,
  // command: {   command: 'mongoRunner.refresh' }
};

const loadMongoTree = () => {
  const mongoConfig = config.getMongoConfiguration();
  if (mongoConfig.url) {
    return Connection.connectMongoDB(mongoConfig);
  }
  vscode
    .window
    .showInformationMessage('No Mongo Configuration.');
  return Promise.resolve();
}

class MongoTreeProvider {
  constructor() {
    this._onDidChangeTreeData = new EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.loaded = false;
  }

  /**
   * The data structure 
   * @param {*} data 
   */
  loadTree(data) {
    console.log('load data ', data);
    if (!data) {
      return;
    }
    this.treeData = this.convertToTreeData(data);
    this._onDidChangeTreeData.fire();
    this.loaded = true;
  }

  convertToTreeData(data) {
    const treeData = [];
    _.forOwn(data, (v, k) => {
      let resource;
      // if(k === 'databases') {
      //   resource = Uri.parse('file:./database.png');
      // }
      treeData.push({ name: k, type: k, children: v, resource });
    });
    return treeData;
  }

  getTreeItem(element) {
    if (element.id === IDS.root) {
      return element;
    }
    const collapsibleState = element.children && element.children.length > 0 ? TreeItemCollapsibleState.Collapsed : null;
    const treeItem = { id: `${element.type}_${element.name}`, label: element.name, collapsibleState, contextValue: element.type };
    if (element.resource) {
      treeItem.resourceUri = element.resource;
    }
    return treeItem;
  }

  getChildren(element) {
    if (!element) {
      return [root];
    }
    if (element.id === IDS.root) {
      if (!this.isLoaded()) {
        return this.refresh();
      }
      return this.treeData;
    }
    return element.children;
  }

  refresh() {
    loadMongoTree().then(data => this.loadTree(data));
  }

  isLoaded() {
    return this.loaded;
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
      this.provider.refresh();
    }
  }

  registerCommands() {
    vscode
      .commands
      .registerCommand('mongoRunner.refresh', () => {
        vscode
          .window
          .showInformationMessage('Refresh Mongo Connection');
        this.provider.refresh();
      });
    vscode
      .commands
      .registerCommand('extension.mongoRunner.getConfiguration', () => {
        this.provider.refresh();
      })
  }
}

module.exports = {
  TreeExplorer
};
