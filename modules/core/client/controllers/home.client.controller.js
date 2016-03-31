'use strict';

angular.module('core').controller('HomeController', ['$scope', '$timeout', 'Authentication', 'Articles',
  function ($scope, $timeout, Authentication, Articles) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    var phrases = ['Web Development', 'Technological Solutions', 'Digital Marketing', 'Automatization', 'Robotics'];
    var current = 0;
    $scope.text = '';   

    $scope.create = function (isValid) {
      console.log('isValid',isValid);
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.nombre + ' - ' + this.email,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        // Clear form fields
        $scope.nombre = '';
        $scope.email = '';
        $scope.content = '';
        $scope.message = 'Su consulta ha sido enviada con éxito, muchas gracias.';
        $scope.error = '';
      }, function (errorResponse) {
        $scope.message = '';
        $scope.error = 'Por favor verifique los datos ingresados.';//errorResponse.data.message;
      });
    };

    setTimeout(function() {
      changeText(phrases[0]);
    }, 1000);


    function concat(newText, i){
      $timeout(function() {
        $scope.text += newText[i];
      }, i * 100);
    }

    function slice(j){
      $timeout(function() {
        // someMethod(i);
        $scope.text = $scope.text.slice(0,-1);
      }, j * 50);
    }

    function changeText(newText){      
      for(var i = 0; i < newText.length; i++) {
        concat(newText, i);
      }
      // Cuando termina de escribir la palabra, espera 1 segundo y la borra
      $timeout(function(){        
        for(var j = 0; j < $scope.text.length; j++) {
          slice(j);
        }
        // Tiempo que tarda en escribir la frase
      }, newText.length * 100 + 1000);

      $timeout(function(){        
        current = current >= phrases.length - 1 ? 0 : current + 1;                
        changeText(phrases[current]);          
        
        // Tiempo que tarda en escribirla y borrarla
      },newText.length * 150 + 1000); 
    }

  }
]);
