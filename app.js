var app = angular.module('duplicity', []);

app.controller('DuplicityController', ['$scope', '$http', '$sce',
  function($scope, $http, $sce) {
    'use strict';
    $scope.sourceFile = 'source2.txt';
    $scope.output = '';
    $scope.source = '';

    $scope.loadContent = function(){
      $http.get($scope.sourceFile, {header : {'Content-Type' : 'text/plain','charset':'UTF-8',' Accept-Charset':'UTF-8'}})
      .success(function(data) {
          $scope.source = data;
          //$scope.sourceHtml = $sce.trustAsHtml('<p>' + data.split('\n').join('<br />') + '</p>');
          $scope.sourceHtml = $sce.trustAsHtml('<p>' + data.split('\n').join('</p><p>') + '</p>');
      });
    };

    $scope.removeDuplicity = function(){
      var sourceArr = $scope.source.split('\n');
      var duplicityToRemove;
      var duplicityToRemoveString = '';
      var tmpForChecking = '';
      var duplicityFound = false;
      for (var i = 0; i < sourceArr.length; i++){
        tmpForChecking = sourceArr[i] + ' ';
        do {
          duplicityFound = false;
          duplicityToRemove = findOneDuplicityfromLine(tmpForChecking.split(' '))
          if (typeof(duplicityToRemove) != 'undefined') {
            duplicityFound = true;
            if (duplicityToRemove.constructor === Array) {
              tmpForChecking = tmpForChecking.replace(duplicityToRemove.join(' ') + ' ','');
              duplicityToRemoveString = duplicityToRemove.join(' ');
            } else {
              tmpForChecking = tmpForChecking.replace(duplicityToRemove + ' ','');
              duplicityToRemoveString = duplicityToRemove;
            }
            
            if (duplicityToRemoveString.length > 2) {  // only positive duplicities (no single repetative short words)
              if (sourceArr[i].indexOf(duplicityToRemoveString + ' ' + duplicityToRemoveString)>0) {  //duplicities must follow one another
                //console.log('Will be removed: ' + duplicityToRemoveString)
                if (sourceArr[i].indexOf(duplicityToRemoveString + ' ')>0) {  //duplicities must follow one another
                  duplicityToRemoveString = duplicityToRemoveString + ' ';
                } else {
                  duplicityToRemoveString = ' ' + duplicityToRemoveString;
                }
                sourceArr[i] = sourceArr[i].replace(duplicityToRemoveString, ''); 
              }
              
            }
          }
        } while (duplicityFound);
      }

      $scope.output = sourceArr.join('\n');
      $scope.outputHtml = $sce.trustAsHtml('<p>' + $scope.output.split('\n').join('</p><p>') + '</p>');
    };

    function findOneDuplicityfromLine(inArr){
      var nextWordFound = false;
      var duplicateArr = [];
      var z = 0;
      var iTmp = 0;
      var yTmp = 0;
      for (var i = 0; i < inArr.length; i++){
        for (var y = i + 1; y < inArr.length; y++){
          if (inArr[i]==inArr[y]){ //possible duplicity
            duplicateArr[z] = inArr[i];
            z++;
            iTmp = i;
            yTmp = y;
            do {
              iTmp++;
              yTmp++;
              nextWordFound = false;
              if (inArr[iTmp]==inArr[yTmp]){
                nextWordFound = true;
                duplicateArr[z] = inArr[iTmp];
                z++;
              }
            } while (nextWordFound)
            if (z>0){
              return duplicateArr
            }
          }
        }
      }
    };

    $scope.highlightDuplicity = function(){ // same as removeDuplicity(), but adds class instead of removing duplicities
      var sourceArr = $scope.source.split('\n');
      var duplicityToRemove;
      var duplicityToRemoveString = '';
      var tmpForChecking = '';
      var duplicityFound = false;
      for (var i = 0; i < sourceArr.length; i++){
        tmpForChecking = sourceArr[i] + ' ';
        do {
          duplicityFound = false;
          duplicityToRemove = findOneDuplicityfromLine(tmpForChecking.split(' '))
          if (typeof(duplicityToRemove) != 'undefined') {
            duplicityFound = true;
            if (duplicityToRemove.constructor === Array) {
              tmpForChecking = tmpForChecking.replace(duplicityToRemove.join(' ') + ' ','');
              duplicityToRemoveString = duplicityToRemove.join(' ');
            } else {
              tmpForChecking = tmpForChecking.replace(duplicityToRemove + ' ','');
              duplicityToRemoveString = duplicityToRemove;
            }
            
            if (duplicityToRemoveString.length > 2) {  // only positive duplicities (no single repetative short words)
              if (sourceArr[i].indexOf(duplicityToRemoveString + ' ' + duplicityToRemoveString)>0) {  //duplicities must follow one another
                //console.log('Will be removed: ' + duplicityToRemoveString)
                sourceArr[i] = sourceArr[i].replace(duplicityToRemoveString + ' ', '<span class="bg-success">' + duplicityToRemoveString + ' ' + '</span>');
                sourceArr[i] = sourceArr[i].replace('</span>' + duplicityToRemoveString, '</span><span class="bg-danger">' + duplicityToRemoveString + '</span>'); 
              }
              
            }
          }
        } while (duplicityFound);
      }

      $scope.output = sourceArr.join('\n');
      $scope.outputHtml = $sce.trustAsHtml('<p>' + $scope.output.split('\n').join('</p><p>') + '</p>');
    };


  }]);
