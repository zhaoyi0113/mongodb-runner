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
  const user = vscode
    .workspace
    .getConfiguration()
    .get('mongoRunner.connection.user');
  const options = vscode
      .workspace
      .getConfiguration()
      .get('mongoRunner.connection.options');
  return {url, user, options, activeOnStartUp};
};

module.exports = {
  getMongoConfiguration
}