const vscode = require('vscode');

const getMongoConfiguration = () => {
  const url = vscode
    .workspace
    .getConfiguration()
    .get('mongoRunner.connection.url');
    const activeOnStartUp = vscode
      .workspace
      .getConfiguration()
      .get('mongoRunner.connection.activeOnStartUp');
  const userName = vscode
    .workspace
    .getConfiguration()
    .get('mongoRunner.connection.userName');
  const password = vscode
    .workspace
    .getConfiguration()
    .get('mongoRunner.connection.password');
  const options = vscode
      .workspace
      .getConfiguration()
      .get('mongoRunner.connection.options');
  return {url, userName, password, options, activeOnStartUp};
};

module.exports = {
  getMongoConfiguration
}