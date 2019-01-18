const esprima = require('esprima');

class MongoCodeLensProvider {
  provideCodeLenses(document, token) {
    
    return [
      {
        command: {command: 'mongoRunner.testLanguageServer', title: 'title', tooltip: 'tooltip'},
        isResolved: true,
        range: {
          start: {line: 1},
          end: {line: 1},
          isSingleLine: true,
          isEmpty: false
        }
      }
    ];
  }

  resolveCodeLens(codeLens, token) {
    return [
      {
        command: {command: '', title: 'title', tooltip: 'tooltip'},
        isResolved: true,
        range: {
          start: {line: 1},
          end: {line: 1},
          isSingleLine: true,
          isEmpty: false
        }
      }
    ]
  }
}

module.exports = {
  MongoCodeLensProvider,
};
