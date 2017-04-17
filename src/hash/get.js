const _ = require('lodash/fp')
  , {unserialize} = require('./../serialization')
  , fullKey = require('./../fullKey');

const get = (redis, nsOpts, key) =>
  redis.hgetallAsync(fullKey(nsOpts, key))
    .then(_.mapValues(unserialize));

module.exports = _.curry(get);
