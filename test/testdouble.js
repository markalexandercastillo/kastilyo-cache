/**
 * Stuff to do for every test
 */
const td = require('testdouble');

td.config({
  promiseConstructor: require('bluebird')
});

module.exports = td;
