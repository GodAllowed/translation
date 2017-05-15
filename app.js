'use strict';

const API = 'http://api.fnukraine.pp.ua/';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.authorization',
  'myApp.general',
  'myApp.usersCtrls',
  'myApp.team',
  'myApp.projects',
  'myApp.common'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/auth'});
}]);
