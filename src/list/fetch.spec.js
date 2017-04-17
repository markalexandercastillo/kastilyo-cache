const td = require('testdouble');
const Bluebird = require('bluebird');
const fetch = require('./fetch');

require('chai').use(require('chai-as-promised')).should();

describe('fetch()', () => {
  let get, push;
  beforeEach(() => {
    push = td.function();
    get = td.function();
  });

  afterEach(() => {
    td.reset();
  });

  it('gives back items in the cache when found', () => {
    const cachedItems = [
      'cached-item-1',
      'cached-item-2',
      'cached-item-3'
    ];
    td.when(get('expected-key')).thenReturn(Bluebird.resolve(cachedItems));
    return fetch(get, push, 'expected-key', () => []).should.become(cachedItems);
  });

  it('pushes and gives back miss handler items, cache gives back nothing', () => {
    const freshItems = [
      'fresh-item-1',
      'fresh-item-2',
      'fresh-item-3'
    ];
    td.when(get('expected-key')).thenReturn(Bluebird.resolve([]));
    td.when(push('expected-key', freshItems)).thenReturn(Bluebird.resolve());
    return fetch(get, push, 'expected-key', () => freshItems).should.become(freshItems);
  });

  it('just gives back an empty array when nothing is in cache or in miss handler', () => {
    td.when(get('expected-key')).thenReturn(Bluebird.resolve([]));
    return fetch(get, push, 'expected-key', () => []).should.become([]);
  });
});
