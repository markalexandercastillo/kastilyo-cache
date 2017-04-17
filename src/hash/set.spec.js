const td = require('testdouble');

require('chai').should();

describe('hash/set()', () => {
  let set, serialization, fullKey, redis, nsOpts;
  beforeEach(() => {
    nsOpts = {};
    serialization = td.replace('./../serialization');
    fullKey = td.replace('./../fullKey');
    redis = td.object(['hmsetAsync']);
    set = require('./set');
  });

  afterEach(() => {
    td.reset();
  });

  it('associates the hash being set with the expanded key when sending hmset to redis', () => {
    td.when(fullKey(nsOpts, 'expected-key'))
      .thenReturn('full-key');
    set(redis, nsOpts, 'expected-key', {hashKey1: 'value-1'});
    td.verify(redis.hmsetAsync('full-key'), {ignoreExtraArgs: true});
  });

  it('serializes values being set in redis', () => {
    td.when(serialization.serialize('value-1'), {ignoreExtraArgs: true}).thenReturn('serialized-value-1');
    td.when(serialization.serialize('value-2'), {ignoreExtraArgs: true}).thenReturn('serialized-value-2');
    td.when(serialization.serialize('value-3'), {ignoreExtraArgs: true}).thenReturn('serialized-value-3');
    set(redis, nsOpts, 'some-key', {
      'hash-key-1': 'value-1',
      'hash-key-2': 'value-2',
      'hash-key-3': 'value-3'
    });
    td.verify(redis.hmsetAsync(
      td.matchers.anything(),
      'hash-key-1',
      'serialized-value-1',
      'hash-key-2',
      'serialized-value-2',
      'hash-key-3',
      'serialized-value-3'
    ), {ignoreExtraArgs: true});
  });
});
