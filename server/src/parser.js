const esprima = require('esprima');
const escodegen = require('escodegen');
const {createCommand, whetherDBCommand} = require('./commands');

const getCallExpression = (ast, callExps = []) => {
  if (!ast) return;
  switch (ast.type) {
    case esprima.Syntax.CallExpression:
      if (ast.callee && ast.callee.type === esprima.Syntax.MemberExpression) {
        getCallExpression(ast.callee, callExps);
      }
      break;
    case esprima.Syntax.MemberExpression:
      if (ast.object && ast.object.type === esprima.Syntax.CallExpression) {
        callExps.push(ast.object);
        getCallExpression(ast.object.callee, callExps);
      }
      break;

    case esprima.Syntax.ExpressionStatement:
      if (ast.expression && ast.expression.type === esprima.Syntax.CallExpression) {
        callExps.push(ast.expression);
        getCallExpression(ast.expression, callExps);
      }
      break;
  }
};


const getAllCallExpressionsFromBody = body => {
  return body.reduce((accumulate, expressionStatement) => {
    switch (expressionStatement.type) {
      case esprima.Syntax.ExpressionStatement:
        if (
          expressionStatement.expression &&
          expressionStatement.expression.type === esprima.Syntax.CallExpression
        ) {
          // getCallExpression(expressionStatement, accumulate);
          accumulate.push(expressionStatement);
        }
        break;
    }
    return accumulate;
  }, []);
};

const createCodeLens = (callExps) => {
  return callExps.filter(exp => whetherDBCommand(exp))
    .reduce((accu, exp) => {
      const calls = [];
      getCallExpression(exp, calls);
      const cmds = createCommand(exp, calls);
      accu = accu.concat(cmds);
      return accu;
    }, []);
};

const parseDocument = txt => {
  try {
    const ast = esprima.parseScript(txt, {range: true, loc: true});
    const callExps = getAllCallExpressionsFromBody(ast.body);
    return createCodeLens(callExps);
  } catch (err) {
    console.error('parse error.', err);
  }
};

module.exports = {parseDocument, getAllCallExpressionsFromBody, getCallExpression};
