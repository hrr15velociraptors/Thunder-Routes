angular.module('roadtrippin.maps', ['gservice'])
  .controller('mapController', function($scope, mapFactory, gservice, $location, $anchorScroll, $http) {
    $scope.route = {
      start: '',
      end: ''
    };
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
      placesCopy = placesCopy.sort(function (a, b) {
        return a[0].position - b[0].position;
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

    $scope.viewSavedRoute = function (route) {
      $location.hash('top');
      $anchorScroll();
      gservice.render(route.start, route.end, route.waypointChoices)
      .then(function (places) { splitLocations(places); });
    };

    $scope.getAll();

    $scope.getYelp = function (place, $index) {
      if (!$scope.places[$index].yelpData) {
        $http({
          method: 'POST',
          url: '/api/yelp',
          data: place,
          dataType: "json"
        }).then(function (res) {
          $scope.places[$index].yelpData = res.data;
        });
      }
    };

    $scope.signout = function () {
      mapFactory.signout();
    };
  });
