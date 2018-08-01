const { TreeInspector } = require("mongodb-topology");
const { MongoClient } = require("mongodb");

const vscode = require("vscode");

let inspector;

const connect = (mongoConfig, user, password) => {
  const options = { useNewUrlParser: true };
  if (user && password) {
    options.auth = {user, password};
  }
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      mongoConfig.url,
      options,
      (err, driver) => {
        if (err) {
          console.error(err);
          vscode.window.showErrorMessage("Failed to connect MongoDB.");
          return reject(err);
        }
        inspector = new TreeInspector(driver);
        inspector
          .inspect()
          .then(tree => {
            resolve(tree);
          })
          .catch(err => reject(err));
      }
    );
  });
};

const connectMongoDB = mongoConfig => {
  // connect to mongodb instance
  return new Promise((resolve, reject) => {
    const { user } = mongoConfig;
    if (user) {
      vscode.window
        .showInputBox({ placeHolder: `Input password for ${user} to connect to ${mongoConfig.url}`, password: true })
        .then(pwd => {
          if(!pwd) {
            vscode.window.showErrorMessage('password is not valid.');
            reject(new Error('password is not valid.'));
          }
          resolve(connect(mongoConfig, user, pwd));
        });
    } else {
      resolve(connect(mongoConfig));
    }
  });
};

const getMongoInspector = () => inspector;

module.exports = { connectMongoDB, getMongoInspector };
