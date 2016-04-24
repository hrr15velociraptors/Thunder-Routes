angular.module('gservice', [])
    .factory('gservice', function ($http, $q, mapFactory) {

      var googleMapService = {};

      // Set-up functions
      // --------------------------------------------------------------

      // Initialize the map
      var map, directionsDisplay;
      var directionsService = new google.maps.DirectionsService();

      //Store current trip data so we can access it for saving.
      //Properties will be added to this object every time a route is calculated.
      googleMapService.thisTrip = {};

      //initialize the map if no other instructions are given
      var initialize = function () {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var SF = new google.maps.LatLng(37.7749, -122.4194);
        var mapOptions = {
          zoom: 7,
          center: SF
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        directionsDisplay.setMap(map);
      };

      // Refresh, to re-initialize the map.
      googleMapService.refresh = function () {
        initialize();
      };

      // Refresh the page upon window load.
      google.maps.event.addDomListener(window, 'load',
        googleMapService.refresh());


      // Navigation functions - Google directions service
      // --------------------------------------------------------------

      //calculate a route (promisified function)
      googleMapService.calcRoute = function (start, end, numStops) {
        var deferred = $q.defer();
        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            // grab official start and end points for later use
            var officialStart = result.routes[0].legs[0].start_address;
            var officialEnd = result.routes[0].legs[0].end_address;
            //format and send request for the same trip but with waypoints
            var stops = [];
            var waypoints = getWaypoints(result.routes[0].overview_path, numStops);
            var promise = getNearbyThings(waypoints); //testing testing
            promise.then(function (placePoints) {
              // var placePoints = placePoints.map(function (pl) {return pl[0]});
              googleMapService.render(officialStart, officialEnd, placePoints)
              .then(function () {
                deferred.resolve(googleMapService.thisTrip.waypoints);
              });
            });
          }
        });
        return deferred.promise;
      };

      //render a complete journey (promisified function)
      googleMapService.render = function (start, end, waypoints) {
        var deferred = $q.defer();
        //make route points accessable to other functions
        googleMapService.thisTrip.start = start;
        googleMapService.thisTrip.end = end;
        googleMapService.thisTrip.waypointChoices = waypoints;
        googleMapService.thisTrip.waypoints = waypoints;
        var stops = []; //format stops for Google request
        waypoints.forEach(function (w) {
          stops.push({
            location: w[0].location,
            stopover: true
          });
        });
        var wyptRequest = { //format the request for Google
          origin: start,
          destination: end,
          waypoints: stops,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(wyptRequest, function (response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            sortWaypoints(response.routes[0].waypoint_order);
            deferred.resolve(waypoints);
          }
        });
        return deferred.promise;
      };


      // Waypoint functions - Google places service
      // --------------------------------------------------------------

      // get waypoints by breaking up trip into even-ish segments
      var getWaypoints = function (waypointArray, numStops) {
        var points = [];
        var stopDistance = Math.floor(waypointArray.length / (numStops + 1));
        for (i = 0; i < numStops; i++) {
          points.push(stopDistance + (stopDistance * i));
        }
        var waypoints = [];
        points.forEach(function (index) { //retrieve lat/lng data for each wpt
          var waypoint = {
            lat: waypointArray[index].lat(),
            lng: waypointArray[index].lng()
          };
          waypoints.push(waypoint);
        });
        return waypoints;
      };

      //get a single nearby attraction for each waypoint (promisified function)
      var getNearbyThings = function (waypointArray, distance, type) {
        var deferred = $q.defer();
        var placesToStop = [];
        //build out an array of requests
        var placeRequests = [];
        waypointArray.forEach(function (w) {
          placeRequests.push({
            location: new google.maps.LatLng(w.lat, w.lng),
            radius: distance || '500',
            query: type || 'restaurant'
          });
        });
        //query the google places service each waypoint
        var doneSoFar = 0; //counter for async for loop
        for (var i = 0; i < placeRequests.length; i++) {
          var placesService = new google.maps.places.PlacesService(document.getElementById('invisible'), placeRequests[i].location);
          placesService.textSearch(placeRequests[i], function (res, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              // grab first 20 destinations
              // write algo that sorts choices top 5 choices according to desireability
              // reassign places to sorted places
              // for (var i = 0; i < 5; i++) {
              //   var dest = res[i];
              //   var place = {
              //     location: dest.formatted_address,
              //     name: dest.name,
              //     lat: dest.geometry.location.lat(),
              //     lng: dest.geometry.location.lng(),
              //     price_level: dest.price_level,
              //     rating: dest.rating,
              //     showYelp: false,
              //     yelpData: false
              //   };
              //   places.push(place);
              // }
              placesToStop.push(getTopChoices(res));
              doneSoFar++;
              if (doneSoFar === placeRequests.length) {
                deferred.resolve(placesToStop);
              }
            } else { //if Google doesn't send an OK status
              deferred.reject('we had a problem');
            }
          });
        }
        return deferred.promise;
      };

      var getTopChoices = function (choices) {
        // sort locations by rating * price_level
        // some fancy shit
        choices = choices.map(function (choice) {
          if (!choice.price_level || choice.price_level === undefined) {
            choice.des = 0;
          } if (choice.rating < 2 || choice.rating === undefined) {
            choice.des = 0;
          } else {
            choice.des = choice.rating / choice.price_level;
          }
          var dest = {location: choice.formatted_address,
            name: choice.name,
            lat: choice.geometry.location.lat(),
            lng: choice.geometry.location.lng(),
            price_level: choice.price_level,
            rating: choice.rating,
            des: choice.des,
            showYelp: false,
            yelpData: false
          };
          return dest;
        });

        choices = choices.sort(function (a, b) {
          return b.des - a.des;
        });

        return choices.slice(0, 5);
      };

      //Record order in 'position' property of each waypoint
      var sortWaypoints = function (waypointOrder) {
        for (var i = 0; i < googleMapService.thisTrip.waypoints.length; i++) {
          var waypointChoices = googleMapService.thisTrip.waypoints[i];
          for (var j = 0; j < 5; j++) {
            var position = waypointOrder[i];
            waypointChoices[j].position = position;
          }
        }
        return;
      };

      return googleMapService;
    });
