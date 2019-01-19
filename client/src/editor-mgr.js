const vscode = require('vscode');

const editors = [];

class EditorWrapper {
  constructor(editor, uuid, dbName) {
    this.editor = editor;
    this.uuid = uuid;
    this.dbName = dbName;
  }
}

const pushEditor = (editor, uuid, dbName) => {
  let editorwraper = editors.find(e => e.id === editor.id);
  if (editorwraper) {
    return editorwraper;
  }
  editorwraper = new EditorWrapper(editor, uuid, dbName);
  editors.push(editorwraper);
  return editorwraper;
};

const getActivateEditorWrapper = () => {
  const activateEditor = vscode.window.activeTextEditor;
  return editors.find(wrapper => wrapper.editor.id === activateEditor.id);
};

const connectOutputEditor = (wrapper, outputEditor) => {
  wrapper.outputEditor = outputEditor;
};

const disconnectOutputEditor = wrapper => (wrapper.outputEditor = null);

module.exports = {
  pushEditor,
  getActivateEditorWrapper,
  connectOutputEditor,
  disconnectOutputEditor
};
