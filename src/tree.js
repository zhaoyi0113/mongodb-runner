const vscode = require('vscode');
const {TreeItemCollapsibleState} = require('vscode');
const mongodbTree = require('mongodb-tree');

const config = require('./config');

const root = {
  label: 'MongoDB',
  id: '0',
  tooltip: 'MongoDB',
  collapsibleState: TreeItemCollapsibleState.Collapsed
};

class TreeProvider {

  loadTree(data) {
    console.log('load tree', data);
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    return element
      ? [
        {
          label: 'Parent',
          id: '10',
          tooltip: 'Root',
          command: {
            command: 'extension.mongoRunner.getConfiguration'
          }
        }
      ] : [root];
  }
}

class TreeExplorer {
  constructor(context) {
    this.provider = new TreeProvider();
    context
      .subscriptions
      .push(vscode.workspace.registerTextDocumentContentProvider('Data', this.provider));
    this.treeViewer = vscode
      .window
      .createTreeView('nodeDependencies', {treeDataProvider: this.provider});
    this.registerCommands();
    this.connectMongoDB();
  }

  registerCommands() {
    vscode
      .commands
      .registerCommand('nodeDependencies.refresh', () => {
        vscode
          .window
          .showInformationMessage('refresh mongo');
      });
    vscode
      .commands
      .registerCommand('extension.mongoRunner.getConfiguration', () => {
        this.connectMongoDB();
      })
  }

  connectMongoDB() {
    const mongoConfig = config.getMongoConfiguration();
    if (mongoConfig.activeOnStartUp) {
      // connect to mongodb instance
      console.log('mongo config ', mongoConfig);
      mongodbTree
        .connect(mongoConfig.url, {})
        .then((inspector) => {
          return inspector.inspect();
        })
        .then((tree) => {
          console.log('tree:', tree);
          this.provider.loadTree(tree);
        })
        .catch((err) => {
          console.error(err);
        })
    }
  }
}

module.exports = {
  TreeProvider,
  TreeExplorer
};
