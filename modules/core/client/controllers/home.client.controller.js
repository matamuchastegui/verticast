'use strict';

angular.module('core').controller('HomeController', ['$scope', '$timeout', 'Authentication',
  function ($scope, $timeout, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    var phrases = ['Web Development', 'Technological Solutions', 'Digital Marketing', 'Automatization', 'Robotics'];
    var current = 0;
    $scope.text = '';
    console.log('home');
    console.log($scope.text);
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
      console.log('newText',newText);
      for(var i = 0; i < newText.length; i++) {
        /* jshint -W034 */
        // function(i){  
        //   $timeout(function() {
        //     // someMethod(i);
        //     console.log('nuevo texto');
        //     $scope.text += newText[i];
        //   }, i * 100);
        // }
        concat(newText, i);
      }
      // Cuando termina de escribir la palabra, espera 1 segundo y la borra
      $timeout(function(){
        console.log('borrar');
        for(var j = 0; j < $scope.text.length; j++) {
          slice(j);
          // (function(j){  // i will now become available for the someMethod to call
          //   $timeout(function() {
          //     // someMethod(i);
          //     $scope.text = $scope.text.slice(0,-1);
          //   }, j * 50);
          // })(j); // Pass in i here
        }
        // Tiempo que tarda en escribir la frase
      }, newText.length * 100 + 1000);

      $timeout(function(){
        console.log('before current',current);
        current = current >= phrases.length - 1 ? 0 : current + 1;
        console.log('current',current);
        console.log('Próxima Frase: '+phrases[current]);
        changeText(phrases[current]);  
        console.log('change phrase for '+phrases[current]);
        
        // Tiempo que tarda en escribirla y borrarla
      },newText.length * 150 + 1000); 
    }

  }
]);
