const td = require('testdouble');

require('chai').should();

describe('push()', () => {
  let push, serialization, fullKey, redis, nsOpts;
  beforeEach(() => {
    nsOpts = {};
    serialization = td.replace('./../serialization');
    fullKey = td.replace('./../fullKey');
    redis = td.object(['rpushAsync']);
    push = require('./push');
  });

  afterEach(() => {
    td.reset();
  });

  it('associates items being set with the expanded key when sending rpush to redis', () => {
    td.when(fullKey(nsOpts, 'expected-key'))
      .thenReturn('full-key');
    push(redis, nsOpts, 'expected-key', ['item']);
    td.verify(redis.rpushAsync('full-key'), {ignoreExtraArgs: true});
  });

  it('serializes items being set in redis', () => {
    td.when(serialization.serialize('item-1'), {ignoreExtraArgs: true}).thenReturn('serialized-item-1');
    td.when(serialization.serialize('item-2'), {ignoreExtraArgs: true}).thenReturn('serialized-item-2');
    td.when(serialization.serialize('item-3'), {ignoreExtraArgs: true}).thenReturn('serialized-item-3');
    push(redis, nsOpts, 'some-key', [
      'item-1',
      'item-2',
      'item-3'
    ]);
    td.verify(redis.rpushAsync(
      td.matchers.anything(),
      'serialized-item-1',
      'serialized-item-2',
      'serialized-item-3'
    ), {ignoreExtraArgs: true});
  });
});
