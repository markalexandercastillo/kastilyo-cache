const td = require('testdouble');
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

  it('gives back members in the cache when found', () => {
    const cachedMembers = [
      'cached-member-1',
      'cached-member-2',
      'cached-member-3'
    ];
    td.when(get('expected-key')).thenReturn(Bluebird.resolve(cachedMembers));
    return fetch(get, add, 'expected-key', () => []).should.become(cachedMembers);
  });

  it('addes and gives back miss handler members, cache gives back nothing', () => {
    const freshMembers = [
      'fresh-member-1',
      'fresh-member-2',
      'fresh-member-3'
    ];
    td.when(get('expected-key')).thenReturn(Bluebird.resolve([]));
    td.when(add('expected-key', freshMembers)).thenReturn(Bluebird.resolve());
    return fetch(get, add, 'expected-key', () => freshMembers).should.become(freshMembers);
  });

  it('just gives back an empty array when nothing is in cache or in miss handler', () => {
    td.when(get('expected-key')).thenReturn(Bluebird.resolve([]));
    return fetch(get, add, 'expected-key', () => []).should.become([]);
  });
});
