const R = require('ramda')
  , Bluebird = require('bluebird');

const verifyCached = missHandlers => hitData => ({
  hitData,
  missedFields: R.difference(R.keys(missHandlers), R.keys(hitData))
});

const handleMissed = (missHandlers, missedFields) =>
  Bluebird.props(R.mapObjIndexed(
    missHandler => missHandler(),
    R.pick(missedFields, missHandlers)
  ));

const fetch = (get, set, key, missHandlers) =>
  get(key)
    .then(verifyCached(missHandlers))
    .then(({hitData, missedFields}) => !missedFields.length
      ? hitData
      : handleMissed(missHandlers, missedFields)
        .then(freshData =>
          set(key, freshData)
            .then(() => R.merge(freshData, hitData))
        )
    );

module.exports = R.curry(fetch);
