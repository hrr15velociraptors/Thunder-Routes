angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.routes', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/routes.html',
        controller: 'routesCtrl'
      }
    }
  })

  .state('tabsController.routeMapView', {
    url: '/page3',
    views: {
      'tab2': {
        templateUrl: 'templates/routeMapView.html',
        controller: 'routeMapViewCtrl'
      }
    }
  })

  .state('tabsController.aPISTUFF', {
    url: '/page4',
    views: {
      'tab3': {
        templateUrl: 'templates/aPISTUFF.html',
        controller: 'aPISTUFFCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/page1/page4')

  

});