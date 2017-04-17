const R = require('ramda')
  , {serialize} = require('./../serialization')
  , fullKey = require('./../fullKey');

const push = (redis, nsOpts, key, items) =>
  redis.rpushAsync(
    fullKey(nsOpts, key),
    ...items.map(serialize)
  );

module.exports = R.curry(push);
