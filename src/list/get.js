const R = require('ramda')
  , {unserialize} = require('./../serialization')
  , fullKey = require('./../fullKey');

const get = (redis, nsOpts, key) =>
  redis.lrangeAsync(fullKey(nsOpts, key), 0, -1)
    .map(unserialize);

module.exports = R.curry(get);
