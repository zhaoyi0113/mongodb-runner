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
};

const createCommand = (methodType, ast, script) => {
  const { loc } = ast;
  const startLine = loc.start.line;
  const endLine = loc.end.line;
  switch (methodType) {
    case MethodType.find:
    case MethodType.count:
      return {
        command: {
          command: CommandType.execution,
          title: 'Execution',
          tooltip: 'Execution',
          arguments: [escodegen.generate(ast)]
        },
        isResolved: true,
        range: {
          start: { line: startLine -1 },
          end: { line: endLine -1 },
          isSingleLine: startLine === endLine,
          isEmpty: false
        }
      };
  }
};

module.exports = { createCommand, MethodType, CommandType };
