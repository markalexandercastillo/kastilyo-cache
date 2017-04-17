const td = require('./../../test/testdouble');

require('chai').should();

describe('set/add()', () => {
  let add, serialization, fullKey, redis, nsOpts;
  beforeEach(() => {
    nsOpts = {};
    serialization = td.replace('./../serialization');
    fullKey = td.replace('./../fullKey');
    redis = td.object(['saddAsync']);
    add = require('./add');
  });

  afterEach(() => {
    td.reset();
  });

  it('associates members being set with the expanded key when sending sadd to redis', () => {
    td.when(fullKey(nsOpts, 'expected-key'))
      .thenReturn('full-key');

    add(redis, nsOpts, 'expected-key', ['member']);

    td.verify(redis.saddAsync('full-key'), {ignoreExtraArgs: true});
  });

  it('serializes members being set in redis', () => {
    td.when(serialization.serialize('member-1'), {ignoreExtraArgs: true}).thenReturn('serialized-member-1');
    td.when(serialization.serialize('member-2'), {ignoreExtraArgs: true}).thenReturn('serialized-member-2');
    td.when(serialization.serialize('member-3'), {ignoreExtraArgs: true}).thenReturn('serialized-member-3');

    add(redis, nsOpts, 'some-key', [
      'member-1',
      'member-2',
      'member-3'
    ]);

    td.verify(redis.saddAsync(
      td.matchers.anything(),
      'serialized-member-1',
      'serialized-member-2',
      'serialized-member-3'
    ), {ignoreExtraArgs: true});
  });
});
