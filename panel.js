var wakandaPanel = angular.module("wakandaPanel",["ngRoute"]);

wakandaPanel.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'homeCtrl'
      }).
      when('/datasources', {
        templateUrl: 'partials/datasources.html',
        controller: 'datasourcesCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);

wakandaPanel.service('inspectedApp', ['$q', function ($q) {
    
    this.getInfosHome = function () {
    return $q(function(resolve, reject) {
      chrome.devtools.inspectedWindow.eval(
          "[ WAF.VERSION,WAF.BUILD, WAF.pageTheme,{currentUser : WAF.directory.currentUser() }]", resolve);
    });
    };
    
    this.getSources = function () {
    return $q(function(resolve, reject) {
      chrome.devtools.inspectedWindow.eval(
          "var sources = [] ;for(p in waf.sources){ sources.push({name : p , length : waf.sources[p].length ,attributes :      waf.sources[p].getAttributeNames()})} sources", resolve);
    });
    };
    
    this.sourceQuery = function (name,query) {
    return $q(function(resolve, reject) {
        
      var codeToEval = 'WAF.sources["'+name+'"].query("'+query+'"); waf.sources["'+name+'"].length ';
        
      chrome.devtools.inspectedWindow.eval(
          codeToEval, resolve);
    });
    };
    
    
    this.runPageWithoutWDD = function (name,query) {
    return $q(function(resolve, reject) {
        
      var codeToEval = 'if(!window.location.href.match(/debug\=1/))window.location.href = window.location.href + "?debug=1"';
        
      chrome.devtools.inspectedWindow.eval(
          codeToEval, resolve);
    });
    };
    
    



}]);

wakandaPanel.controller("homeCtrl",function($scope,inspectedApp){
    
    inspectedApp.getInfosHome().then(function (result) {
        
        $scope.isWakandaApp = result[0];
        
        $scope.VERSION = result[0];
        
        $scope.BUILD = result[1];
    
        $scope.pageTheme = result[2];
        
        $scope.user = result[3].currentUser;
        
        
      });
    
    $scope.runPageWithoutWDD = function () {
        
        inspectedApp.runPageWithoutWDD();
    
    }
    
});

wakandaPanel.controller("datasourcesCtrl",function($scope,inspectedApp){
  
    inspectedApp.getSources().then(function (sources) {
        
        $scope.sources = sources;
         
        
      });
            
    $scope.sourceQuery = function(s){
    
    
           inspectedApp.sourceQuery(s.name,s.query).then(function (length) {
               
                     s.length = length;
           });           
    
    };
    
    
});



