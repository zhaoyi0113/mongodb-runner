const vscode = require('vscode');
const { getMongoInspector } = require('./connection');
const eventDispatcher = require('./event-dispatcher');

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

const createCollection = () => {
    const options = {w: null, j: false, raw: false, capped: false};
    const script = `
        const options=${JSON.stringify(options)};
        db.createCollection(collectionName, options)`;
    openTextInEditor(script, 'javascript');
};

const getCollectionAttributes = (e) => {
    console.log('event:', e);
    const inspector = getMongoInspector();
    return inspector.getCollectionAttributes(e.dbName, e.name)
        .then((attributes) => {
            eventDispatcher.emit('set-collection-attributes', {dbName: e.dbName, colName: e.name, attributes});
        })
        .catch(err => console.error(err));
};

const registerCommands = () => {
    vscode.commands.registerCommand('mongoRunner.serverStatus', serverStatusHandler);
    vscode.commands.registerCommand('mongoRunner.serverBuildInfo', serverBuildInfoHandler);
    vscode.commands.registerCommand('mongoRunner.createCollection', createCollection);
    vscode.commands.registerCommand('mongoRunner.getCollectionAttributes', getCollectionAttributes);
};

module.exports = {
    registerCommands
};
