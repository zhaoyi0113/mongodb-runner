const { TreeInspector } = require("mongodb-topology");
const { MongoClient } = require("mongodb");

const vscode = require("vscode");

let inspector;

const connectMongoDB = mongoConfig => {
  // connect to mongodb instance
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      mongoConfig.url, {useNewUrlParser: true}, 
      (err, driver) => {
        if (err) {
          console.error(err);
          vscode.window.showErrorMessage("Failed to connect MongoDB.");
          return reject(err);
        }
        inspector = new TreeInspector(driver);
        inspector.inspect().then(tree => {
          resolve(tree);
        }).catch(err => reject(err));
      }
    );
  });
};

const getMongoInspector = () => inspector;

module.exports = { connectMongoDB, getMongoInspector };
