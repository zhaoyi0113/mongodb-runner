const { parseDocument } = require('../src/parser');
const { CommandType } = require('../src/commands');

describe('parser test suite', () => {
  test('test find command', () => {
    const parsed = parseDocument('db.test.find()');
    console.log('xxx:', parsed);
    expect(parsed).not.toBeNull();
    expect(parsed).not.toBeUndefined();
    expect(parsed.length).toBe(1);
    expect(parsed[0].command.command).toBe(CommandType.execution);
  });
});
