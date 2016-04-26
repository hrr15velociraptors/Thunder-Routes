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
    controller: 'authController'
  })

  .state('login', {
    url: '/page6',
    templateUrl: 'templates/login.html',
    controller: 'authController'
  });

$httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.roadtrippin');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, authFactory, $state) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
    if (toState && toState.authenticate && !authFactory.isAuth()) {
      $location.url('/signin');
    } else if (toState && toState.authenticate && authFactory.isAuth()) {
      $location.url('/homepage');
    }
  });
});
