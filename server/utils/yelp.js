var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET,
});

module.exports.getDestData = function (req, res) {
  // See http://www.yelp.com/developers/documentation/v2/search_api
  //Searching using name of stop and latitude/longitude
  var ll = req.body.lat + ',' + req.body.lng;
  yelp.search({term: req.body.name, ll: ll, limit: 1})
  .then(function (data) {
    res.json(data.businesses[0]);
  })
  .catch(function (err) {
    res.status(500).send('failed');
  });
}

