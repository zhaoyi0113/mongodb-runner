const vscode = require('vscode');
const { getMongoInspector } = require('./connection');
const {eventDispatcher, EventType} = require('./event-dispatcher');

const openTextInEditor = (text, language='json') => {
    return vscode.workspace.openTextDocument({ content: text, language })
    .then((doc) => vscode.window.showTextDocument(doc, 1, true))
    .then(() => {
        return vscode.commands.executeCommand('editor.action.formatDocument');
    });
}

const serverStatusHandler = () => {
    const inspector = getMongoInspector();
    inspector.serverStats()
        .then(stats => {
            return openTextInEditor(JSON.stringify(stats, undefined, 4));
        })
        .catch(err => console.error(err));
};

const serverBuildInfoHandler = () => {
    const inspector = getMongoInspector();
    inspector.buildInfo()
        .then(stats => {
            return openTextInEditor(JSON.stringify(stats, undefined, 4));
        })
        .catch(err => console.error(err));
};

const createCollection = () => {
    const options = {w: null, j: false, raw: false, capped: false};
    const script = `
        const options=${JSON.stringify(options, undefined, 4)};
        db.createCollection(collectionName, options)`;
    openTextInEditor(script, 'javascript');
};

const getCollectionAttributes = (e) => {
    console.log(e);
    const inspector = getMongoInspector();
    return inspector.getCollectionAttributes(e.dbName, e.name)
        .then((attributes) => {
            eventDispatcher.emit(EventType.FindCollectionAttributes, {dbName: e.dbName, colName: e.name, attributes});
        })
        .catch(err => console.error(err));
};

const createIndex = (e) => {
    vscode.window.showInputBox({placeHolder: '{"fieldA": 1, "fieldB": -1}'})
    .then(result => {
        try{
            const idxParam = (JSON.parse(result));
            return getMongoInspector().createIndex(e.dbName, e.name, idxParam);
        }catch(err) {
            vscode.window.showErrorMessage(err.message);
        }
    })
    .then((ret) => {
        vscode.window.showInformationMessage("Create index: " + ret);
        eventDispatcher.emit(EventType.Refresh);
    });
};

const getIndex = (e) => {
    getMongoInspector().getCollectionIndexes(e.dbName, e.name)
    .then((indexes) => {
        console.log('get indexes ', indexes);
        openTextInEditor(JSON.stringify(indexes), 'json');
    })
    .catch(err => console.error(err));
};

const registerCommands = () => {
    // server command
    vscode.commands.registerCommand('mongoRunner.serverStatus', serverStatusHandler);
    vscode.commands.registerCommand('mongoRunner.serverBuildInfo', serverBuildInfoHandler);

    // database commands
    vscode.commands.registerCommand('mongoRunner.createCollection', createCollection);

    //collection commands
    vscode.commands.registerCommand('mongoRunner.getCollectionAttributes', getCollectionAttributes);
    vscode.commands.registerCommand('mongoRunner.getIndex', getIndex);
    vscode.commands.registerCommand('mongoRunner.createIndex', createIndex);
};

module.exports = {
    registerCommands
};
