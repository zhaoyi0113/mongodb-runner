const vscode = require('vscode');

const config = require('./config');

class TreeProvider {
  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    return element
      ? {}
      : [
        {
          label: 'Parent',
          id: '10',
          tooltip: 'Root',
          command: {
            command: 'extension.mongoRunner.getConfiguration'
          }
        }
      ];
  }
}

class TreeExplorer {
  constructor(context) {
    const provider = new TreeProvider();
    context
      .subscriptions
      .push(vscode.workspace.registerTextDocumentContentProvider('Data', provider));
    this.ftpViewer = vscode
      .window
      .createTreeView('nodeDependencies', {treeDataProvider: provider});
    this.registerCommands();
  }

  registerCommands() {
    vscode
      .commands
      .registerCommand('extension.mongoRunner.getConfiguration', () => {
        vscode
          .window
          .showInformationMessage('Selected characters: ' + JSON.stringify(config.getMongoConfiguration()));
      })
  }
}

module.exports = {
  TreeProvider,
  TreeExplorer
};
