const td = require('./../../test/testdouble');

require('chai').use(require('chai-as-promised')).should();

describe('hash/get()', () => {
  let get, serialization, fullKey, redis, nsOpts;
  beforeEach(() => {
    nsOpts = {};
    serialization = td.replace('./../serialization');
    fullKey = td.replace('./../fullKey');
    redis = td.object(['hgetallAsync']);
    get = require('./get');
  });

  afterEach(() => {
    td.reset();
  });

  it('asks for the hash associated the expanded key when sending hgetall to redis', () => {
    td.when(fullKey(nsOpts, 'expected-key'))
      .thenReturn('full-key');
    td.when(redis.hgetallAsync('full-key'), {ignoreExtraArgs: true})
      .thenResolve({});

    return get(redis, nsOpts, 'expected-key');
  });

  it('unserializes values coming back from redis', () => {
    td.when(redis.hgetallAsync(), {ignoreExtraArgs: true})
      .thenResolve({
        'hash-key-1': 'serialized-value-1',
        'hash-key-2': 'serialized-value-2',
        'hash-key-3': 'serialized-value-3'
      });
    td.when(serialization.unserialize('serialized-value-1'), {ignoreExtraArgs: true})
      .thenReturn('value-1');
    td.when(serialization.unserialize('serialized-value-2'), {ignoreExtraArgs: true})
      .thenReturn('value-2');
    td.when(serialization.unserialize('serialized-value-3'), {ignoreExtraArgs: true})
      .thenReturn('value-3');

    return get(redis, nsOpts, 'some-key')
      .should.become({
        'hash-key-1': 'value-1',
        'hash-key-2': 'value-2',
        'hash-key-3': 'value-3'
      });
  });
});
