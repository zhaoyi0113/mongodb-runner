const { parseDocument } = require('../src/parser');

describe('parser test suite', () => {
  test('test find command', () => {
    const parsed = parseDocument('db.test.find()');
    console.log('xxx:', parsed);
    expect(parsed).not.toBeNull();
  });
});
