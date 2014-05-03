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

  directives.directive('youEmail' , function ($rootScope) {

    var YOU = 'You ❤';

    function you(scope) {
      scope.you = scope.youEmail === $rootScope.auth.user.email ? YOU : scope.youEmail;
    }

    return {
      restrict: 'EA',
      replace : false,
      scope : {
        youEmail : '='
      },
      link : function (scope) {
        you(scope);

        scope.$watch('youEmail', function (val, oldVal) {
          if(angular.isString(val) && val != oldVal) {
            you(scope);
          }
        })
      },
      template : '{{ you }}'
    }
  });

  directives.directive('insertAtCursor', function ($parse) {

    function insertAtCursor($element, modelValue, value) {

// IE SUCKS!
//      //IE support
//      if (document.selection) {
//        myField.focus();
//        sel = document.selection.createRange();
//        sel.text = myValue;
//      }
      //MOZILLA and others
      if ($element.selectionStart || $element.selectionStart == '0') {
        var startPos = $element.selectionStart;
        var endPos = $element.selectionEnd;
        modelValue = modelValue.substring(0, startPos)
            + value
            + modelValue.substring(endPos, $element.value.length);
        $element.selectionStart = startPos + value.length;
        $element.selectionEnd = startPos + value.length;

      } else {
        modelValue += value;
      }

      return modelValue;
    }

    return {
      restrict: 'EA',
      controller : ['$scope','$attrs', function ($scope, $attrs) {
        $scope.$insertAtCursor = function (selector, value) {

          var modelValue = $parse($attrs.ngModel)($scope),
              $element = angular.element(selector);

          $element.focus();

          return ( insertAtCursor($element, modelValue, ' ' + value) );
        }
      }]
    };
  })

})(window.angular);



