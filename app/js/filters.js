'use strict';

/* Filters */

angular
  .module('myApp.filters', [])

  .filter('interpolate', ['version', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])

  .filter('reverse', function () {
    function toArray(list) {
      var k, out = [];
      if (list) {
        if (angular.isArray(list)) {
          out = list;
        }
        else if (typeof(list) === 'object') {
          for (k in list) {
            if (list.hasOwnProperty(k)) {
              out.push(list[k]);
            }
          }
        }
      }
      return out;
    }

    return function (items) {
      return toArray(items).slice().reverse();
    };
  })

  .filter('connectedUsers', function () {
    var users = [];

    return function (input) {

      // Called really many times
      if (_.isArray(input)) {
        users = _.filter(input, function (user) {
          return _.isString(user.url);
        })
      }

      return users;

    }
  })

  .filter('untitledSheets', function () {
    var sheets = [];

    return function (input, untitled) {
      // Called really many times
      if (_.isArray(input)) {
        sheets = _.filter(input, function (sheet) {
          return _.isString(sheet.title) && (untitled === false ? sheet.title.indexOf('Untitled') == -1 : sheet.title.indexOf('Untitled') != -1 );
        })
      }

      return sheets;
    }
  });
