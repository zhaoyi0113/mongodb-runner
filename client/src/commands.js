const vscode = require('vscode');
const { VM } = require('vm2');
const {
  getMongoInspector,
  connectMongoDB,
  ConnectStatus,
  getConnectionConfig
} = require('./connection');
const { eventDispatcher, EventType } = require('./event-dispatcher');
const { convertToTreeData } = require('./tree-data-converter');
const { getMongoConfiguration } = require('./config');

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
  return connectMongoDB(config)
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
        eventDispatcher.emit(EventType.Disconnect, db.uuid);
      })
      .catch(err => {
        console.error(err);
        vscode.window.showErrorMessage('Failed to close connection.');
      });
  }
};

const serverStatusHandler = e => {
  const inspector = getMongoInspector(e.uuid);
  inspector
    .serverStats()
    .then(stats => {
      return openTextInEditor(JSON.stringify(stats, undefined, 4));
    })
    .catch(err => console.error(err));
};

const serverBuildInfoHandler = e => {
  const inspector = getMongoInspector(e.uuid);
  inspector
    .buildInfo()
    .then(stats => {
      return openTextInEditor(JSON.stringify(stats, undefined, 4));
    })
    .catch(err => console.error(err));
};

const deleteDatabase = e => {
  getMongoInspector(e.uuid)
    .deleteDatabase(e.dbName)
    .then(() => eventDispatcher.emit(EventType.Refresh))
    .catch(err => vscode.window.showErrorMessage(err));
};

const deleteCollection = e => {
  getMongoInspector(e.uuid)
    .deleteCollection(e.dbName, e.colName)
    .then(() => eventDispatcher.emit(EventType.Refresh))
    .catch(err => vscode.window.showErrorMessage(err));
};

const getCollectionAttributes = e => {
  const inspector = getMongoInspector(e.uuid);
  return inspector
    .getCollectionAttributes(e.dbName, e.name)
    .then(attributes => {
      eventDispatcher.emit(EventType.FindCollectionAttributes, {
        dbName: e.dbName,
        colName: e.name,
        attributes,
        uuid: e.uuid
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
          return getMongoInspector(e.uuid).createIndex(
            e.dbName,
            e.colName,
            idxParam
          );
        } catch (err) {
          vscode.window.showErrorMessage(err.message);
        }
      }
    })
    .then(ret => {
      if (ret) {
        vscode.window.showInformationMessage('Create index: ' + ret);
        const config = getConnectionConfig(e.uuid);
        if (config) {
          refreshConnection(config);
        }
      }
    });
};

const testLanguageServer = event => {
  let e;
  openTextInEditor('db.test.createIndex()', 'mongodbRunner')
    .then(({ editor }) => {
      e = editor;
      return openTextDocument('', 'json');
    }) // split the view for output
    .then(doc => vscode.window.showTextDocument(doc, e.viewColumn + 1));
};

const getIndex = e => {
  getMongoInspector(e.uuid)
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
          return getMongoInspector(e.uuid).simpleQuery(
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
  return getMongoInspector(e.uuid)
    .simpleQuery(e.dbName, e.name)
    .then(docs => openTextInEditor(JSON.stringify(docs), 'json'))
    .catch(err => vscode.window.showErrorMessage(err));
};

const deleteIndex = e => {
  console.log('deleteIndex:', e);
  getMongoInspector(e.uuid)
    .deleteIndex(e.dbName, e.colName, e.name)
    .then(() => eventDispatcher.emit(EventType.Refresh))
    .catch(err => vscode.window.showErrorMessage(err));
};

const refreshConnection = e => {
  console.log('refresh ', e);
  return connectDatabase(e);
};

const refreshAllConnections = () => {
  const config = getMongoConfiguration();
  const treeData = global.treeExplorer.provider.treeData;
  console.log('config:', config, 'treeData:', treeData);
  if (treeData) {
    treeData.forEach(data => {
      if (data.status === ConnectStatus.CONNECTED) {
        refreshConnection(data);
      }
    });
  }
};

const runCommand = e => {
  console.log('run command:', e);
  const inspector = getMongoInspector(e.uuid);
  console.log('inspector:', inspector);
  const db = inspector.driver.db(e.dbName);
  const code = 'db \
    .collections()';
  try {
    const vm = new VM({ sandbox: { db } });
    const result = vm.run(code);
    result.then(cols => console.log('cols:', cols));
  } catch (err) {
    console.error(err);
  }
};

const registerCommands = () => {
  vscode.commands.registerCommand('mongoRunner.refresh', refreshAllConnections);
  // server command
  vscode.commands.registerCommand('mongoRunner.hostConnect', connectDatabase);
  vscode.commands.registerCommand(
    'mongoRunner.hostDisconnect',
    disconnectDatabase
  );
  vscode.commands.registerCommand('mongoRunner.hostRefresh', refreshConnection);
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

  vscode.commands.registerCommand('mongoRunner.testRunCmd', runCommand);
};

module.exports = {
  registerCommands
};
