const os = require('os');

const editorComments = `// Welcome to MongoDB Runner editor, please keep 'db' instance. ${
  os.EOL
}// All methods which are compitable with MongoDB NodeJS driver can be used in this editor.${
  os.EOL
}// (https://mongodb.github.io/node-mongodb-native/4.4/)`;

module.exports = { editorComments };
