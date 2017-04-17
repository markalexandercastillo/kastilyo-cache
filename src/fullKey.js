const R = require('ramda');

const fullKey = ({namespaces, delimiter}, key) =>
  [...namespaces, key].join(delimiter);

module.exports = R.curry(fullKey);
