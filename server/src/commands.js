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
  execution: 'mongoRunner.selectRunConnection',
};

const createCommand = (methodType, ast, script) => {
  switch (methodType) {
    case MethodType.find:
      return {
        command: {
          command: CommandType.execution,
          title: 'Execution',
          tooltip: 'Execution',
          arguments: [ast]
        },
        isResolved: true,
        range: {
          start: { line: 1 },
          end: { line: 1 },
          isSingleLine: true,
          isEmpty: false
        }
      };
  }
};

module.exports = { createCommand, MethodType, CommandType };
