'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', '$document', 'Authentication', 'Menus', '$window',
  function ($scope, $state, $document, Authentication, Menus, $window) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');
    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    $scope.scrollTop = function(){
      $document.scrollTopAnimated(0, 1000);
    };

    $scope.scrollTo = function(item){
      var someElement = angular.element(document.getElementById(item));
      $document.scrollToElement(someElement, 50, 1000);
    };
  }
]);
