const vscode = require('vscode');
const {getMongoInspector} = require('./connection');

const registerCommands = () => {
    vscode.commands.registerCommand('mongoRunner.serverStatus', () => {
        console.log('serverStatus');
        const inspector = getMongoInspector();
        inspector.serverStats()
        .then(stats => console.log(stats));
    });
};

module.exports = {
    registerCommands
};
