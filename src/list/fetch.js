const R = require('ramda');

const fetch = (get, push, key, missHandler) =>
  get(key)
    .then(R.when(
      R.isEmpty,
      () => Promise.resolve(missHandler())
        .then(R.unless(
          R.isEmpty,
          freshItems => push(key, freshItems).return(freshItems)
        ))
    ));

module.exports = R.curry(fetch);
