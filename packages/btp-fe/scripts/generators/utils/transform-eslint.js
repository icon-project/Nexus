const { ESLint } = require('eslint');

module.exports = async (inStr, ...ots) => {
  if (typeof inStr != 'string') {
    console.debug('-- in-str:', inStr, ots);
    return '';
  }

  // 1. Create an instance with the `fix` option.
  const eslint = new ESLint({ fix: true });

  // 2. Lint files. This doesn't modify target files.
  const results = await eslint.lintText(inStr);

  if (typeof results[0].output != 'string') {
    return inStr;
  }

  return results[0].output;
};
