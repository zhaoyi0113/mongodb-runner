const esprima = require('esprima');
const escodegen = require('escodegen');
const { createCommand } = require('./commands');

const getAllCallExpressions = body => {
  return body.reduce((accumulate, expressionStatement) => {
    switch (expressionStatement.type) {
      case esprima.Syntax.ExpressionStatement:
        if (
          expressionStatement.expression &&
          expressionStatement.expression.type === esprima.Syntax.CallExpression
        ) {
          accumulate.push(expressionStatement.expression);
        }
        break;
    }
    return accumulate;
  }, []);
};

const generateCommand = expression => {
  let methodName = '';
  if (expression.callee.type === esprima.Syntax.MemberExpression) {
    methodName = expression.callee.property.name;
  }
  return { type: methodName, ast: expression };
};

const whetherDBCOmmand = exp => {
  const match = escodegen.generate(exp).match(/^db/);
  return match;
};

const parseCallExpression = callExps => {
  return callExps
    .filter(exp => whetherDBCOmmand(exp))
    .map(exp => generateCommand(exp))
    .map(({ type, ast }) => createCommand(type, ast, escodegen.generate(ast)));
};

const parseDocument = txt => {
  try {
    const ast = esprima.parseScript(txt, { range: true, loc: true });
    const callExps = getAllCallExpressions(ast.body);
    return parseCallExpression(callExps);
  } catch (err) {
    console.error('parse error.');
  }
};

module.exports = { parseDocument };
