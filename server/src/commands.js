const escodegen = require('escodegen');
const esprima = require('esprima');
const MethodType = {
  find: 'find',
  count: 'count',
  update: 'update',
  delete: 'delete',
  findAndModify: 'findAndModify',
  group: 'group',
  distinct: 'distinct'
};

const CommandType = {
  execution: 'mongoRunner.executeCommand',
  queryPlanner: 'mongoRunner.queryPlanner',
  executionStats: 'mongoRunner.executionStats',
  allPlansExecution: 'mongoRunner.allPlansExecution'
};

const CommandIdentifier = {
  original: 1,
  count: 2,
  explain: 3
};

const DEFAULT_LIMIT = 20;

const getExplanMethodType = calls => {
  if (calls.find(call => call.callee.property.name === 'find')) {
    return {
      type: MethodType.find,
      ast: calls[0]
    };
  }
  // if (calls.find(call => call.callee.property.name === MethodType.count)) {
  //   return {
  //     type: MethodType.count,
  //     ast: calls[0]
  //   };
  // }
  if (calls.find(call => call.callee.property.name === MethodType.update)) {
    return {
      type: MethodType.update,
      ast: calls[0]
    };
  }
  if (calls.find(call => call.callee.property.name === MethodType.delete)) {
    return {
      type: MethodType.delete,
      ast: calls[0]
    };
  }
  if (
    calls.find(call => call.callee.property.name === MethodType.findAndModify)
  ) {
    return {
      type: MethodType.findAndModify,
      ast: calls[0]
    };
  }
  // if (calls.find(call => call.callee.property.name === MethodType.distinct)) {
  //   return {
  //     type: MethodType.distinct,
  //     ast: calls[0]
  //   };
  // }
  // if (calls.find(call => call.callee.property.name === MethodType.group)) {
  //   return {
  //     type: MethodType.group,
  //     ast: calls[0]
  //   };
  // }
};

const whetherSupportCount = methodCalls => {
  if (methodCalls && methodCalls.length > 0) {
    return methodCalls[0].callee.property.name === MethodType.find;
  }
  return false;
};

const whetherDBCommand = exp => {
  const match = escodegen.generate(exp).match(/^db/);
  return match;
};

const findCallMethodName = (calls, name) => calls.find(call => call.callee.property.name === name);

const insertMethod = (ast, methodName, args = []) => {
  const newAst = {
    type: esprima.Syntax.CallExpression,
    callee: {
      type: esprima.Syntax.MemberExpression,
      object: ast,
      property: {
        name: methodName,
        type: esprima.Syntax.Identifier
      },
    },
    arguments: args,
  };
  return newAst;
};

const attachAdditionalToFind = (methodCalls, source) => {
  let newSource = source;
  if (
    methodCalls &&
    methodCalls.length > 0 &&
    methodCalls.find(m => m.callee.property.name === MethodType.find)
  ) {
    const hasLimit = findCallMethodName(methodCalls, 'limit') !== undefined || source.indexOf('limit') >= 0;
    const toArray = findCallMethodName(methodCalls, 'toArray');
    const hasToArray = toArray !== undefined;
    const lastCall = methodCalls[0]; //findCallMethodName(methodCalls, 'find');
    let prevToArrayIdx = -1;
    methodCalls.forEach((method, i) => {
      if (method.callee.property.name === 'toArray') {
        prevToArrayIdx = i + 1;
      }
    });
    let prevToArrayCall;
    if (prevToArrayIdx >= 0 && prevToArrayIdx < methodCalls.length) {
      prevToArrayCall = methodCalls[prevToArrayIdx];
    }
    if (!hasLimit && !hasToArray) {
      newSource += `.limit(${DEFAULT_LIMIT}).toArray()`;
    } else {
      const parent = lastCall.parent;
      if (parent) {
        if (!hasLimit) {
          const limitArgument = [{
            type: esprima.Syntax.Literal,
            value: DEFAULT_LIMIT,
            row: `${DEFAULT_LIMIT}`,
          }];
          const inserted = prevToArrayCall ? prevToArrayCall.parent : parent;
          if (inserted.type === esprima.Syntax.ExpressionStatement) {
            inserted.expression = insertMethod(inserted.expression, 'limit', limitArgument);
          } else {
            inserted.object = insertMethod(inserted.object, 'limit', limitArgument);
          }
        }
        if (!hasToArray) {
          if (parent.type === esprima.Syntax.ExpressionStatement) {
            parent.expression = insertMethod(parent.expression, 'toArray', []);
          } else {
            parent.object = insertMethod(parent.object, 'toArray', []);
          }
        }
        const root = methodCalls[0].parent;
        if (root) {
          newSource = escodegen.generate(root).replace(/;$/, '');
        }
      }
    }
  }
  return newSource;
};

const createCommand = (ast, calls) => {
  const {loc} = ast;
  const startLine = loc.start.line;
  const endLine = loc.end.line;
  const explainCmds = getExplanMethodType(calls);
  const source = escodegen.generate(ast).replace(/;$/, '');
  const getBasicCmd = (commandName, title, tooltip, script, identifier) => ({
    command: {
      command: commandName,
      title,
      tooltip,
      arguments: [script]
    },
    isResolved: true,
    identifier,
    range: {
      start: {line: startLine - 1},
      end: {line: endLine - 1},
      isSingleLine: startLine === endLine,
      isEmpty: false
    }
  });
  const commands = [
    getBasicCmd(
      CommandType.execution,
      'Execute',
      'Execute',
      attachAdditionalToFind(calls, source),
      CommandIdentifier.original
    )
  ];
  if (explainCmds) {
    commands.push(
      getBasicCmd(
        CommandType.queryPlanner,
        'Explain',
        'Query Planner',
        `${source}.explain()`,
        CommandIdentifier.explain
      )
    );
  }
  if (whetherSupportCount(calls)) {
    commands.push(
      getBasicCmd(CommandType.execution, 'Count', 'Count', `${source}.count()`, CommandIdentifier.count)
    );
  }
  return commands;
};

module.exports = {createCommand, CommandType, whetherDBCommand, CommandIdentifier};
