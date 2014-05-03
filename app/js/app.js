'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [

      'myApp.config',
      'myApp.routes',
      'myApp.filters',
      'myApp.services',
      'myApp.directives',
      'myApp.controllers',
      'waitForAuth',
      'routeSecurity',

      'ngSanitize',
      'btford.markdown'
   ])

   .run(['loginService', '$rootScope', 'FBURL', '$location','syncData', '$route', 'sheetsService',
      function(loginService, $rootScope, FBURL, $location, syncData, $route, sheetsService) {
      if( FBURL === 'https://INSTANCE.firebaseio.com' ) {
         // double-check that the app has been configured
         angular.element(document.body).html('<h1>Please configure app/js/config.js before running!</h1>');
         setTimeout(function() {
            angular.element(document.body).removeClass('hide');
         }, 250);
      }
      else {
         // establish authentication
         $rootScope.auth = loginService.init('/login');
         $rootScope.FBURL = FBURL;
         $rootScope.$location = $location;

         $rootScope.security = {
           logout : function () {
             loginService.logout();
           }
         };

        $rootScope.$route = $route;

         $rootScope.$on('$routeChangeSuccess', function (e, current) {

           if($rootScope.auth.user != null) {

             var user = syncData(['users', $rootScope.auth.user.uid], 1);

             user.$child('url').$set($location.url());

           }

         });

        $rootScope.sheetsService = sheetsService;

        // FIXME!!!
        jQuery(window).bind(
            "beforeunload",
            function() {
              if($rootScope.auth.user != null) {
                var user = syncData(['users', $rootScope.auth.user.uid], 1);
                user.$child('url').$set(null);
              }
            }
        )
      }


    }]);