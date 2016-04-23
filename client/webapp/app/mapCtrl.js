angular.module('roadtrippin.maps', ['gservice'])
  .controller('mapController', function($scope, mapFactory, gservice, $location, $anchorScroll, $http) {
    $scope.route = {};
    $scope.route.stopOptions = [1, 2, 3, 4, 5];
    $scope.places = [];
    $scope.savedRoutes = [];

    var startAutoComplete = new google.maps.places.Autocomplete(
      document.getElementById('start'), {
      types: ['geocode']
    });

    startAutoComplete.addListener('place_changed', function() {
      $scope.route.start = startAutoComplete.getPlace().formatted_address;
        var place = startAutoComplete.getPlace();
    });

    var endAutoComplete = new google.maps.places.Autocomplete(
      document.getElementById('end'), {
      types: ['geocode']
    });

    endAutoComplete.addListener('place_changed', function() {
      $scope.route.end = endAutoComplete.getPlace().formatted_address;
      $(this).val('') ;
    });

    //this is a call to our Google maps API factory for directions
    $scope.getRoute = function() {
      gservice.calcRoute($scope.route.start, $scope.route.end, $scope.route.numStops)
        .then(function(places) {
          //first 5 choices at every wp
          $scope.allPlaces = places;
          splitLocations(places);
        });
        $scope.startInput = '';
        $scope.endInput = '';
    };

    var splitLocations = function (places) {
      $scope.places = [];
      //copy the places array before we start splitting things so our original stays in-tact
      var placesCopy = [];
      for (var i = 0; i < places.length; i++) {
        //this apparently is needed for a clean copy...
        placesCopy.push(JSON.parse(JSON.stringify(places[i])));
      }
      placesCopy.sort(function (a, b) {
        a[0].position > b[0].position ? 1 : -1;
      });

      placesCopy.forEach(function (nearPlaces) { //split address for easier formatting
        //first choice
        place = nearPlaces[0];
        place.location = place.location.split(', ');
        $scope.places.push(place);
      });
    };

    $scope.getLetter = function (i) {
      return String.fromCharCode(i + 66);
    };

    $scope.saveRoute = function () {
      mapFactory.saveJourneyWithWaypoints(gservice.thisTrip).then($scope.getAll());
    };

    $scope.getAll = function () {
      mapFactory.getAllRoutes().then(function (results) {
        $scope.savedRoutes = results;
      });
    };

    $scope.viewSavedRoute = function (hash) {
      $location.hash('top');
      $anchorScroll();
      for (var i = 0; i < $scope.savedRoutes.length; i++) {
        if ($scope.savedRoutes[i].hash === hash) {
          //split up waypoints array into names ans locations. Even index ==== name, odd index === location
          $scope.savedRoutes[i].stopLocations = [];
          $scope.savedRoutes[i].stopNames = [];
          for (var j = 0; j < $scope.savedRoutes[i].wayPoints.length; j++) {
            if (j % 2 === 0) {
              $scope.savedRoutes[i].stopNames.push($scope.savedRoutes[i].wayPoints[j]);
            } else {
              $scope.savedRoutes[i].stopLocations.push($scope.savedRoutes[i].wayPoints[j]);
            }
          }
          //set $scope.places to saved stop data so stop data will display on page
          var places = [];
          for (var k = 0; k < $scope.savedRoutes[i].stopNames.length; k++) {
            var location = $scope.savedRoutes[i].stopLocations[k];
            var place = {
              name: $scope.savedRoutes[i].stopNames[k],
              location: location,
              position: k
            };
            places.push(place);
          }
          //add stop locations to stops array, render stops to map
          gservice.render($scope.savedRoutes[i].startPoint, $scope.savedRoutes[i].endPoint, places)
          .then(function (places) { splitLocations(places); });
        }
      }
    };

    $scope.getAll();

    $scope.getYelp = function (place) {
      $http({
        method: 'POST',
        url: '/api/yelp',
        data: place,
        dataType: "json"
      }).then(function (res) {
        console.log(res.data);
        $scope.places[place.position].yelpData = res.data;
      });
    };

    $scope.signout = function () {
      mapFactory.signout();
    };
  });
