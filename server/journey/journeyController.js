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
        Journey.create(req.body);
        res.status(200).send('ok');
      } else {
        res.status(200).send(doc);
      }
    });
  },

  getAll: function (req, res, next) {
    Journey.find({})
      .then(function (data) {
        console.log(req.user)
        res.status(200).send(data);
      })
      .catch(function(error) {
        next(error);
      });
  }
};
