'use strict';

angular.module('myApp.common.top-panel-directive', ['myApp.users.users-factory'])

.directive('userBalance', function() {
    return {
      restrict: 'AE',
      controller: function($scope, usersFactory){
        $scope.balance = 0;
            usersFactory.current().then(function(d) {
              if(d.status == 'success'){
                $scope.balance = d.data.records.balance;
              }
            });
      },
      replace: 'true',
      template: '<span>${{balance}}</span>'
    };
})
.directive('userName', function(){
    return {
      restrict: 'AE',
      controller: function($scope, usersFactory){
            usersFactory.current().then(function(d) {
              if(d.status == 'success'){
                $scope.name = d.data.records.name;
              }
            });
      },      
      replace: 'true',
      template: '<span>{{name}}</span>'
    };  
});
