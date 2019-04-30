const esprima = require('esprima');
const { parseDocument, getCallExpression } = require('../src/parser');
const { CommandType, CommandIdentifier } = require('../src/commands');

describe('command test suite', () => {
  it('test', () => {
    let parsed = parseDocument(
      'db.collection("test").find({"_id": new ObjectId("5ba2bfcf6d2a0312c7ec12c6")})'
    );
    console.log(parsed);
  });
});
