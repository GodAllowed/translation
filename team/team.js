'use strict';

angular.module('myApp.team', ['ngRoute', 'myApp.users.users-factory', 'myApp.users.users-service', 'myApp.common.common-factory'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/team', {
    templateUrl: 'team/team.html',
    controller: 'teamCtrl'
  })
  .when('/team/invite', {
  	templateUrl: 'team/invite.html',
  	controller: 'teamInviteCtrl'
  });
}])

.controller('teamCtrl', ['$scope', 'usersFactory', 'usersService', function($scope, usersFactory, usersService) {
	// getting user team 
	usersFactory.team().then(function(d){
		if(d.status != 'error'){
			$scope.users = d.data.records;
		}else{
			$scope.noMembers = true;
		}
	});

	// delete user from team
	$scope.removeFromTeam = function(userID, index){
		usersFactory.removeFromTeam(userID).then(function(d){
			if(d.status != 'error'){
				$scope.users.splice(index, 1);
			}else{
				console.log(d.errors);
			}
		});
	};
}])
.controller('teamInviteCtrl', ['$scope', 'usersFactory', 'usersService', 'commonFactory', function($scope, usersFactory, usersService, commonFactory){
	//define vars
	$scope.user = {};
	$scope.user.langs = [];

	commonFactory.getLangs().then(function(d) {
	    $scope.langs = d.data.records;
	});

	$scope.createNewUser = function() {
	    usersFactory.inviteUser($scope.user).then(function(d){
	    	console.log(d);
	    	if(d.status != 'error'){
	    		$scope.success = 'Invite was send to user e-mail';
	    	}else{
	    		$scope.errors = d.errors;
	    	}
	    });
	};

	$scope.pushLangToUser = function(langID) {
	    $scope.user.langs.push(langID);
	};

}]);