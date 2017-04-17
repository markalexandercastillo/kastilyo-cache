const R = require('ramda')
  , {serialize} = require('./../serialization')
  , fullKey = require('./../fullKey');

const flattenPairs = R.pipe(
  R.mapObjIndexed(serialize),
  R.toPairs,
  R.flatten
);

const get = (redis, nsOpts, key, data) =>
  redis.hmsetAsync(fullKey(nsOpts, key), ...flattenPairs(data));

module.exports = R.curry(get);
