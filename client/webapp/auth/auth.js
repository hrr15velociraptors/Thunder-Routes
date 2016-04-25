angular.module('roadtrippin.auth', [])

.controller('authController', function($scope, $window, $state, authFactory) {
  $scope.user = {};
  $scope.loginError = false;
  $scope.errorMessage = '';

  $scope.signin = function(valid) {
    if (valid) {
      authFactory.signin($scope.user)
        .then(function (token) {
          if (token && typeof token !== 'object') {
            $scope.loginError = false;
            $window.localStorage.setItem('com.roadtrippin', token);
            // $location.path('/');
            $state.transitionTo('homepage')
          } else if (typeof token === 'object') {
            $scope.loginError = true;
            $scope.errorMessage = token.error;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  $scope.signup = function(valid) {
    if (valid) {
      authFactory.signup($scope.user)
        .then(function (token) {
          if (token && typeof token !== 'object') {
            $scope.loginError = false;
            $window.localStorage.setItem('com.roadtrippin', token);
            // $location.path('/');
            $state.transitionTo('homepage')
          } else if (typeof token === 'object') {
            $scope.loginError = true;
            $scope.errorMessage = token.error;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };
});
