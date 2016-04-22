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
  yelp.search({term: req.body.name, ll: ll, limit: 5})
  .then(function (data) {
    console.log(data);
    res.json(data);
  })
  .catch(function (err) {
    console.error(err);
    res.status(500).send('failed');
  });
}

