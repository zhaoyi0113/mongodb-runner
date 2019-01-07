const provideCodeLenses = (document, token) => {
  return [
    {
      command:  {
        title: 'text',
        command: ''
      }
    }
  ]
};

const resolveCodeLens = (codeLens, token) => {};

module.exports = {
  provideCodeLenses,
  resolveCodeLens
};
