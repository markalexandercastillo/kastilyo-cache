const td = require('testdouble');
const Bluebird = require('bluebird');

require('chai').use(require('chai-as-promised')).should();

describe('list/get()', () => {
  let get, serialization, fullKey, redis, nsOpts;
  beforeEach(() => {
    nsOpts = {};
    serialization = td.replace('./../serialization');
    fullKey = td.replace('./../fullKey');
    redis = td.object(['lrangeAsync']);
    get = require('./get');
  });

  afterEach(() => {
    td.reset();
  });

  it('asks for all items when sending lrange to redis', () => {
    td.when(redis.lrangeAsync(td.matchers.anything(), 0, -1))
      .thenReturn(Bluebird.resolve([]));
    return get(redis, nsOpts, 'some-key');
  });

  it('asks for items associated the expanded key when sending lrange to redis', () => {
    td.when(fullKey(nsOpts, 'expected-key'))
      .thenReturn('full-key');
    td.when(redis.lrangeAsync('full-key'), {ignoreExtraArgs: true})
      .thenReturn(Bluebird.resolve([]));
    return get(redis, nsOpts, 'expected-key');
  });

  it('unserializes items coming back from redis', () => {
    td.when(redis.lrangeAsync(), {ignoreExtraArgs: true})
      .thenReturn(Bluebird.resolve([
        'serialized-item-1',
        'serialized-item-2',
        'serialized-item-3'
      ]));
    td.when(serialization.unserialize('serialized-item-1'), {ignoreExtraArgs: true}).thenReturn('item-1');
    td.when(serialization.unserialize('serialized-item-2'), {ignoreExtraArgs: true}).thenReturn('item-2');
    td.when(serialization.unserialize('serialized-item-3'), {ignoreExtraArgs: true}).thenReturn('item-3');
    return get(redis, nsOpts, 'some-key').should.become([
      'item-1',
      'item-2',
      'item-3'
    ]);
  });
});
