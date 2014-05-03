(function () {
  'use strict';

  /* Services */

  angular.module('myApp.services', ['myApp.service.login', 'myApp.service.firebase'])

      .factory('sheetsService', function ($rootScope, $firebase, firebaseRef, syncData) {

        var PATH = 'sheets',
            sheets = syncData(PATH);


        return {
          createSheet: function (title, body) {
            var self = this,
                sheet = {
                  title: title || self.randomTitle(),
                  body: body || '# Hello man!',
                  author: $rootScope.auth.user === null ? 'Unknown' : $rootScope.auth.user.email,
                  created: new Date()
                };

            return sheets
                .$add(sheet)
                .then(function (reference) {
                  return  $firebase(reference);
                })
          },
          oneByName: function (name) {
            return $firebase(firebaseRef(PATH, name));
          },
          randomTitle: function () {
            var time = new Date().getTime();
            var title = 'Untitled-' + time + '-' + ($rootScope.auth.user === null ? 'Unknown' : $rootScope.auth.user.email)
            return title;
          },
          sheets: sheets
        }
      })


  // put your services here!
  // .service('serviceName', ['dependency', function(dependency) {}]);

})();

