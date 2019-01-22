const esprima = require('esprima');
const {parseDocument, getAllCallExpressionsFromBody, getCallExpression} = require('../src/parser');
const {CommandType} = require('../src/commands');

describe('parser test suite', () => {
  test('test find command', () => {
    const parsed = parseDocument('db.test.find()');
    expect(parsed).not.toBeNull();
    expect(parsed).not.toBeUndefined();
    expect(parsed.length).toBe(1);
    expect(parsed[0].command.command).toBe(CommandType.execution);
    expect(parsed[0].range.start.line).toBe(0);
    expect(parsed[0].range.end.line).toBe(0);
  });

  test('test getAllCallExpressionsFromBody for find', () => {
    let ast = esprima.parseScript('db.test.find()', {range: true, loc: true});
    let calls = [];
    getCallExpression(ast.body[0], calls);
    expect(calls).not.toBe(null);
    expect(calls.length).toBe(1);

    ast = esprima.parseScript('db.test.find({a: true})', {range: true, loc: true});
    calls = [];
    getCallExpression(ast.body[0], calls);
    expect(calls).not.toBe(null);
    expect(calls.length).toBe(1);
    expect(calls[0].callee.property.name).toBe('find');

    ast = esprima.parseScript('db.test.find({a: true}).toArray()', {range: true, loc: true});
    calls = [];
    getCallExpression(ast.body[0], calls);
    expect(calls).not.toBe(null);
    expect(calls.length).toBe(2);
    expect(calls[0].callee.property.name).toBe('toArray');
    expect(calls[1].callee.property.name).toBe('find');

    ast = esprima.parseScript('db.test.find({a: true, b: {$ne: ""}}).limit(20).sort({})', {range: true, loc: true});
    calls = [];
    getCallExpression(ast.body[0], calls);
    expect(calls).not.toBe(null);
    expect(calls.length).toBe(3);
    expect(calls[0].callee.property.name).toBe('sort');
    expect(calls[1].callee.property.name).toBe('limit');
    expect(calls[2].callee.property.name).toBe('find');
  });
});
