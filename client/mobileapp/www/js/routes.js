angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $urlRouterProvider.otherwise('/page6');
  $stateProvider

  .state('addRoute', {
    url: '/page2',
    templateUrl: 'templates/addRoute.html',
    controller: 'mapCtrl'
  })

  .state('map', {
    url: '/page3',
    templateUrl: 'templates/map.html',
    controller: 'mapCtrl'
  })

  .state('allRoutes', {
    url: '/page4',
    templateUrl: 'templates/allRoutes.html',
    controller: 'mapCtrl'
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('signup', {
    url: '/page5',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('login', {
    url: '/page6',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  });

$urlRouterProvider.otherwise('/page3');

});
