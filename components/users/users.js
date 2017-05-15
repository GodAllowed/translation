'use strict';

angular.module('myApp.users', [
  'myApp.users.users-service',
  'myApp.users.users-factory'
])
.value('version', '0.1');
