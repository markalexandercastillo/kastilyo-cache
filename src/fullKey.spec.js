const fullKey = require('./fullKey');

require('chai').should();

describe('fullKey()', () => it(
  'it appends the key to the namespaces and separates them with the delimiter',
  () => fullKey(
    {
      namespaces: ['namespace-1', 'namespace-2'],
      delimiter: ':'
    },
    'some-key'
  )
    .should.equal('namespace-1:namespace-2:some-key')
));
