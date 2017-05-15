'use strict';

angular.module('myApp.projects', ['ngRoute', 'myApp.common.common-factory', 'myApp.projectsHelpers.projects-factory', 'tableSort', 'content-editable'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/projects', {
    templateUrl: 'projects/projects.html',
    controller: 'projectsCtrl'
  })
  .when('/projects/vars', {
  	templateUrl: 'projects/vars.html',
  	controller: 'varsCtrl'  	
  }) 
  .when('/projects/create', {
  	templateUrl: 'projects/create.html',
  	controller: 'createCtrl'  	
  }) 
  .when('/projects/preference', {
  	templateUrl: 'projects/preference.html',
  	controller: 'preferenceCtrl'
  })
  .when('/projects/translation', {
  	templateUrl: 'projects/translation.html',
  	controller: 'translationCtrl'
  });
}])

.controller('projectsCtrl', ['$scope', 'projectsService', 'projectsFactory', function($scope, projectsService, projectsFactory) {
	projectsFactory.get().then(function(d){
		if(d.status != 'error'){
			$scope.projects = d.data.records;
		}
	});

	// describe deleting projecrt func
	$scope.removeProject = function(projectID, index){
		projectsFactory.remove(projectID).then(function(d){
			if(d.status == 'success'){
				$scope.projects.splice(index, 1);
			}else{
				console.log(d.errors);
			}
		});
		
	}
}])

.controller('createCtrl', ['$scope', 'projectsFactory', 'commonFactory', function($scope, projectsFactory, commonFactory){
	// step: 1
	$scope.step = 1;
	commonFactory.getLangs().then(function(d){
		if(d.status == 'success'){
			$scope.langs = d.data.records;
		}
	});
	commonFactory.getSystems().then(function(d){
		if(d.status == 'success'){
			$scope.systems = d.data.records;
		}
	});
	$scope.createNewProject = function(){
		projectsFactory.put($scope.project).then(function(d){
			if(d.status == 'success'){
				$scope.step = 2;
				$scope.project.langs = [];
				$scope.project.id = d.data.id;

				//delete default lang from langs list
				var df_lang = $scope.langs.findIndex(function(temp){
					return temp.id == $scope.project.defaultLang;
				});
				$scope.langs.splice(df_lang, 1);

				projectsFactory.getPluginLaravel($scope.project).then(function(d){ $scope.laravelPluginUrl = d.data.records.url; });
			}else{
				$scope.errors = d.errors;
				$('form.ng-submitted').removeClass('ng-submitted');
			}
		});
	};

	// step 2
	$scope.integrateProject = function(){
		$('.integration-bar').fadeIn();
		projectsFactory.checkConection($scope.project).then(function(d){
			if(d.status == 'success'){
				$('.loading-procces').fadeOut();
				$scope.project.words_count = d.data.words_count;
    			$scope.project.totalSum    = d.data.pay;
    			$scope.step = 3;
			}else{
				$scope.errors = d.errors;
			}
		});
	};

	//step 3
	$scope.pay = function(){
		projectsFactory.pay($scope.project).then(function(d){
			if(d.status == 'success'){
				$scope.step = 4;
			}else{
				$scope.errors = d.errors;
			}
		});
	};

	// step 4
	$scope.addLangToProject = function(){
		//find selected lang in array
		var finder_lang = $scope.langs.findIndex(function(temp) {
		    return temp.id == $scope.newLang;
		});
		$('#new-lang-modal').modal('hide');
		//push seleceted lang to new project array
		$scope.project.langs.push({name: $scope.langs[finder_lang].name, id: $scope.newLang, translator: {id : null}, moderator: {id : null} });
		//delete selected lang from array
		$scope.langs.splice(finder_lang, 1);
	};

	// search translator or moderator
	$scope.searchPerson = function(langID){
		$scope.chooseEditLang = langID;
		$('#search-modal').modal('show');
		commonFactory.getTranslators(langID).then(function(d){
			if(d.status == 'success'){
				$scope.users = d.data.records;
			}else{
				$scope.noTranslators = true;
			}
		});
	};

	$scope.setUserToProject = function(userID, role){
		//find selected lang in array
		var finder_lang = $scope.project.langs.findIndex(function(temp) { return temp.id == $scope.chooseEditLang; });

		//find selected user in array
		var finder_user = $scope.users.find(function(temp) { return temp.id == userID; });

		//set him 
		if(role == 0){
			$scope.project.langs[finder_lang].translator = finder_user;
		}else if(role == 1){
			$scope.project.langs[finder_lang].moderator  = finder_user;
		}else{
			$scope.project.langs[finder_lang].translator = finder_user;
			$scope.project.langs[finder_lang].moderator  = finder_user;
		}
		$scope.chooseEditLang = null;
		$('#search-modal').modal('hide');
	};

	$scope.deleteLang = function(index){
		var realy = confirm("Are you realy want delete this language?");
		if(realy){ $scope.project.langs.splice(index, 1); }
	};

	$scope.saveLanguages = function() {
	    if ($scope.project.langs) {
	        for (var i = 0; i < $scope.project.langs.length; i++) {
	            projectsFactory.addLang($scope.project, $scope.project.langs[i]).then(function(d) {
	                if (d.status == 'error') {
	                    $scope.errors = d.errors;
	                } else {
	                    $scope.project.langs.splice(i, 1);
	                }
	            });
	        }
	       	//cheking and redirect
	        if ($scope.errors.length > 0) {
	            break;
	        } else {
	            $scope.step = 5;
	        }
	    } else {
	        $scope.step = 5;
	    }
	};


}])

.controller('varsCtrl', ['$scope', '$route', 'projectsFactory', function($scope, $route, projectsFactory){
	$scope.newVarName = '';
	var project = $route.current.params.project;
	// get all vars
	projectsFactory.getVars(project).then(function(d){
		if(d.status != 'error'){
			$scope.projectVars = d.data.records;
		}else{
			$scope.errors = d.errors;
		}
	});
	//load more vars
	$scope.loadMore = function(){
		var page = $scope.projectVars.length+50;
		projectsFactory.getVars(project, page).then(function(d){
			if(d.status != 'error'){
				$scope.projectVars = $.merge($scope.projectVars,d.data.records);
			}else{
				$scope.errors = d.errors;
			}
		});
	}

	// delete var
	$scope.removeProjectVar = function(projectVarID, index){
		projectsFactory.removeProjectVars(project, {0:{id:projectVarID}}).then(function(d){
			if(d.status != 'error'){
				$scope.projectVars.splice(index, 1);
			}
		});
	};
	// add new lang var
	$scope.addNewVar = function(){
		$scope.newVarDesc = $('#newVarDesc').text();
		if($scope.newVarName.length > 0){
			projectsFactory.addVar(project, $scope.newVarName, $scope.newVarDesc).then(function(d){
				if(d.status != 'error'){
					$scope.projectVars.unshift({id: d.data.records.id, name: $scope.newVarName, desciption: $scope.newVarDesc});
					$scope.newVarName = '';
					$('#newVarDesc').text('')
				}else{
					$scope.errors = d.errors;
				}
			});	
		}
	};
}])

.controller('preferenceCtrl', ['$scope', '$route', 'projectsFactory', function($scope, $route, projectsFactory){
	var project = $route.current.params.project;
	projectsFactory.single(project).then(function(d){
		if(d.status == 'success'){
			$scope.project = d.data.records;
			// search default lang
			var dfLang = $scope.project.project_langs.find(function(temp){ return temp.is_default == 1; });
			$scope.project.defaultLang = dfLang;
		}
	});

	// importCSV
	$scope.importCSV = function(){
		return false;

	};

	// import Laravel
	$scope.importLaravel = function(){

	};

	// exportCSV
	$scope.exportCSV = function(){

	};

	// export Laravel
	$scope.exportLaravel = function(){

	};
}])

.controller('translationCtrl', ['$scope', '$route', 'projectsFactory', function($scope, $route, projectsFactory){
  var lang    = $route.current.params.lang;
  var project = $route.current.params.project;

  if(lang && project){
  	projectsFactory.translation(project, lang).then(function(d){
  		if(d.status != 'error'){
  			$scope.langVars = d.data.records;
  		}else{
  			$scope.errors = d.errors;
  		}
  	});
  }else{
  	console.log('Set ids please!');
  }
  //save func
  $scope.save = function(){
  	if($scope.langVars.length > 0){
  		projectsFactory.putTranslation(lang, project, $scope.langVars).then(function(d){
  			if(d.status == 'success'){
  				$scope.success = 'Changes saved!';
  			}else{
  				$scope.errors = d.errors;
  			}
  		});
  	}else{
  		console.log('Err: No words');
  	}
  };
  // load more
  $scope.loadMoreVars = function(){
  	projectsFactory.translation(project, lang, $scope.langVars.length+50).then(function(d){
  		if(d.status != 'error'){
  			$scope.langVars = d.data.records;
  		}else{
  			$scope.errors = d.errors;
  		}
  	});  	
  };
}]);