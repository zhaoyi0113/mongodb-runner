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
  console.log('initialize ', params);
});

documents.onDidChangeContent(change => {
  console.log('changed:', change.document);
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
  connection.sendDiagnostics({uri: change.document.uri, diagnostics: [diagnostic]});
});

documents.listen(connection);

// Listen on the connection
connection.listen();
