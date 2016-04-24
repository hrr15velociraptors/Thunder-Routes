var mongoose = require('mongoose');
var crypto = require('crypto');
var Q = require('q');

var JourneySchema = new mongoose.Schema({
  start: {
    type: String
  },
  end: {
    type: String
  },
  waypoints: {
    type: [{
      location: String,
      name: String,
      lat: Number,
      lng: Number,
      price_level: Number,
      rating: Number,
      showYelp: Boolean,
      yelpData: {}
    }]
  },
  hash: {
    type: String
  }
}, {strict: false});

var createSha = function (points) {
  var shasum = crypto.createHash('sha1');
  shasum.update(points);
  return shasum.digest('hex').slice(0, 5);
};

JourneySchema.pre('save', function(next) {
  var journey = this;
  var hash = createSha(journey.waypoints.length.toString() + journey.start + journey.end);
  journey.hash = hash;
  next();
});

module.exports = mongoose.model('Journey', JourneySchema);
