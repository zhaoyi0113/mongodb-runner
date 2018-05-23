const vscode = require('vscode');

const getMongoConfiguration = () => {
  const url = vscode
    .workspace
    .getConfiguration()
    .get('mongoRunner.connection.url');
  const userName = vscode
    .workspace
    .getConfiguration()
    .get('mongoRunner.connection.userName');
  const password = vscode
    .workspace
    .getConfiguration()
    .get('mongoRunner.connection.password');
  return {url, userName, password};
};

module.exports = {
  getMongoConfiguration
}