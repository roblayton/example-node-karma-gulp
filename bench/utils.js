'use strict'

var utils = require('../src/utils');
var arr = [1, 2, 3, 6, 4, 5, 7, 8, 9];

module.exports = {
  name: 'utils#remove',
  maxTime: 2,
  onComplete: function() {
    arr = null;
  },
  fn: function() {
    utils.remove(arr, 9);
  }
};
