const {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  RequestType,
} = require('vscode-languageserver');
const os = require('os');
const { parseDocument } = require('./parser');
const { CommandIdentifier } = require('./commands');
const { getTextDiagnostics } = require('./diagnostic');
const { format } = require('./formatter');

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments();

connection.onInitialize(params => {
  return {
    capabilities: {
      textDocumentSync: documents.syncKind,
      documentFormattingProvider: true,
      documentRangeFormattingProvider: true,
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

connection.onRequest('textDocument/rangeFormatting', (event) => {
  const text = documents.get(event.textDocument.uri).getText(event.range);
  const formatted = format(text, event.options, event.range);
  return formatted;
});

connection.onRequest('textDocument/formatting', (event) => {
  const document = documents.get(event.textDocument.uri);
  const text = document.getText();
  const range = {
    start: {line: 0, character: 0},
    end: {line: document.lineCount, character: 0}
  };
  const formatted = format(text, event.options, range);
  return formatted;
});

connection.onRequest('textDocument/completion', (event) => {

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
