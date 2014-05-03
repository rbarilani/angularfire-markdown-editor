"use strict";

angular.module('myApp.routes', ['ngRoute'])

   // configure views; the authRequired parameter is used for specifying pages
   // which should only be available while logged in
   .config(['$routeProvider', function($routeProvider) {

      $routeProvider.when('/home', {
         templateUrl: 'partials/home.html'
      });

      $routeProvider.when('/editor/:name', {
         authRequired: true,
         templateUrl: 'partials/editor.html',
         controller:  'SheetEditCtrl'
      });

      $routeProvider.when('/editor/new/:title', {
        authRequired: true,
        templateUrl: 'partials/editor.html',
        controller:  'SheetNewCtrl'
      });

      $routeProvider.when('/sheets', {
        authRequired: true,
        templateUrl: 'partials/sheets.html',
        controller:  'SheetsListCtrl'
      });

      $routeProvider.when('/sheet/:name', {
        authRequired: true,
        templateUrl: 'partials/sheet.html',
        controller:  'SheetCtrl'
      });

      $routeProvider.when('/account', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'partials/account.html',
         controller: 'AccountCtrl'
      });

      $routeProvider.when('/login', {
         templateUrl: 'partials/login.html',
         controller: 'LoginCtrl'
      });

      $routeProvider.otherwise({redirectTo: '/home'});
   }]);
