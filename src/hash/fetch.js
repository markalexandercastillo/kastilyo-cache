const R = require('ramda')
  , Bluebird = require('bluebird');

const handleMissed = (missHandlers, missedFields) =>
  Bluebird.props(R.mapObjIndexed(
    missHandler => missHandler(),
    R.pick(missedFields, missHandlers)
  ));

const verifyCached = (missHandlers, hitData) => ({
  hitData,
  missedFields: R.difference(R.keys(missHandlers), R.keys(hitData))
});

const fetch = (get, set, key, missHandlers) =>
  get(key)
    .then(hitData => verifyCached(missHandlers, hitData))
    .tap(data => {
      debugger;
    })
    .then(({hitData, missedFields}) => !missedFields.length
      ? hitData
      : handleMissed(missHandlers, missedFields)
        .tap(data => {
          debugger;
        })
        .then(freshData =>
          set(key, freshData)
            .then(() => R.merge(freshData, hitData))
        )
    );

module.exports = R.curry(fetch);
