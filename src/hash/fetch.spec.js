const td = require('./../../test/testdouble');
const R = require('ramda');
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

  it('resolves to hash from the redis when found', () => {
    const cachedHash = {
      'hash-key-1': 'cached-value-1',
      'hash-key-2': 'cached-value-2',
      'hash-key-3': 'cached-value-3'
    };

    td.when(get('expected-key')).thenResolve(cachedHash);

    return fetch(get, set, 'expected-key', R.mapObjIndexed(
      value => () => value,
      cachedHash
    )).should.become(cachedHash);
  });

  it('sets and resolves to miss handler data when nothing is found in redis', () => {
    const freshHash = {
      'hash-key-1': 'fresh-value-1',
      'hash-key-2': 'fresh-value-2',
      'hash-key-3': 'fresh-value-3'
    };

    td.when(get('expected-key'))
      .thenResolve({});
    td.when(set('expected-key', freshHash))
      .thenResolve();

    return fetch(get, set, 'expected-key', R.mapObjIndexed(
      value => () => value,
      freshHash
    ))
      .should.become(freshHash);
  });

  it('resolves to composition of miss handler data and cached data when only some of the hash is cached', () => {
    td.when(get('expected-key'))
      .thenResolve({
        'hash-key-1': 'cached-value-1',
        'hash-key-3': 'cached-value-3'
      });
    td.when(set('expected-key', {'hash-key-2': 'fresh-value-2'}))
      .thenResolve();

    return fetch(get, set, 'expected-key', {
      'hash-key-1': () => 'fresh-value-1',
      'hash-key-2': () => 'fresh-value-2',
      'hash-key-3': () => 'fresh-value-3'
    })
      .should.become({
        'hash-key-1': 'cached-value-1',
        'hash-key-2': 'fresh-value-2',
        'hash-key-3': 'cached-value-3'
      });
  });
});
