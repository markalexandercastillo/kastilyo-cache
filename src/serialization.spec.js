const serialization = require('./serialization');

describe('serialization', () => {
  describe('serialize()', () => it(
    'serializes to JSON',
    () => serialization
      .serialize({someKey: 'some value'})
      .should.equal('{"someKey":"some value"}')
  ));

  describe('unserialize()', () => it(
    'unserializes from JSON',
    () => serialization
      .unserialize('{"someKey":"some value"}')
      .should.deep.equal({someKey: 'some value'})
  ));
});
