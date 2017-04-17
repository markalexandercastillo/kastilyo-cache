const R = require('ramda')
  , {serialize} = require('./../serialization')
  , fullKey = require('./../fullKey');

const add = (redis, nsOpts, key, members) =>
  redis.saddAsync(
    fullKey(nsOpts, key),
    ...members.map(serialize)
  );

module.exports = R.curry(add);
