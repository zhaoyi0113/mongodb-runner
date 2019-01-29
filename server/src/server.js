const {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  RequestType
} = require('vscode-languageserver');
const os = require('os');
const { parseDocument } = require('./parser');
const { CommandIdentifier } = require('./commands');
const { getTextDiagnostics } = require('./diagnostic');

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments();

connection.onInitialize(params => {
  return {
    capabilities: {
      textDocumentSync: documents.syncKind,
      completionProvider: {
        resolveProvider: true
      },
      codeLensProvider: {
        resolveProvider: true
      }
    }
  };
});

connection.onDidChangeWatchedFiles(change => {
  // Monitored files have change in VS Code
});

connection.onRequest(
  new RequestType('textDocument/codeLens'),
  (event) => {
    const text = documents.get(event.textDocument.uri).getText();
    const parsed = parseDocument(text);
    return parsed;
  }
);

connection.onRequest('executeAll', event => {
  const commands = parseDocument(event);
  if (commands) {
    return commands
      .filter(c => c.identifier === CommandIdentifier.original)
      .map(c => c.command.arguments[0])
      .join(os.EOL);
  }
  return '';
});

documents.onDidChangeContent(change => {
  const text = change.document.getText();
  const diagnostics = getTextDiagnostics(text);
  connection.sendDiagnostics({
    uri: change.document.uri,
    diagnostics: [diagnostics]
  });
});

documents.onDidClose(event => {
  console.log('document closed:', event);
});

documents.listen(connection);

// Listen on the connection
connection.listen();
