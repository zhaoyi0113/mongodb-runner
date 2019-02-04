const { Hover } = require('vscode');
const esprima = require('esprima');
const escodegen = require('escodegen');

const findStatementByLineNumber = (statements, line) => {
  let found = null;
  if (!statements) return null;
  if (statements.body) {
    found = findStatementByLineNumber(statements.body, line);
  } else {
    for (let i = 0; i < statements.length; i += 1) {
      const statement = statements[i];
      if (statement.body) {
        found = findStatementByLineNumber(statement.body, line);
      } else {
        if (
          statement.loc &&
          (statement.loc.start.line <= line && statement.loc.end.line >= line)
        ) {
          found = statement;
          break;
        }
      }
    }
  }
  return found;
};

const hoverProvider = (document, position) => {
  const line = document.lineAt(position);
  console.log('line text:', line.text, position);
  console.log('all text:', document.getText());
  const allText = document.getText();
  try {
    const ast = esprima.parseScript(allText, { loc: true });
    console.log('syntax tree ', ast);
    const statement = findStatementByLineNumber(ast.body, position.line + 1);
    if (statement) {
      console.log('match statement ', escodegen.generate(statement));
      return new Hover(escodegen.generate(statement));
    }
  } catch (err) {
    return null;
  }
  // return new Hover('Hello World');
};

module.exports = { hoverProvider };
