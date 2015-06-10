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
      when('/rpc', {
        templateUrl: 'partials/rpc.html',
        controller: 'rpcCtrl'
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
    
    
    this.runPageWithDebug = function (name,query) {
    return $q(function(resolve, reject) {
        
      var codeToEval = 'window.location.href = window.location.href + "?debug=1"';
        
      chrome.devtools.inspectedWindow.eval(
          codeToEval, resolve);
    });
    };
    
    this.runPageWithoutDebug = function (name,query) {
    return $q(function(resolve, reject) {
        
      var codeToEval = 'window.location.href = window.location.href.replace("?debug=1","")';
        
      chrome.devtools.inspectedWindow.eval(
          codeToEval, resolve);
    });
    };
    
    this.isrunPageWithDebug = function (name,query) {
    return $q(function(resolve, reject) {
        
      var codeToEval = 'window.location.href.match(/debug\=1/) != null';
        
      chrome.devtools.inspectedWindow.eval(
          codeToEval, resolve);
    });
    };
    
    this.getRpcModulesList = function () {
    return $q(function(resolve, reject) {
        
      var codeToEval = 'waf.config.loadRPC';
        
      chrome.devtools.inspectedWindow.eval(
          codeToEval, resolve);
    });
    };
    
    this.getMethodsList = function (name) {
    return $q(function(resolve, reject) {
        
        
      chrome.devtools.inspectedWindow.eval(
          name, resolve);
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
    
    inspectedApp.isrunPageWithDebug().then(function (result) {
        
        $scope.isrunPageWithDebug = result;
            
      });
    
    $scope.runPageWithoutDebug = function () {
        
        inspectedApp.runPageWithoutDebug();
        
        $scope.isrunPageWithDebug = false;
    
    };
    
    $scope.runPageWithDebug = function () {
        
        inspectedApp.runPageWithDebug();
        
        $scope.isrunPageWithDebug = true;
    
    };
    
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

wakandaPanel.controller("rpcCtrl",function($rootScope,$scope,inspectedApp){
  
    inspectedApp.getRpcModulesList().then(function (rpcs) {
        
        $scope.rpcs = [];
        
        var exp = "[";
        
        var name ;
        
        for(r in rpcs) {
            
            name = rpcs[r].match(/(\w+)$/)[0];
            $scope.rpcs.push({name : name , path : rpcs[r]});
            
            exp += "{ '" + name +"' : " + name +" },"
            
        }
        
        exp +="]";
        
        if(!$rootScope.paneCreated){
            
        chrome.devtools.panels.elements.createSidebarPane(
                 "wakanda-rpc",
                 function(sidebar) {
                        
                               sidebar.setExpression(exp);
                               $rootScope.paneCreated = true;
                 
                 }
                 );
        }
         
        
      });
      
        
});




