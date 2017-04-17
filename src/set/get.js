const R = require('ramda')
  , {unserialize} = require('./../serialization')
  , fullKey = require('./../fullKey');

const get = (redis, nsOpts, key) =>
  redis.smembersAsync(fullKey(nsOpts, key))
    .map(unserialize);

module.exports = R.curry(get);
