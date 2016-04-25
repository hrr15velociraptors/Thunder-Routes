var Q = require('q');
var Journey = require('./journeyModel.js');

var findJourney = Q.nbind(Journey.findOne, Journey);
var createJourney = Q.nbind(Journey.create, Journey);

module.exports = {
  saveJourney: function (req, res) {
    var journey = req.body;
    journey.user = req.user;
    Journey.findOne({
        $and: [{start: journey.start},
               {end: journey.end}
              ]},
    function (err, doc) {
      if (err) {
        res.status(500).send('notok')
      }
      if (!doc) {
        new Journey(journey).save(function(err, doc) {
          if (err) {
            res.status(500).send(err);
          }
          res.status(200).send(doc);
        });
      } else {
        res.status(200).send(doc);
      }
    });
  },

  getAll: function (req, res, next) {
    Journey.find({_id: {
      $in: req.user.journeys
    }})
      .then(function (data) {
        res.status(200).send(data);
      })
      .catch(function(error) {
        next(error);
      });
  }
};
