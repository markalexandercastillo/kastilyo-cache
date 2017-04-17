const td = require('./../../test/testdouble');
const Bluebird = require('bluebird');
const fetch = require('./fetch');

require('chai').use(require('chai-as-promised')).should();

describe('set/fetch()', () => {
  let get, add;
  beforeEach(() => {
    add = td.function();
    get = td.function();
  });

  afterEach(() => {
    td.reset();
  });

  it('gives back members from redis when found', () => {
    const cachedMembers = [
      'cached-member-1',
      'cached-member-2',
      'cached-member-3'
    ];

    td.when(get('expected-key'))
      .thenResolve(Bluebird.resolve(cachedMembers));

    return fetch(get, add, 'expected-key', () => []).should.become(cachedMembers);
  });

  it('adds and resolves to miss handler members when nothing is found in redis', () => {
    const freshMembers = [
      'fresh-member-1',
      'fresh-member-2',
      'fresh-member-3'
    ];

    td.when(get('expected-key'))
      .thenResolve([]);
    td.when(add('expected-key', freshMembers))
      .thenResolve();

    return fetch(get, add, 'expected-key', () => freshMembers)
      .should.become(freshMembers);
  });

  it('resolves an empty array when nothing is in redis and in miss handler', () => {
    td.when(get('expected-key'))
      .thenResolve([]);

    return fetch(get, add, 'expected-key', () => [])
      .should.become([]);
  });
});
