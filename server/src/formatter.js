const esprima = require('esprima');
const escodegen = require('escodegen');
const os = require('os');

const format = (text, options, range) => {
  try {
    const ast = esprima.parseScript(text, {comment: true, loc: true, range: true, tokens: true});
    const astComment = escodegen.attachComments(ast, ast.comments, ast.tokens);
    const formatted = escodegen.generate(astComment, {
      format: {
        newline: os.EOL
      },
      comment: true,
    });
    return [{
      range,
      newText: formatted,
      newline: os.EOL
    }];
  } catch (err) {
    console.error('format error ', err);
  }
};

module.exports = { format };
