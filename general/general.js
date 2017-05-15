'use strict';

angular.module('myApp.general', ['ngRoute', 'myApp.users.users-service', 'myApp.common.common-factory'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/registration', {
            templateUrl: 'general/registration.html',
            controller: 'registrationCtrl'
        })
        .when('/restore', {
            templateUrl: 'general/restore.html',
            controller: 'restoreCtrl'
        })
        .when('/logout', {
            template: 'Wait...',
            controller: 'logoutCtrl'
        })
        .when('/settings/security', {
            templateUrl: 'general/settings-security.html',
            controller: 'settingsSecurityCtrl'
        })
        .when('/settings/languages', {
            templateUrl: 'general/settings-languages.html',
            controller: 'settingsLanguagesCtrl'
        })
        .when('/settings', {
            templateUrl: 'general/settings-general.html',
            controller: 'settingsGeneralCtrl'
        })
        .when('/dashboard', {
            templateUrl: 'general/dashboard.html',
            controller: 'dashboardCtrl'
        });
}])

.controller('registrationCtrl', ['$scope', 'usersFactory', 'usersService', function($scope, usersFactory, usersService) {

        $scope.doReg = function() {
            var regUser = usersFactory.add($scope.user).then(function(d) {
                if (d.status == 'error') {
                    $scope.errors = d.errors;
                } else {
                    usersService.setToken(d.data.token);
                    window.location.replace('#!/dashboard');
                }
            });
        };

    }])
    .controller('restoreCtrl', ['$scope', 'usersFactory', function($scope, usersFactory) {
        $scope.doRestore = function() {
            var restoreUser = usersFactory.restore($scope.user).then(function(d) {
            	if(d.status == 'error'){
            		$scope.errors = d.errors;
            	}else{
            		$scope.success = "New password was send to you e-mail";
            		console.log('Restore: send to mail!');
            	}
            });
        };
    }])
    .controller('logoutCtrl', ['usersService', function(usersService){
    	if(usersService.logOut()){ }else{ console.log('Logout: faild!'); }
    	window.location.replace('#!/auth');
    }])
    .controller('settingsGeneralCtrl', ['$scope', 'usersFactory', 'commonFactory', function($scope, usersFactory, commonFactory){
        usersFactory.current().then(function(d){
            if(d.status == 'success'){
                $scope.user = d.data.records;
            }
        });
        commonFactory.getCountries().then(function(d){
            if(d.status == 'success'){ $scope.countries = d.data.records; }
        });
        commonFactory.getLangs().then(function(d){
            if(d.status == 'success'){ $scope.langs = d.data.records; }
        });        
        $scope.changeProfileInfo = function(){
           usersFactory.updateCurrent($scope.user).then(function(d){
            $('form.ng-submitted').removeClass('ng-submitted');
            if(d.status == 'success'){
                $scope.success = 'All changes saved!';
            }else{
                $scope.errors = d.errors;
            }
           });
        };
    }])
    .controller('settingsLanguagesCtrl', ['$scope', 'usersFactory', 'commonFactory', function($scope, usersFactory, commonFactory){
        usersFactory.current().then(function(d){
            if(d.status == 'success'){
                if(d.data.records.languages.length > 0){
                    $scope.userLangs = d.data.records.languages;
                }else{
                    $scope.noLangs = true;
                }
            }
        });

        // gettings languages
        commonFactory.getLangs().then(function(d){
            if(d.status == 'success'){
                $scope.aviableLangs = d.data.records;
            }
        });

        $scope.changeLang = function(){
            usersFactory.addLang($scope.lang).then(function(d){
                $('form.ng-submitted').removeClass('ng-submitted');
                if(d.status == 'success'){
                    $scope.success = 'Language data was updated!';
                }else{
                    $scope.errors = d.errors;
                }
            });
        };

        $scope.loadLangPreference = function(langID, index){
            $scope.lang =  $scope.userLangs.find(function(temp){ return temp.id == langID; });
            $scope.success = null;
            $scope.errors = null;
        };

        $scope.addNewLang = function(){
            usersFactory.addLang($scope.newLang).then(function(d){
                if(d.status == 'success'){
                    var find = $scope.aviableLangs.findIndex(function(temp){ return temp.id == $scope.newLang.id;});
                    $scope.userLangs.push($scope.aviableLangs[find]);
                    $scope.aviableLangs.splice(find, 1);
                    $scope.newLang.id = '';
                    $scope.newLang.rate = '';
                    $('form.ng-submitted').removeClass('ng-submitted');
                    $('#add-lang-modal').modal('hide');
                }else{
                    $scope.addLangErrors = d.errors;
                }
            });
        };

    }])
    .controller('settingsSecurityCtrl', ['$scope', 'usersFactory', 'usersService', function($scope, usersFactory, usersService){
          $scope.token = usersService.getToken();
           $scope.changePassword = function(){
               usersFactory.updateCurrentPassword($scope).then(function(d){
                $('form.ng-submitted').removeClass('ng-submitted');
                if(d.status == 'success'){
                    $scope.success = 'All changes saved!';
                }else{
                    $scope.errors = d.errors;
                }
               });
           };              
    }])
    .controller('dashboardCtrl', ['$scope', 'usersFactory', 'usersService', function($scope, usersFactory, usersService){
    	if(!usersService.getToken()){ window.location.replace('#!/auth'); }
    	var temp = usersFactory.getInvites().then(function(d) {
    	    if (d.status != 'error') {
    	        $scope.invites = d.data.records;
    	    } else {
    	        $scope.invites = false;
    	    }
    	});
    	$scope.updateInvite = function(status, inviteID, index) {
    		usersFactory.updateInvite(status, inviteID).then(function(d){
    			if(d.status != 'error'){
    				$scope.invites.splice(index, 1);
    			}else{
    				console.log('Upate: Fatal error');
    			}
    		});
    	};

    }]);
