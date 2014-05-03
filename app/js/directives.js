'use strict';

/* Directives */

(function (angular) {

  var directives = angular.module('myApp.directives', ['angular-md5']);

  directives.directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
          elm.text(version);
        };
      }]);

  directives.directive('pageHeader', [function () {
    var template = '<div class="page-header"><h1 ng-transclude></h1></div>';

    return  {
      restrict: 'EA',
      replace : true,
      transclude : true,
      template: template
    }
  }])

  directives.directive('gravatar', function (md5) {
    return {
      restrict: 'EA',
      replace : true,
      scope : {
        email : '=gravatar'
      },
      controller : function ($scope) {
        $scope.hash = 'none';

        $scope.$watch('email', function (val) {
          if(angular.isString(val)) {
            $scope.hash = md5.createHash(val);
          };
        })
      },
      template : '<a class="thumbnail">' +
          '<img ng-src="http://www.gravatar.com/avatar/{{ hash }}">' +
        '</a>'
    }
  });

  directives.directive('sheetRow' , function () {
    return {
      restrict: 'EA',
      replace : true,
      templateUrl : 'templates/sheetRow.html'
    }
  });

  directives.directive('markdownEditor' , function () {
    return {
      restrict: 'EA',
      controller : ['$scope', function ($scope) {
        $scope.editor = {
          mode  : 'preview', // 'live' || 'preview'
          phase : {
            preview : false
          }
        };
      }]
    }
  });

})(window.angular);



