// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const { LanguageClient, TransportKind } = require('vscode-languageclient');
const TreeExplorer = require('./tree');
const {registerCommands} = require("./commands");

const launchLanguageServer = (context) => {
    // The server is implemented in node
	const serverModule = context.asAbsolutePath(path.join('server', 'src', 'server.js'));
	// The debug options for the server
	const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
    const serverOptions = {
		run : { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    }
    const clientOptions = {
		// Register the server for plain text documents
        documentSelector: [{ scheme: 'file', language: 'plaintext'},
        { scheme: 'file', language: 'javascript'}],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contain in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc'),
		}
    }
    
    // Create the language client and start the client.
	const client = new LanguageClient('mongoRunnerLanguageServer', 'MongoDB Runner Language', serverOptions, clientOptions);
    client.start();
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mongo-runner" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.numberOfChars', function () {
        // The code you place here will be executed every time your command is executed

        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        let selection = editor.selection;
        let text = editor.document.getText(selection);

        // Display a message box to the user
        vscode.window.showInformationMessage('Selected characters: ' + text.length);
    });

    registerCommands();
    launchLanguageServer(context);
    context.subscriptions.push(disposable);
    new TreeExplorer(context);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;