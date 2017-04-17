const td = require('./../../test/testdouble');

require('chai').use(require('chai-as-promised')).should();

describe('set/get()', () => {
  let get, serialization, fullKey, redis, nsOpts;
  beforeEach(() => {
    nsOpts = {};
    serialization = td.replace('./../serialization');
    fullKey = td.replace('./../fullKey');
    redis = td.object(['smembersAsync']);
    get = require('./get');
  });

  afterEach(() => {
    td.reset();
  });

  it('asks for members associated the expanded key when sending smembers to redis', () => {
    td.when(fullKey(nsOpts, 'expected-key'))
      .thenReturn('full-key');
    td.when(redis.smembersAsync('full-key'), {ignoreExtraArgs: true})
      .thenResolve([]);

    return get(redis, nsOpts, 'expected-key');
  });

  it('unserializes members coming back from redis', () => {
    td.when(redis.smembersAsync(), {ignoreExtraArgs: true})
      .thenResolve([
        'serialized-member-1',
        'serialized-member-2',
        'serialized-member-3'
      ]);
    td.when(serialization.unserialize('serialized-member-1'), {ignoreExtraArgs: true})
      .thenReturn('member-1');
    td.when(serialization.unserialize('serialized-member-2'), {ignoreExtraArgs: true})
      .thenReturn('member-2');
    td.when(serialization.unserialize('serialized-member-3'), {ignoreExtraArgs: true})
      .thenReturn('member-3');

    return get(redis, nsOpts, 'some-key').should.become([
      'member-1',
      'member-2',
      'member-3'
    ]);
  });
});
