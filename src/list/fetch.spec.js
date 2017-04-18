const td = require('./../../test/testdouble');
const fetch = require('./fetch');

require('chai').use(require('chai-as-promised')).should();

describe('list/fetch()', () => {
  let get, push;
  beforeEach(() => {
    push = td.function();
    get = td.function();
  });

  afterEach(() => {
    td.reset();
  });

  it('resolves to items in the cache when found', () => {
    const cachedItems = [
      'cached-item-1',
      'cached-item-2',
      'cached-item-3'
    ];

    td.when(get('expected-key'))
      .thenResolve(cachedItems);

    return fetch(get, push, 'expected-key', () => [])
      .should.become(cachedItems);
  });

  it('pushes and resolves to miss handler data when nothing is found in redis', () => {
    const freshItems = [
      'fresh-item-1',
      'fresh-item-2',
      'fresh-item-3'
    ];

    td.when(get('expected-key'))
      .thenResolve([]);
    td.when(push('expected-key', freshItems))
      .thenResolve();

    return fetch(get, push, 'expected-key', () => freshItems)
      .should.become(freshItems);
  });

  it('resolves to an empty array when nothing is in redis and nothing is in the miss handler', () => {
    td.when(get('expected-key'))
      .thenResolve([]);

    return fetch(get, push, 'expected-key', () => [])
      .should.become([]);
  });
});
