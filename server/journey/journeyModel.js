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
  waypoints: mongoose.Schema.Types.Mixed,
  hash: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId
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
