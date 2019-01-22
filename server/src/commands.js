const escodegen = require('escodegen');
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
  allPlansExecution: 'mongoRunner.allPlansExecution',
};

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

const createCommand = (ast, calls) => {
  const { loc } = ast;
  const startLine = loc.start.line;
  const endLine = loc.end.line;
  const explainCmds = getExplanMethodType(calls);
  const source = escodegen.generate(ast).replace(/;$/, '');
  const getBasicCmd = (commandName, title, tooltip, script) => ({
    command: {
      command: commandName,
      title,
      tooltip,
      arguments: [script]
    },
    isResolved: true,
    range: {
      start: { line: startLine - 1 },
      end: { line: endLine - 1 },
      isSingleLine: startLine === endLine,
      isEmpty: false
    }
  });
  const commands = [
    getBasicCmd(CommandType.execution, 'Execute', 'Execute', source)
  ];
  if (explainCmds) {
    commands.push(
      getBasicCmd(
        CommandType.queryPlanner,
        'Explain',
        'Query Planner',
        `${source}.explain()`
      )
    );
  }
  if (whetherSupportCount(calls)) {
    commands.push(
      getBasicCmd(CommandType.execution, 'Count', 'Count', `${source}.count()`)
    );
  }
  return commands;
};

module.exports = { createCommand, CommandType, whetherDBCommand };
