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
  TextDocumentPositionParams,
  RequestType
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

connection.onRequest(
  new RequestType('textDocument/codeLens'),
  (event, token) => {
    console.log('code lens:', event.textDocument, token);
    const { textDocument } = event;
    const text = documents.get(event.textDocument.uri).getText();
    return [
      {
        command: {
          command: 'mongoRunner.selectRunConnection',
          title: 'run',
          tooltip: 'tooltip',
          arguments: [text]
        },
        isResolved: true,
        range: {
          start: { line: 1 },
          end: { line: 1 },
          isSingleLine: true,
          isEmpty: false
        }
      }
    ];
  }
);

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
