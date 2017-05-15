'use strict';

angular.module('myApp.users.users-factory', ['myApp.users.users-service','myApp.common.common-factory'])

.factory('usersFactory', ['$http', 'usersService', 'commonFactory', function($http, usersService, commonFactory) {
    var promise;

    // authorization method
    var usersFactory = {
        auth: function(email, password) {
            var promise;
            if (!promise) {
                promise = $http.post(API + 'auth', { email: email, password: password }).then(function(response) {
                	usersService.cookieAuth(response.data);
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;
        },

        team: function(){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/user_team', {token: usersService.getToken()}).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;
        },

        single: function(userID){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/user/'+userID, {token: usersService.getToken()}).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;
        },

        inviteUser: function(userData){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'put/user', {
                    token: usersService.getToken(), 
                    email: userData.email,
                    name: userData.name,
                    langs: userData.langs,
                    type: 'translater'
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;            
        },

        removeFromTeam : function(userID){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'delete/from_team', {token: usersService.getToken(), user_id: userID}).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;            
        },

        add: function(userData) {
            var promise;
            if (!promise) {
                promise = $http.post(API + 'put/user', userData).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;
        },

        addLang: function(userLang){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'put/language/to/user', {
                    token: usersService.getToken(),
                    language_id: userLang.id,
                    rate: userLang.rate
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }
            return promise;            
        },

        getInvites: function(limit = 5, offset = 0) {
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/invents', {
                    token: usersService.getToken(),
                    limit: limit,
                    offset: offset
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }
            return promise;
        },

        addToTeam: function(userID){
            var promise;
            if(!promise){
                promise = $http.post(API + 'put/user/to/team', { token: usersService.getToken(), user_id: userID }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }
            return promise;
        },

        updateInvite: function(inviteStatus, inviteID){
            var promise;
            if(!promise){
                promise = $http.post(API + 'update/invite', { token: usersService.getToken(), status: inviteStatus, invite_id: inviteID }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }
            return promise;
        },

        updateCurrent: function(userData){
            var promise;
            if(!promise){
                promise = $http.post(API + 'update/user', { 
                    token: usersService.getToken(), 
                    email: userData.email, 
                    name: userData.name

                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }
            return promise;            
        },

        updateCurrentPassword: function(password){
            var promise;
            if(!promise){
                promise = $http.post(API + 'update/user', { 
                    password: password.current,
                    new_password: password.new,
                    password_confirm: password.confirm
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }
            return promise; 
        },

        current: function() {
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/user/self', { token: usersService.getToken() }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }
            return promise;
        },

        restore: function(userData) {
            var promise;
            if (!promise) {
                promise = $http.post(API + 'api/forger_password', userData).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;
        }
    };

    return usersFactory;
}]);
