const { TreeInspector } = require('mongodb-topology');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const vscode = require('vscode');
const mongodbUri = require('mongodb-uri');

const inspectors = {};

const getConnectionConfig = uuid => {
  const treeData = global.treeExplorer.provider.treeData;
  if (treeData) {
    return treeData.find(d => d.uuid === uuid);
  }
};

const getConnectionConfigByName = name => {
  const treeData = global.treeExplorer.provider.treeData;
  if (treeData) {
    return treeData.find(d => d.name === name);
  }
};

const getAllConnectionConfigs = () =>
  global.treeExplorer ? global.treeExplorer.provider.treeData : [];

const readFromFile = file => {
  if (file) {
    try {
      return fs.readFileSync(file);
    } catch (e) {
      console.error('read file failed', e);
      vscode.window.showErrorMessage(e.message);
    }
  }
};

const readSSLCert = mongoConfig => {
  const options = {};
  if (mongoConfig.options) {
    const { sslCA, sslCert, sslKey, sslPass } = mongoConfig.options;
    if (sslCert) {
      options.sslCert = readFromFile(sslCert);
    }
    if (sslKey) {
      options.sslKey = readFromFile(sslKey);
    }
    if (sslCA) options.sslCA = sslCA;
    if (sslPass) options.sslPass = sslPass;
  }
  return options;
};

const connect = (mongoConfig, user, password) => {
  let options = { useNewUrlParser: true };
  if (user && password) {
    options.auth = { user, password };
  }
  if (mongoConfig.options) {
    options = Object.assign(options, mongoConfig.options);
  }
  const cert = readSSLCert(mongoConfig);
  options = Object.assign(options, cert);
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      mongoConfig.url,
      options,
      (err, driver) => {
        if (err) {
          console.error(err);
          vscode.window.showErrorMessage('Failed to connect to MongoDB.');
          return reject(err);
        }
        const inspector = new TreeInspector(driver);
        const parsedUri = mongodbUri.parse(mongoConfig.url);

        inspectors[mongoConfig.uuid] = inspector;
        const inspectOptions = {};
        if (parsedUri && parsedUri.database) {
          inspectOptions.currentDb = parsedUri.database;
        }
        inspector
          .inspect(inspectOptions)
          .then(tree => {
            resolve({ tree, mongoConfig, driver });
          })
          .catch(err => {
            reject(err);
            vscode.window.showErrorMessage('Failed to connect MongoDB.');
          });
      }
    );
  });
};

const connectMongoDB = mongoConfig => {
  // connect to mongodb instance
  return new Promise((resolve, reject) => {
    const { user, password } = mongoConfig;
    if (user) {
      if (!password) {
        vscode.window
          .showInputBox({
            placeHolder: `Input password for ${user} to connect to ${
              mongoConfig.url
            }`,
            password: true
          })
          .then(pwd => {
            if (!pwd) {
              return reject(null);
            }
            resolve(
              connect(
                mongoConfig,
                user,
                pwd
              )
            );
          });
      } else {
        resolve(
          connect(
            mongoConfig,
            user,
            password
          )
        );
      }
    } else {
      resolve(connect(mongoConfig));
    }
  });
};

const getMongoInspector = uuid => inspectors[uuid];

module.exports = {
  getAllConnectionConfigs,
  connectMongoDB,
  getMongoInspector,
  getConnectionConfig,
  getConnectionConfigByName
};
