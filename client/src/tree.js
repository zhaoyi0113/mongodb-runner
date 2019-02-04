const vscode = require('vscode');
const { TreeItemCollapsibleState, EventEmitter, Uri } = require('vscode');
const { TreeNodeTypes } = require('mongodb-topology');
const _ = require('lodash');
const { ConnectStatus } = require('./types');

const { eventDispatcher, EventType } = require('./event-dispatcher');
const TreeItem = require('./tree-item');

const { TreeType, getMongoConfigurations } = require('./config');

let context;
class MongoTreeProvider {
  constructor() {
    this._onDidChangeTreeData = new EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.loaded = false;
    this.loadData();
    eventDispatcher.on(
      EventType.FindCollectionAttributes,
      this.addCollectionAttributes.bind(this)
    );
    eventDispatcher.on(EventType.Refresh, this.refresh.bind(this));
    eventDispatcher.on(EventType.Connect, this.onConnect.bind(this));
    eventDispatcher.on(EventType.Disconnect, this.onDisconnect.bind(this));
  }

  /**
   * The data structure
   * @param {*} data
   */
  loadTree(data) {
    if (!data || !data.length) {
      return;
    }
    this.treeData = data;
    this.treeData.forEach(tree => {
      tree.originConfig = _.cloneDeep(tree.rawValue);
    });
    this._onDidChangeTreeData.fire();
    this.loaded = true;
  }

  deleteRootItem(uuid) {
    this.treeData = this.treeData.filter(t => t.uuid !== uuid);
    this._onDidChangeTreeData.fire();
  }

  addRootItem(config) {
    const newTreeData = config;
    newTreeData.originConfig = _.cloneDeep(config.rawValue);
    this.treeData.push(newTreeData);
    this._onDidChangeTreeData.fire();
  }

  addCollectionAttributes(event) {
    const treeData = this.treeData.find(d => d.uuid === event.uuid);
    if (!treeData) {
      return;
    }
    const dbs = treeData.children.find(d => d.type === TreeNodeTypes.DATABASES);
    const db = dbs.children.find(c => c.name === event.dbName);
    const col = db.collections.find(c => c.name === event.colName);
    col.attributes = event.attributes;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    if (element.children && element.children.length <= 0) {
      return new TreeItem(element);
    }
    let children = this.getChildren(element);
    const collapsibleState =
      children && children.length > 0
        ? TreeItemCollapsibleState.Collapsed
        : null;
    const treeItem = new TreeItem(element, collapsibleState);
    if (element.resource) {
    }
    return treeItem;
  }

  getChildren(element) {
    if (!element && this.treeData) {
      return this.treeData.map(data =>
        Object.assign(data, {
          label: data.name,
          id: TreeType.host,
          tooltip: data.name,
          collapsibleState: TreeItemCollapsibleState.Collapsed
        })
      );
    }
    let children = [];
    if (!element) {
      return children;
    }
    if (element.type === TreeNodeTypes.DATABASES) {
      children = element.children;
    } else if (element.type === TreeNodeTypes.DATABASE) {
      children = element.collections;
    } else if (element.type === TreeNodeTypes.COLLECTION) {
      if (element.indexes && element.indexes.length > 0) {
        children.push({
          name: 'Indexes',
          children: element.indexes,
          type: TreeNodeTypes.INDEXES,
          dbName: element.indexes[0].dbName,
          colName: element.indexes[0].colName,
          uuid: element.uuid,
        });
      }
      if (element.attributes && element.attributes.length > 0) {
        children.push({
          name: 'Attributes',
          children: element.attributes,
          type: TreeNodeTypes.FIELDS
        });
      }
    } else if (element.type === TreeNodeTypes.SHARDS) {
      if (element.shards) {
        children = element.shards;
      } else {
        children = element.children;
      }
    } else if (element.type === TreeNodeTypes.ROLES) {
    } else {
      children = element.children;
    }
    return children;
  }

  refresh() {
    this.loadData();
  }

  onConnect(conn) {
    this.treeData.forEach(data => {
      if (data.uuid === conn.uuid) {
        data.children = conn.tree;
        data.driver = conn.driver;
        data.type = `host:${ConnectStatus.CONNECTED}`;
        data.status = ConnectStatus.CONNECTED;
      }
    });
    this._onDidChangeTreeData.fire();
  }

  onDisconnect(uuid) {
    this.treeData = this.treeData.map(data => {
      if(data.uuid === uuid) {
        data.type = `host:${ConnectStatus.CLOSED}`;
        data.status = ConnectStatus.CLOSED;
        data.children = null;
        data.status = ConnectStatus.CLOSED;
      }
      return data;
    });
    this._onDidChangeTreeData.fire();
  }

  loadData() {
    const configData = getMongoConfigurations(vscode);
    this.loadTree(configData);
  }

  isLoaded() {
    return this.loaded;
  }
}

class TreeExplorer {
  constructor(ctx) {
    this.provider = new MongoTreeProvider();
    context = ctx;
    context.subscriptions.push(
      vscode.workspace.registerTextDocumentContentProvider(
        'Data',
        this.provider
      )
    );
    this.treeViewer = vscode.window.createTreeView('mongoRunner', {
      treeDataProvider: this.provider
    });
    this.registerCommands();
  }

  registerCommands() {
    vscode.commands.registerCommand(
      'extension.mongoRunner.getConfiguration',
      () => {
        this.provider.refresh();
      }
    );
  }
}

module.exports = TreeExplorer;
