'use strict';

angular.module('myApp.users.users-service', [])

.service('usersService', ['$http', '$cookies', '$cookieStore', function($http, $cookies, $cookieStore) {
    this.cookieAuth = function(userData) {
        $cookieStore.put('token', userData.token);
        $cookieStore.put('id', userData.id);
        $cookieStore.put('username', userData.name);
        $cookieStore.put('balance', userData.balance);
    };

    this.setToken = function(token){
        $cookieStore.put('token', token);
    };

    this.logOut = function(){
        $cookieStore.remove('token');
        $cookieStore.remove('id');
        $cookieStore.remove('username');
        $cookieStore.remove('balance');    	
        return true;
    };

    this.getToken = function(){
    	return $cookieStore.get('token');
    };

    this.checkAuth = function(){
    	if($cookieStore.get('token')){
    		return true;
    	}else{
    		return false;
    	}
    };
}]);
