const R = require('ramda');

const fetch = (get, add, key, missHandler) =>
  get(key)
    .then(R.when(
      R.isEmpty,
      () => Promise.resolve(missHandler())
        .then(R.unless(
          R.isEmpty,
          freshMembers => add(key, freshMembers).return(freshMembers)
        ))
    ));

module.exports = R.curry(fetch);
