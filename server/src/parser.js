const esprima = require('esprima');
const {createCommand, whetherDBCommand} = require('./commands');

const getCallExpression = (ast, callExps = []) => {
  if (!ast) return;
  switch (ast.type) {
    case esprima.Syntax.CallExpression:
      callExps.push(ast);
      if (ast.callee && ast.callee.type === esprima.Syntax.MemberExpression) {
        getCallExpression(ast.callee, callExps);
      }
      break;
    case esprima.Syntax.MemberExpression:
      if (ast.object && ast.object.type === esprima.Syntax.CallExpression) {
        ast.object.parent = ast;
        callExps.push(ast.object);
        getCallExpression(ast.object.callee, callExps);
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
          expressionStatement.expression.parent = expressionStatement;
          accumulate.push(expressionStatement.expression);
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
  }
};

module.exports = {parseDocument, getAllCallExpressionsFromBody, getCallExpression};
