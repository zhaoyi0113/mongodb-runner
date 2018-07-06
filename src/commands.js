const vscode = require('vscode');
const { getMongoInspector } = require('./connection');

const registerCommands = () => {
    vscode.commands.registerCommand('mongoRunner.serverStatus', () => {
        console.log('serverStatus');
        const inspector = getMongoInspector();
        inspector.serverStats()
            .then(stats => {
                return vscode.workspace.openTextDocument({ content: JSON.stringify(stats), language: 'json' });
            })
            .then((document) => {
                console.log('document:', document);
                return vscode.window.showTextDocument(document, 1, true);
            })
            .then((doc) => {
                vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', doc.document.uri)
            })
            .catch(err => console.error(err));
    });
};

module.exports = {
    registerCommands
};
