/*var port = chrome.extension.connect({
        name: "Sample Communication" //Given a Name
    });
chrome.devtools.inspectedWindow.eval(
          "WAF.VERSION",
           function(result, isException) {
             if (isException)
               document.getElementById("runningInfo").innerHTML = "this application is not a wakanda app ";
             else{
               document.getElementById("runningInfo").innerHTML = "this application is running on Wakanda  " +result;
               var message = {};
               message.action = "code";
               message.content = "console.log($$('dataGrid1'))";
               message.tabId = chrome.devtools.inspectedWindow.tabId;
               chrome.extension.sendMessage(message);
               port.onMessage.addListener(function (message) {
               debugger;
               console.log(message);
      
                });
               
             }
           }
      );*/



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

    this.getAppStatus = function () {
    return $q(function(resolve, reject) {
      chrome.devtools.inspectedWindow.eval(
          "WAF.VERSION", resolve);
    });
    };
    this.getWakandaVersion = function () {
    return $q(function(resolve, reject) {
      chrome.devtools.inspectedWindow.eval(
          "WAF.VERSION", resolve);
    });
    };
    
    this.getWakandaBuild = function () {
    return $q(function(resolve, reject) {
      chrome.devtools.inspectedWindow.eval(
          "WAF.BUILD", resolve);
    });
    };
    
    this.getCurrentUser = function () {
    return $q(function(resolve, reject) {
      chrome.devtools.inspectedWindow.eval(
          "WAF.directory.currentUser()", resolve);
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
    



}]);

wakandaPanel.controller("homeCtrl",function($scope,inspectedApp){
    
    inspectedApp.getAppStatus().then(function (status) {
        $scope.isWakandaApp = status;
      });
    inspectedApp.getWakandaVersion().then(function (version) {
        $scope.VERSION = version;
      });
    inspectedApp.getWakandaBuild().then(function (build) {
        $scope.BUILD = build;
      });
    inspectedApp.getCurrentUser().then(function (user) {
        $scope.user = user;
      });
    inspectedApp.getSources().then(function (sources) {
        $scope.sources = sources;
      });
});

wakandaPanel.controller("datasourcesCtrl",function($scope,inspectedApp){
  
    inspectedApp.getSources().then(function (sources) {
        
        $scope.sources = sources;
        
        for(var i=0 ; i < $scope.sources.length ; i++) {
        $scope.sources[i].query = "";
      
        };
        
        
        
      });
            
    $scope.sourceQuery = function(s){
    
    
           inspectedApp.sourceQuery(s.name,s.query).then(function (length) {
               
                     s.length = length;
           });
    
    };
    
    
});



