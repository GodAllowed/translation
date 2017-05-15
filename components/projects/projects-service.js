'use strict';

angular.module('myApp.projectsHelpers.projects-service', [])

.service('projectsService', ['$http', '$cookies', '$cookieStore', function($http, $cookies, $cookieStore) {
    this.cookieAuth = function(userData) {
        $cookieStore.put('token', userData.token);
        $cookieStore.put('id', userData.id);
        $cookieStore.put('username', userData.name);
        $cookieStore.put('balance', userData.balance);
    };
}]);
