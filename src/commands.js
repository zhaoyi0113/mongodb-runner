const vscode = require('vscode');



const registerCommands = () => {
    vscode.commands.registerCommand('mongoRunner.serverStatus', () => {
        console.log('serverStatus');
    });
};

module.exports = {
    registerCommands
}