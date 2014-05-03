(function () {
  'use strict';

  /* Services */

  angular.module('myApp.services', ['myApp.service.login', 'myApp.service.firebase'])

      .factory('sheetsService', function ($rootScope, $firebase, firebaseRef, syncData) {

        function assertAuth(methodName) {
            if ($rootScope.auth.user === null) {
              throw new Error('Must be a $rootScope.auth.user before using this method : "' + methodName + '"');
            }
        }

        var PATH = 'sheets';

        return {

          emptySheet : function (title, body, draft) {

            assertAuth('emptySheet');

            var self = this;

            return {
              title: title || self.randomTitle(),
              body: body || '# Hi man!',
              author: $rootScope.auth.user.email,
              created: new Date(),
              draft : angular.isDefined(draft) ? draft : true
            }
          },

          createSheet: function (title, body, draft) {
            assertAuth('createSheet');

            var self = this, sheet;

            if(angular.isString(title)) {

              // is a title, new draft document
              sheet = self.emptySheet(title, body, draft);

            }else if (angular.isObject(title)) {

              sheet = angular.extend(self.emptySheet(undefined, body, draft), title);

            }else{

              sheet = self.emptySheet(title, body, draft);

            }

            return self.sheets()
                .$add(sheet)
                .then(function (reference) {
                  return  $firebase(reference);
                })
          },
          oneByName: function (name) {

            return $firebase(firebaseRef(PATH, name));

          },
          randomTitle: function (includeDate) {
            assertAuth('randomTitle');

            if(includeDate === false) {

              return 'Untitled-' + ($rootScope.auth.user === null ? 'Unknown' : $rootScope.auth.user.email);

            }else{

              var time = new Date().getTime();
              var title = 'Untitled-' + time + '-' + ($rootScope.auth.user === null ? 'Unknown' : $rootScope.auth.user.email)
              return title;

            }
          },
          sheets: function () {
            return syncData(PATH);
          }
        }
      })


  // put your services here!
  // .service('serviceName', ['dependency', function(dependency) {}]);

})();

