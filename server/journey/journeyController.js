var Q = require('q');
var Journey = require('./journeyModel.js');

var findJourney = Q.nbind(Journey.findOne, Journey);
var createJourney = Q.nbind(Journey.create, Journey);

module.exports = {
  saveJourney: function (req, res) {
    console.log(req.body.start);
    Journey.findOne({start: req.body.start}, function (err, doc) {
      if (err) {
        console.log(err);
        res.status(500).send('fuck')
      }
      if (!doc) {
        Journey.create(req.body);
        res.status(200).send('ok');
      } else {
        console.log(doc)
        res.status(200).send(doc);
      }
    })
    // findJourney({waypoints: waypoints})
    //   .then(function (waypoint) {
    //     if (!waypoint) {
    //       return createJourney(req.body);
    //     } else {
    //       next(new Error('Journey already exist!'));
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log('error save journey', error);
    //     next(error);
    //   });
  },

  getAll: function (req, res, next) {
    Journey.find({})
      .then(function (data) {
        res.status(200).send(data);
      })
      .catch(function(error) {
        next(error);
      });
  }
};
