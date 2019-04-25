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
  let wrapper = editors.find(wrapper => wrapper.editor.id === activateEditor.id);
  if (!wrapper && editors.length > 0) {
    wrapper = editors[0];
  }
  return wrapper;
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
