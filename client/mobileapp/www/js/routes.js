angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
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
  })

$urlRouterProvider.otherwise('/page3')



});
