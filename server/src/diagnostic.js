const esprima = require('esprima');
const {
  DiagnosticSeverity,
} = require('vscode-languageserver');

const getTextDiagnostics = text => {
  try {
    const validate = esprima.parseScript(text, {
      loc: true,
      tolerant: true
    });
    if (validate && validate.errors && validate.errors.length > 0) {
      return validate.errors.map(error => {
        const start = {line: error.lineNumber, character: error.index};
        const range = {start, end: start};
        return {
          range,
          message: 'this is an error',
          severity: DiagnosticSeverity.Error
        };
      });
    }
  } catch (err) {
    if (err) {
      return [{
        range: {
          start: {line: err.lineNumber, character: 0},
          end: {line: err.lineNumber, character: 0}
        },
        message: err.description,
        severity: DiagnosticSeverity.Error
      }];
    }
  }
  return [];
};

module.exports = { getTextDiagnostics };
