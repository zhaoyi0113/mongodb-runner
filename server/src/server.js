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
	
});

documents.onDidChangeContent((change) => {
  console.log('changed:', change.document);
  const text = change.document.getText();
  console.log('text:', text);
});

documents.listen(connection);

// Listen on the connection
connection.listen();
