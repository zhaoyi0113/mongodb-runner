const esprima = require('esprima');

const parseDocument = txt => {
  try {
    const script = esprima.parseScript(txt);
  } catch (err) {}
};

module.exports = { parseDocument };
