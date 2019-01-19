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
  let editorwraper = editors.find(
    editor => editor.uuid === uuid && editor.dbName === dbName
  );
  if (editorwraper) {
    return editorwraper;
  }
  editorwraper = new EditorWrapper(editor, uuid, dbName);
  editors.push(editorwraper);
  return editorwraper;
};

const getActivateEditorWrapper = () => {
  const activateEditor = vscode.window.activeTextEditor;
  return editors.find(
    wrapper => wrapper.editor._id === activateEditor._id
  );
};

module.exports = { pushEditor, getActivateEditorWrapper };
