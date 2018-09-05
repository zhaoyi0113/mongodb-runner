const {createConnection, TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
	ProposedFeatures, InitializeParams, DidChangeConfigurationNotification, CompletionItem,
	CompletionItemKind, TextDocumentPositionParams} = require('vscode-languageserver');

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments();

documents.listen(connection);

// Listen on the connection
connection.listen();