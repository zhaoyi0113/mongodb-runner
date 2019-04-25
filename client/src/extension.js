// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const { LanguageClient, TransportKind } = require('vscode-languageclient');
const TreeExplorer = require('./tree');
const { registerCommands } = require('./commands');
const { MongoCodeLensProvider, hoverProvider } = require('./providers');

const mongodbLangSchemas = [
  { scheme: 'untitled', language: 'mongodbRunner' },
  { scheme: 'file', language: 'mongodbRunner' },
  { scheme: 'mr', language: 'mongodbRunner' },
];

const launchLanguageServer = context => {
  // The server is implemented in node
  const serverModule = context.asAbsolutePath(
    path.join('server', 'src', 'server.js')
  );
  // The debug options for the server
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
  const serverOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };
  const clientOptions = {
    // Register the server for plain text documents
    documentSelector: mongodbLangSchemas,
    synchronize: {
      // Notify the server about file changes to '.clientrc files contain in the workspace
      fileEvents: vscode.workspace.createFileSystemWatcher('**/*')
    }
  };

  // Create the language client and start the client.
  const client = new LanguageClient(
    'mongoRunnerLanguageServer',
    'MongoDB Runner Language',
    serverOptions,
    clientOptions
  );
  client.start();
  global.client = client;
};

const registerProviders = ctx => {
  vscode.languages.registerHoverProvider('javascript', hoverProvider);
  ctx.subscriptions.push(
    vscode.languages.registerCodeLensProvider(mongodbLangSchemas, new MongoCodeLensProvider())
  );
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "mongo-runner" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  registerCommands(context);
  launchLanguageServer(context);
  // registerProviders(context);
  global.treeExplorer = new TreeExplorer(context);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
