const vscode = require('vscode');
const { getMongoInspector } = require('./connection');

const openTextInEditor = (text, language='json') => {
    return vscode.workspace.openTextDocument({ content: text, language })
    .then((doc) => vscode.window.showTextDocument(doc, 1, true));
}

const serverStatusHandler = () => {
    const inspector = getMongoInspector();
    inspector.serverStats()
        .then(stats => {
            return openTextInEditor(JSON.stringify(stats));
        })
        // .then((doc) => {
        //     vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', doc.document.uri)
        // })
        .catch(err => console.error(err));
};

const serverBuildInfoHandler = () => {
    const inspector = getMongoInspector();
    inspector.buildInfo()
        .then(stats => {
            return openTextInEditor(JSON.stringify(stats));
        })
        .catch(err => console.error(err));
};

const registerCommands = () => {
    vscode.commands.registerCommand('mongoRunner.serverStatus', serverStatusHandler);
    vscode.commands.registerCommand('mongoRunner.serverBuildInfo', serverBuildInfoHandler);
};

module.exports = {
    registerCommands
};
