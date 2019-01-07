const {
  createConnection,
  TextDocuments,
  TextDocument,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams
} = require('vscode-languageserver');

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments();

connection.onInitialize(params => {
  console.log('mongodb language initialize ');
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
  console.log('We received an file change event,', change);
});

documents.onDidChangeContent(change => {
  console.log('doc is changed:', change.document);
  const text = change.document.getText();
  console.log('text:', text);
  const diagnostic = {
    severity: DiagnosticSeverity.Warning,
    range: {
      start: change.document.positionAt(0),
      end: change.document.positionAt(change.document.getText().length)
    },
    message: ' this is a demo'
  };
  connection.sendDiagnostics({
    uri: change.document.uri,
    diagnostics: [diagnostic]
  });
});

documents.onDidClose(event => {
  console.log('document closed:', event);
});

documents.listen(connection);

// Listen on the connection
connection.listen();
