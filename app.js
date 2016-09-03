var app = angular.module('duplicity', []);

app.controller('DuplicityController', ['$scope', '$http',
  function($scope, $http) {
    $scope.loadContent = function(){
      //alert('load');
      //$http.get('source.txt', {header : {'Content-Type' : 'charset=UTF-8' ; 'Accept-Charset' : 'UTF-8'}})
      $http.get('source.txt', {header : {'Content-Type' : 'text/plain','charset':'UTF-8',' Accept-Charset':'UTF-8'}})
      .success(function(data) {
          $scope.source = data;
          console.log(data);
      });

var test = $.ajax({
   type:"GET",
   url:"source.txt",
   headers: {
       "Content-Type": "text/plain",
       "charset": "UTF-8",
       "Accept": "text/plain;charset=utf-8",
       "Accept-Charset":"charset=utf-8"
   },
   dataType:"json",
   complete:function(response){
     console.log(response.responseText)
   }
});
 //c
console.log(test);

//Accept-Charset: UTF-8
    };



  }]);
