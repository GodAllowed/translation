'use strict';

angular.module('myApp.projectsHelpers.projects-factory', ['myApp.projectsHelpers.projects-service', 'myApp.users.users-service'])

.factory('projectsFactory', ['$http', 'projectsService', 'usersService', function($http, projectsService, usersService) {
    var promise;

    // authorization method
    var projectsFactory = {
        get: function() {
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/user_projects', { token: usersService.getToken() }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;
        },
        single: function(projectID){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/project', { 
                    token: usersService.getToken(), 
                    project_id: projectID 
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;
        },
        removeProjectVars: function(projectID, projectVars){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'delete/project/var', {
                    token: usersService.getToken(),
                    project_id: projectID,
                    ids: projectVars
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;  
        },
        getVars: function(projectID, offset = 1, limit = 50, hidden = 0){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/project/var', {
                    token: usersService.getToken(),
                    project_id: projectID,
                    hidden: hidden,
                    limit: limit,
                    offset: offset-1
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;             
        },
        addVar: function(projectID, varName, varDesc){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'put/project/var', {
                    token: usersService.getToken(),
                    project_id: projectID,
                    name: varName,
                    description: varDesc
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;            
        },
        translation: function(projectID, lang, offset = 0, limit = 50){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/project/translation', {
                    token: usersService.getToken(),
                    project_id: projectID,
                    lang: lang,
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

        putTranslation: function(lang, project, translation){
            var promise;

            //make array
            var trans = [];
            for(var i = 0; i < translation.length; i++){
                trans.push({ 
                    lang_var_id: translation[i].id, 
                    value: translation[i].value, 
                    approve: translation[i].approved, 
                    approve_text: translation[i].approved_text
                });
            }

            if (!promise) {
                promise = $http.post(API + 'put/project/translation', {
                    token: usersService.getToken(),
                    lang: lang,
                    project_id: project,
                    translation: trans
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;
        },

        addLang: function(project, lang){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'put/lang_to_project', {
                    token: usersService.getToken(),
                    lang: lang.id,
                    translator: lang.translator.id,
                    moderator:  lang.moderator.id,
                    project_id: project.id
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;
        },

        put: function(project) {
            var promise;
            if (!promise) {
                promise = $http.post(API + 'put/project', {
                    token: usersService.getToken(),
                    name: project.name,
                    site_url: project.domain,
                    system: project.system,
                    default_lang: project.defaultLang
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;
        },

        getPluginLaravel: function(project){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'get/plugin/laravel', { 
                    token: usersService.getToken(), 
                    project_id: project.id 
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;            
        },

        checkConection: function(project){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'check/connection/laravel', { 
                    token: usersService.getToken(), 
                    project_id: project.id 
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;             
        },

        pay: function(project){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'pay/project', { 
                    token: usersService.getToken(), 
                    project_id: project.id 
                }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;             
        },

        remove: function(projectID){
            var promise;
            if (!promise) {
                promise = $http.post(API + 'delete/project', { token: usersService.getToken(), project_id: projectID }).then(function(response) {
                    return { status: 'success', data: response.data };
                }, function(response) {
                    return { status: 'error', errors: response.data.text };
                });
            }

            return promise;            
        }
    };

    return projectsFactory;
}]);
