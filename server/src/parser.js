const esprima = require('esprima');
const escodegen = require('escodegen');
const { createCommand } = require('./commands');

const getCallExpression = (ast, callExps = []) => {
  if(!ast) return;
  switch(ast.type) {
    case esprima.Syntax.CallExpression:
      if(ast.callee && ast.callee.type === esprima.Syntax.MemberExpression) {
        getCallExpression(ast.callee, callExps);
      }
      break;
    case esprima.Syntax.MemberExpression:
      if(ast.object && ast.object.type === esprima.Syntax.CallExpression) {
        callExps.push(ast.object);
        getCallExpression(ast.object.callee, callExps);
      }
      break;

    case esprima.Syntax.ExpressionStatement:
      if(ast.expression && ast.expression.type === esprima.Syntax.CallExpression) {
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
          // accumulate.push(expressionStatement.expression);
          getCallExpression(expressionStatement.expression, accumulate);
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
    const callExps = getAllCallExpressionsFromBody(ast.body);
    return parseCallExpression(callExps);
  } catch (err) {
    console.error('parse error.');
  }
};

module.exports = { parseDocument, getAllCallExpressionsFromBody, getCallExpression };
