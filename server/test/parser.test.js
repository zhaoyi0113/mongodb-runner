const esprima = require('esprima');
const {parseDocument, getCallExpression} = require('../src/parser');
const {CommandType, CommandIdentifier} = require('../src/commands');

describe('parser test suite', () => {

  test('test find command', () => {
    const parsed = parseDocument('db.test.find()');
    expect(parsed).not.toBeNull();
    expect(parsed).not.toBeUndefined();
    expect(parsed.length).toBe(3);
    expect(parsed[0].command.command).toBe(CommandType.execution);
    expect(parsed[0].range.start.line).toBe(0);
    expect(parsed[0].range.end.line).toBe(0);
    expect(parsed[1].command.command).toBe(CommandType.queryPlanner);
    expect(parsed[2].command.command).toBe(CommandType.execution);
    expect(parsed[2].command.arguments[0].indexOf('count()') > 0).toBeTruthy();
  });

  test('test find add limit and toArray method', () => {
    let parsed = parseDocument('db.test.find()');
    let executeCmd = parsed.find(p => p.command.command === CommandType.execution);
    expect(executeCmd).not.toBeNull();
    expect(executeCmd.command.arguments[0]).toBe('db.test.find().limit(20).toArray()');

    parsed = parseDocument('db.collection("test").find()');
    executeCmd = parsed.find(p => p.command.command === CommandType.execution);
    expect(executeCmd).not.toBeNull();
    expect(executeCmd.command.arguments[0]).toBe('db.collection(\'test\').find().limit(20).toArray()');
  });

  test('test find add toArray method', () => {
    let parsed = parseDocument('db.test.find({limit: 30})');
    let executeCmd = parsed.find(p => p.command.command === CommandType.execution);
    expect(executeCmd).not.toBeNull();
    expect(executeCmd.command.arguments[0]).toBe('db.test.find({ limit: 30 }).toArray()');

    parsed = parseDocument('db.test.find().limit(30)');
    executeCmd = parsed.find(p => p.command.command === CommandType.execution);
    expect(executeCmd).not.toBeNull();
    expect(executeCmd.command.arguments[0]).toBe('db.test.find().limit(30).toArray()');

    parsed = parseDocument('db.collection("test").find({limit: 10}).toArray()');
    executeCmd = parsed.find(p => p.command.command === CommandType.execution);
    expect(executeCmd).not.toBeNull();
    expect(executeCmd.command.arguments[0]).toBe('db.collection(\'test\').find({ limit: 10 }).toArray()');

    parsed = parseDocument('db.collection("test").find({limit: 10}).toArray()');
    executeCmd = parsed.find(p => p.command.command === CommandType.execution);
    expect(executeCmd).not.toBeNull();
    expect(executeCmd.command.arguments[0]).toBe('db.collection(\'test\').find({ limit: 10 }).toArray()');
  });

  test('test find add limit method', () => {
    let parsed = parseDocument('db.test.find()');
    let executeCmd = parsed.find(p => p.command.command === CommandType.execution);
    expect(executeCmd.command.arguments[0]).toBe('db.test.find().limit(20).toArray()');

    parsed = parseDocument('db.test.find().toArray()');
    executeCmd = parsed.find(p => p.command.command === CommandType.execution);
    expect(executeCmd.command.arguments[0]).toBe('db.test.find().limit(20).toArray()');

    parsed = parseDocument('db.test.find().limit(10).toArray()');
    executeCmd = parsed.find(p => p.command.command === CommandType.execution);
    expect(executeCmd.command.arguments[0]).toBe('db.test.find().limit(10).toArray()');

    parsed = parseDocument('db.test.find({limit: 10}).toArray()');
    executeCmd = parsed.find(p => p.command.command === CommandType.execution);
    expect(executeCmd.command.arguments[0]).toBe('db.test.find({ limit: 10 }).toArray()');

    parsed = parseDocument('db.collection("test").find().limit(10).toArray()');
    executeCmd = parsed.find(p => p.command.command === CommandType.execution);
    expect(executeCmd.command.arguments[0]).toBe('db.collection(\'test\').find().limit(10).toArray()');

    parsed = parseDocument('db.collection("test").find({limit: 10}).toArray()');
    executeCmd = parsed.find(p => p.command.command === CommandType.execution);
    expect(executeCmd.command.arguments[0]).toBe('db.collection(\'test\').find({ limit: 10 }).toArray()');
  });

  test('test getCallExpression for find', () => {
    let ast = esprima.parseScript('db.test.find()', {range: true, loc: true});
    let calls = [];
    getCallExpression(ast.body[0].expression, calls);
    expect(calls).not.toBe(null);
    expect(calls.length).toBe(1);

    ast = esprima.parseScript('db.test.find({a: true})', {range: true, loc: true});
    calls = [];
    getCallExpression(ast.body[0].expression, calls);
    expect(calls).not.toBe(null);
    expect(calls.length).toBe(1);
    expect(calls[0].callee.property.name).toBe('find');

    ast = esprima.parseScript('db.test.find({a: true}).toArray()', {range: true, loc: true});
    calls = [];
    getCallExpression(ast.body[0].expression, calls);
    expect(calls).not.toBe(null);
    expect(calls.length).toBe(2);
    expect(calls[0].callee.property.name).toBe('toArray');
    expect(calls[1].callee.property.name).toBe('find');

    ast = esprima.parseScript('db.test.find({a: true, b: {$ne: ""}}).limit(20).sort({})', {range: true, loc: true});
    calls = [];
    getCallExpression(ast.body[0].expression, calls);
    expect(calls).not.toBe(null);
    expect(calls.length).toBe(3);
    expect(calls[0].callee.property.name).toBe('sort');
    expect(calls[1].callee.property.name).toBe('limit');
    expect(calls[2].callee.property.name).toBe('find');

  });

  test('parse multiple lines commands', () => {
    let parsed = parseDocument('db.test.find({limit: 30})\n db.test.find()');
    let executeCmds = parsed.filter(p => p.identifier === CommandIdentifier.original);
    expect(executeCmds.length).toBe(2);
    expect(executeCmds[0].command.arguments[0]).toBe('db.test.find({ limit: 30 }).toArray()');
    expect(executeCmds[1].command.arguments[0]).toBe('db.test.find().limit(20).toArray()');

    parsed = parseDocument('db.collection("test").findOne() \n db.collection("test1").findOne()');
    executeCmds = parsed.filter(p => p.identifier === CommandIdentifier.original);
    expect(executeCmds.length).toBe(2);
    expect(executeCmds[0].command.arguments[0]).toBe('db.collection(\'test\').findOne()');
    expect(executeCmds[1].command.arguments[0]).toBe('db.collection(\'test1\').findOne()');
  });

  test('parse object id command', () => {
    let parsed = parseDocument('db.collection("test").find({"_id": new ObjectId("5ba2bfcf6d2a0312c7ec12c6")})');
    expect(parsed.length).toBe(3);
  });
});
