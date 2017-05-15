'use strict';

angular.module('myApp.usersCtrls', ['ngRoute', 'myApp.users.users-factory', 'myApp.users.users-service', 'myApp.common.common-factory'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users', {
    templateUrl: 'users/users.html',
    controller: 'usersCtrl'
  });
}])

.controller('usersCtrl', ['$scope', '$route', 'usersFactory', 'usersService', 'commonFactory', function($scope, $route, usersFactory, usersService, commonFactory){
  var userID = $route.current.params.id;
	usersFactory.single(userID).then(function(d){
    if(d.status == 'success'){
      $scope.user = d.data.records;
    }else{
      console.log('user not found');
    }
  });

  // add to team member
  $scope.addToTeam = function(id){
    usersFactory.addToTeam(id).then(function(d){
      if(d.status == 'success'){
        $scope.success = 'User added to your team';
      }else{
        $scope.errors = d.errors;
      }
    });
  }
}]);