'use strict';

angular.module('myApp.common.common-factory', ['myApp.users.users-service'])

.factory('commonFactory', ['$http', 'usersService', function($http, usersService) {
    var promise;

    // authorization method
    var commonFactory = {
        getLangs: function(){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/languages', { token: usersService.getToken() }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;        	
        },

        getSystems: function(){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/systems', { token: usersService.getToken() }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;  
        },

        getTranslators: function(lang = null, name = null){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/translators', { 
                    token: usersService.getToken(),
                    lang: lang,
                    name: name 
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;
        },

        getCountries: function(){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/country', { token: usersService.getToken() }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;             
        }

    };

    return commonFactory;
}]);
