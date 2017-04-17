const td = require('testdouble');
const R = require('ramda');
const Bluebird = require('bluebird');
const fetch = require('./fetch');

require('chai').use(require('chai-as-promised')).should();

describe('hash/fetch()', () => {
  let get, set;
  beforeEach(() => {
    set = td.function();
    get = td.function();
  });

  afterEach(() => {
    td.reset();
  });

  it('gives back items in the cache when found', () => {
    const cachedHash = {
      'hash-key-1': 'cached-value-1',
      'hash-key-2': 'cached-value-2',
      'hash-key-3': 'cached-value-3'
    };
    td.when(get('expected-key')).thenReturn(Bluebird.resolve(cachedHash));
    return fetch(get, set, 'expected-key', R.mapObjIndexed(
      value => () => value,
      cachedHash
    )).should.become(cachedHash);
  });

  it('sets and gives back miss handler data, cache gives back nothing', () => {
    const freshHash = {
      'hash-key-1': 'cached-value-1',
      'hash-key-2': 'cached-value-2',
      'hash-key-3': 'cached-value-3'
    };
    td.when(get('expected-key')).thenReturn(Bluebird.resolve({}));
    td.when(set('expected-key', freshHash)).thenReturn(Bluebird.resolve());
    return fetch(get, set, 'expected-key', R.mapObjIndexed(
      value => () => value,
      freshHash
    )).should.become(freshHash);
  });

  it('gives back a composition of fresh and cached data in case of a partial miss', () => {
    td.when(get('expected-key')).thenReturn(Bluebird.resolve({
      'hash-key-1': 'cached-value-1',
      'hash-key-3': 'cached-value-3'
    }));

    td.when(set('expected-key', {'hash-key-2': 'fresh-value-2'})).thenReturn(Bluebird.resolve());

    return fetch(get, set, 'expected-key', {
      'hash-key-1': () => 'fresh-value-1',
      'hash-key-2': () => 'fresh-value-2',
      'hash-key-3': () => 'fresh-value-3'
    }).should.become({
      'hash-key-1': 'cached-value-1',
      'hash-key-2': 'fresh-value-2',
      'hash-key-3': 'cached-value-3'
    });
  });
});
