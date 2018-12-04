const vscode = require('vscode');
const { getMongoInspector, connectMongoDB } = require('./connection');
const { eventDispatcher, EventType } = require('./event-dispatcher');
const { convertToTreeData } = require('./tree-data-converter');

const openTextDocument = (text, language) => {
  return vscode.workspace.openTextDocument({ content: text, language });
};

const openTextInEditor = (text, language = 'json') => {
  let doc;
  return openTextDocument(text, language)
    .then(d => {
      doc = d;
      return vscode.window.showTextDocument(doc, 1, true);
    })
    .then(editor => {
      vscode.commands.executeCommand('editor.action.formatDocument');
      return { doc, editor };
    });
};

const connectDatabase = config => {
  connectMongoDB(config)
    .then(data => {
      const treeData = convertToTreeData(data);
      console.log('tree data:', treeData);
      eventDispatcher.emit(
        EventType.Connect,
        Object.assign(treeData, { uuid: config.uuid, driver: data.driver })
      );
    })
    .catch(err => {
      console.error(err);
      vscode.window.showErrorMessage('Failed to connect!');
    });
};

const disconnectDatabase = db => {
  console.log('disconnect db ', db);
  if (db && db.driver) {
    db.driver
      .close()
      .then(() => {
        vscode.window.showInformationMessage('MongoDB Connection Closed.');
        eventDispatcher.emit(
          EventType.Disconnect,
          db.uuid
        );
      })
      .catch(err => {
        console.error(err);
        vscode.window.showErrorMessage('Failed to close connection.');
      });
  }
};

const serverStatusHandler = () => {
  const inspector = getMongoInspector();
  inspector
    .serverStats()
    .then(stats => {
      return openTextInEditor(JSON.stringify(stats, undefined, 4));
    })
    .catch(err => console.error(err));
};

const serverBuildInfoHandler = () => {
  const inspector = getMongoInspector();
  inspector
    .buildInfo()
    .then(stats => {
      return openTextInEditor(JSON.stringify(stats, undefined, 4));
    })
    .catch(err => console.error(err));
};

const deleteDatabase = e => {
  getMongoInspector()
    .deleteDatabase(e.dbName)
    .then(() => eventDispatcher.emit(EventType.Refresh))
    .catch(err => vscode.window.showErrorMessage(err));
};

const deleteCollection = e => {
  getMongoInspector()
    .deleteCollection(e.dbName, e.colName)
    .then(() => eventDispatcher.emit(EventType.Refresh))
    .catch(err => vscode.window.showErrorMessage(err));
};

const getCollectionAttributes = e => {
  console.log(e);
  const inspector = getMongoInspector();
  return inspector
    .getCollectionAttributes(e.dbName, e.name)
    .then(attributes => {
      eventDispatcher.emit(EventType.FindCollectionAttributes, {
        dbName: e.dbName,
        colName: e.name,
        attributes
      });
    })
    .catch(err => console.error(err));
};

const createIndex = e => {
  vscode.window
    .showInputBox({ placeHolder: '{"fieldA": 1, "fieldB": -1}' })
    .then(result => {
      if (result) {
        try {
          const idxParam = JSON.parse(result);
          return getMongoInspector().createIndex(e.dbName, e.colName, idxParam);
        } catch (err) {
          vscode.window.showErrorMessage(err.message);
        }
      }
    })
    .then(ret => {
      if (ret) {
        vscode.window.showInformationMessage('Create index: ' + ret);
        eventDispatcher.emit(EventType.Refresh);
      }
    });
};

const testLanguageServer = event => {
  let e;
  openTextInEditor('db.test.createIndex()', 'javascript')
    .then(({ editor }) => {
      e = editor;
      return openTextDocument('', 'json');
    }) // split the view for output
    .then(doc => vscode.window.showTextDocument(doc, e.viewColumn + 1));
};

const getIndex = e => {
  getMongoInspector()
    .getCollectionIndexes(e.dbName, e.name)
    .then(indexes => {
      console.log('get indexes ', indexes);
      openTextInEditor(JSON.stringify(indexes), 'json');
    })
    .catch(err => console.error(err));
};

const simpleQuery = e => {
  vscode.window
    .showInputBox({ placeHolder: 'query json condition' })
    .then(res => {
      try {
        if (res) {
          return getMongoInspector().simpleQuery(
            e.dbName,
            e.name,
            JSON.parse(res)
          );
        }
      } catch (err) {
        vscode.window.showErrorMessage(err.message);
      }
    })
    .then(docs => {
      if (docs) {
        openTextInEditor(JSON.stringify(docs), 'json');
      }
    });
};

const findFirst20Docs = e => {
  return getMongoInspector()
    .simpleQuery(e.dbName, e.name)
    .then(docs => openTextInEditor(JSON.stringify(docs), 'json'))
    .catch(err => vscode.window.showErrorMessage(err));
};

const deleteIndex = e => {
  console.log('deleteIndex:', e);
  getMongoInspector()
    .deleteIndex(e.dbName, e.colName, e.name)
    .then(() => eventDispatcher.emit(EventType.Refresh))
    .catch(err => vscode.window.showErrorMessage(err));
};

const registerCommands = () => {
  // server command
  vscode.commands.registerCommand('mongoRunner.hostConnect', connectDatabase);
  vscode.commands.registerCommand(
    'mongoRunner.hostDisconnect',
    disconnectDatabase
  );
  vscode.commands.registerCommand(
    'mongoRunner.serverStatus',
    serverStatusHandler
  );
  vscode.commands.registerCommand(
    'mongoRunner.serverBuildInfo',
    serverBuildInfoHandler
  );

  // database commands
  vscode.commands.registerCommand('mongoRunner.deleteDatabase', deleteDatabase);

  //collection commands
  vscode.commands.registerCommand(
    'mongoRunner.getCollectionAttributes',
    getCollectionAttributes
  );
  vscode.commands.registerCommand('mongoRunner.getIndex', getIndex);
  vscode.commands.registerCommand('mongoRunner.createIndex', createIndex);
  vscode.commands.registerCommand('mongoRunner.simpleQuery', simpleQuery);
  vscode.commands.registerCommand(
    'mongoRunner.findFirst20Docs',
    findFirst20Docs
  );
  vscode.commands.registerCommand(
    'mongoRunner.deleteCollection',
    deleteCollection
  );

  // index commands
  vscode.commands.registerCommand('mongoRunner.deleteIndex', deleteIndex);

  // test launge server
  vscode.commands.registerCommand(
    'mongoRunner.testLanguageServer',
    testLanguageServer
  );
};

module.exports = {
  registerCommands
};
