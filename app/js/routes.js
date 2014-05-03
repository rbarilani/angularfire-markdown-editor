"use strict";

angular.module('myApp.routes', ['ngRoute'])

   // configure views; the authRequired parameter is used for specifying pages
   // which should only be available while logged in
   .config(['$routeProvider', function($routeProvider) {

      /**
       *
       * PUBLIC ROUTES
       *
       */

      /**
       * @ngdoc route
       * @url /home
       */
      $routeProvider.when('/home', {
         templateUrl: 'partials/home.html'
      });

      /**
       * @ngdoc route
       * @url /signin
       */
      $routeProvider.when('/signin', {
        templateUrl: 'partials/signin.html',
        controller: 'LoginCtrl'
      });


      /**
       *
       * PRIVATE ROUTES
       *
       */

      /**
       * @ngdoc route
       * @section user
       *
       * @requires auth
       * @url /account
       *
       * @description
       * Authenticated user can view/edit his profile details and change password (password provider login)
       */
      $routeProvider.when('/account', {
        authRequired: true, // must authenticate before viewing this page
        templateUrl: 'partials/account.html',
        controller: 'AccountCtrl'
      });

      /**
       * @ngdoc route
       * @section sheets
       *
       * @requires auth
       * @url /editor/new/:title
       * @param title - initialize a new sheet with this title
       *
       * @description
       * Authenticated can create a new sheet
       */
      $routeProvider.when('/editor/new-sync/:title', {
        authRequired: true,
        templateUrl: 'partials/editor.html',
        controller:  'SheetNewSyncCtrl'
      });

      /**
       * @ngdoc route
       * @section sheets
       *
       * @requires auth
       * @url /editor/real-new
       *
       * @description
       * ...
       */
      $routeProvider.when('/editor/new', {
        authRequired: true,
        templateUrl: 'partials/editor.html',
        controller:  'SheetNewCtrl'
      });

      /**
       * @ngdoc route
       * @section sheets
       *
       * @requires auth
       * @url /editor/:name
       * @param name - sheet's uid (or "firebase reference name")
       *
       * @description
       * Authenticated user can edit a sheet ("name is the uid of the sheet")
       */
      $routeProvider.when('/editor/:name', {
         authRequired: true,
         templateUrl: 'partials/editor.html',
         controller:  'SheetEditCtrl'
      });

      /**
       * @ngdoc route
       * @section sheets
       *
       * @requires auth
       * @url /sheets
       *
       * @description
       * Authenticated user can view/filter/reorder/remove multiple sheets
       */
      $routeProvider.when('/sheets', {
        authRequired: true,
        templateUrl: 'partials/sheets.html',
        controller:  'SheetsListCtrl'
      });

      /**
       * @ngdoc route
       * @section sheets
       *
       * @requires auth
       * @url /sheets/:name
       * @param name - sheet's uid (or "firebase reference name")
       *
       * @description
       * Authenticated user can view a sheet ("name is the uid of the sheet")
       */
      $routeProvider.when('/sheet/:name', {
        authRequired: true,
        templateUrl: 'partials/sheet.html',
        controller:  'SheetCtrl'
      });



      $routeProvider.otherwise({redirectTo: '/home'});
   }]);
