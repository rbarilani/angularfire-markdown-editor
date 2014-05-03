'use strict';


(function (angular){
  /**
   * @ngdoc module
   * @name myApp.controllers
   *
   * @description
   * App controllers module
   */
  var controllers = angular.module('myApp.controllers', [
    'myApp.controllers.sheets',
    'myApp.controllers.users'
  ]);
})(window.angular);

(function (angular) {

  /**
   * @ngdoc module
   * @name myApp.controllers.sheets
   *
   * @description
   * Sheet controllers module
   */
  var controllers = angular
      .module('myApp.controllers.sheets', []);

  controllers
    .controller('BaseSheetCtrl', function ($scope, $routeParams, sheetsService, orderByPriorityFilter, $location ) {
      var self = this;

      self.sheetsService = sheetsService;
      self.$routeParams  = $routeParams;

      self.orderByPriority = function (sheets) {
        return orderByPriorityFilter(sheets);
      }

      self.saveSheet = function (sheet, draft) {

        sheet.draft = draft;

        if(!angular.isString(sheet.$id)) {

          self.sheetsService.createSheet(sheet);

        }else{

          var _sheet = self.sheetsService
              .oneByName(sheet.$id);

          angular.extend(_sheet, sheet);

          _sheet.$save();
        }

        $location.path('/sheets');
      };

      $scope.$saveSheet = function (sheet) {
        self.saveSheet(sheet, false);
      };

      $scope.$saveSheetLikeDraft = function (sheet) {
        self.saveSheet(sheet, true);
      }
    })
    /**
     * @ng-doc controller
     * @name SheetNewCtrl
     *
     * @description
     * New Sheet Controller
     */
    .controller('SheetNewSyncCtrl', function ($scope, $controller) {
      var self = this;
      angular.extend(self, $controller('BaseSheetCtrl', {$scope: $scope}));

      self.sheetsService
        .createSheet(self.$routeParams.title)
        .then(function (o) {
            console.log(o);
            o.$bind($scope, 'sheet');
        });
    })

    /**
     * @ng-doc controller
     * @name SheetNewCtrl
     *
     * @description
     * New Sheet Controller
     */
    .controller('SheetNewCtrl', function ($scope, $controller) {
      var self = this;
      angular.extend(self, $controller('BaseSheetCtrl', {$scope: $scope}));

      $scope.sheet = self.sheetsService.emptySheet('New sheet');

    })


    /**
     * @ng-doc controller
     * @name SheetEditCtrl
     *
     * Edit Sheet Controller
     */
    .controller('SheetEditCtrl', function ($scope, $controller) {
      var self = this;
      angular.extend(self, $controller('BaseSheetCtrl', {$scope: $scope}));

      if (angular.isString(self.$routeParams.name)) {
        self.sheetsService
          .oneByName(self.$routeParams.name)
          .$bind($scope, 'sheet');
      }

    })

    /**
     * @ng-doc controller
     * @name SheetCtrl
     *
     * @description
     * View Sheet Controller
     */
    .controller('SheetCtrl', function ($scope, $controller) {
      var self = this;
      angular.extend(self, $controller('SheetEditCtrl', {$scope: $scope}));
    })

    /**
     * @ng-doc controller
     * @name SheetListCtrl
     *
     * @description
     * View Sheets List Controller
     */
    .controller('SheetsListCtrl', function ($scope, $controller) {
      var self = this;
      angular.extend(self, $controller('BaseSheetCtrl', {$scope: $scope}));

      $scope.sheets = self.sheetsService.sheets();

      $scope.criteria = {
        orderBy: 'created',
        orderByReverse: true
      };

      // FIXME!
      $scope.bug = false;

      $scope.removeSheet = function (sheetId) {

        if (self.orderByPriority($scope.sheets).length === 1) {
          $scope.bug = true;
        }

        $scope
          .sheets
          .$remove(sheetId)
          .then(function () {

            if ($scope.bug === true) {
              $scope.sheets = [];
              $scope.bug = false;
            }

          })
          .catch(function (response) {
            console.error(response);
          });
      };

      $scope.lockSheet = function (sheetId, lock) {
        if (angular.isString(sheetId)) {
          var sheet = self.sheetsService
              .oneByName(sheetId);
          sheet.lock = lock;
          sheet.$save();
        }
      };


    });

})(window.angular);



(function (angular) {

  /**
   * @ngdoc module
   * @name myApp.controllers.users
   *
   * @description
   * Users/Account/Login controllers module
   */
  var controllers  = angular.module('myApp.controllers.users', []);

  controllers
    /**
     * @ngdoc controller
     * @name UsersCtrl
     *
     * @description
     * ...
     */
    .controller('UsersCtrl', function ($scope, syncData) {
      $scope.users = syncData('users');
    })

    /**
     * @ngdoc controller
     * @name LoginCtrl
     *
     * @description
     * ...
     */
    .controller('LoginCtrl', ['$scope', 'loginService', '$location', function ($scope, loginService, $location) {
      $scope.username = null;
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;


      $scope.login = function (cb) {
        $scope.err = null;
        if (!$scope.email) {
          $scope.err = 'Please enter an email address';
        }
        else if (!$scope.pass) {
          $scope.err = 'Please enter a password';
        }
        else {
          loginService.login($scope.email, $scope.pass, function (err, user) {
            $scope.err = err ? err + '' : null;
            if (!err) {
              cb && cb(user);
            }
          });
        }
      };

      $scope.loginWith = function (providerName) {
        loginService
            .loginWith(providerName, function (err, user) {
              if (err) {
                $scope.err = err ? err + '' : null;
              }else{
                loginService.createProfile(user.uid, user.email, user.displayName);
              }
            });
      };

      $scope.createAccount = function () {
        $scope.err = null;
        if (assertValidLoginAttempt()) {
          loginService.createAccount($scope.email, $scope.pass, function (err, user) {
            if (err) {
              $scope.err = err ? err + '' : null;
            }
            else {
              // must be logged in before I can write to my profile
              $scope.login(function () {
                loginService.createProfile(user.uid, user.email, $scope.username);
                $location.path('/account');
              });
            }
          });
        }
      };

      function assertValidLoginAttempt() {
        if (!$scope.email) {
          $scope.err = 'Please enter an email address';
        }
        else if (!$scope.pass) {
          $scope.err = 'Please enter a password';
        }
        else if ($scope.pass !== $scope.confirm) {
          $scope.err = 'Passwords do not match';
        }
        return !$scope.err;
      }
    }])

    /**
     * @ngdoc controller
     * @name AccountCtrl
     *
     * @description
     * ...
     */
    .controller('AccountCtrl', ['$scope', 'loginService', 'syncData',
        function ($scope, loginService, syncData) {
      syncData(['users', $scope.auth.user.uid])
          .$bind($scope, 'user');

      $scope.logout = function () {
        loginService.logout();
      };

      $scope.oldpass = null;
      $scope.newpass = null;
      $scope.confirm = null;

      $scope.reset = function () {
        $scope.err = null;
        $scope.msg = null;
      };

      $scope.updatePassword = function () {
        $scope.reset();
        loginService.changePassword(buildPwdParms());
      };

      function buildPwdParms() {
        return {
          email: $scope.auth.user.email,
          oldpass: $scope.oldpass,
          newpass: $scope.newpass,
          confirm: $scope.confirm,
          callback: function (err) {
            if (err) {
              $scope.err = err;
            }
            else {
              $scope.oldpass = null;
              $scope.newpass = null;
              $scope.confirm = null;
              $scope.msg = 'Password updated!';
            }
          }
        }
      }

    }]);
})(window.angular);

