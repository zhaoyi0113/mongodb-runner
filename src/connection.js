const mongodbTree = require('mongodb-topology');
const vscode = require('vscode');

let inspector;

const connectMongoDB = (mongoConfig) => {
    // connect to mongodb instance
    return mongodbTree
        .connect(mongoConfig.url, {})
        .then((d) => {
            inspector = d;
            return inspector.inspect();
        })
        .catch((err) => {
            console.error(err);
            vscode.window.showErrorMessage('Failed to connect MongoDB.');
        })
};

const getMongoInspector = () => inspector;

module.exports = {connectMongoDB, getMongoInspector};
