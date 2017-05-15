'use strict';

angular.module('myApp.authorization', ['ngRoute', 'myApp.users', 'myApp.users.users-factory', 'myApp.users.users-service'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/auth', {
            templateUrl: 'authorization/authorization.html',
            controller: 'authorizationCtrl'
        });
    }])

    .controller('authorizationCtrl', ['$scope', 'usersFactory', 'usersService', function ($scope, usersFactory, usersService) {
        if (usersService.checkAuth()) {
            window.location.replace('#!/dashboard');
        }
        $scope.doAuth = function () {
            var authResult = usersFactory.auth($scope.userMail, $scope.userPassword).then(function (d) {
                if (d.status == 'error') {
                    $scope.errors = ['User not found in our system'];
                } else {
                    window.location.replace('#!/dashboard');
                }
            });
        }

    }]);