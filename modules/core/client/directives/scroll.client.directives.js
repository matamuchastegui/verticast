'use strict';

angular.module('core').directive("scroll", ['$document'], function ($window, $document) {
  return function(scope, element, attrs) {

    angular.element($window).bind("scroll", function() {
      if (this.pageYOffset >= 100) {
        scope.boolChangeClass = true;
        console.log('Scrolled below header.',this.pageYOffset);
        var someElement = angular.element(document.getElementById('contacto'));
        $document.scrollToElement(someElement, 50, 1000);

       } else {
         scope.boolChangeClass = false;
         console.log('Header is in view.',this.pageYOffset);
       }
      scope.$apply();
    });
  };
});