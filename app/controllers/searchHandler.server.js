/* require the modules needed */
var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var request = require('request');
var qs = require('querystring');
var _ = require('lodash');
var Bars = require('../models/bars.js');

function SearchHandler() {

  // Request API access: http://www.yelp.com/developers/getting_started/api_access
  var Yelp = require('yelp');

  var yelp = new Yelp({
    consumer_key: process.env.YELP_KEY,
    consumer_secret: process.env.YELP_SECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKEN_SECRET,
  });

  // See http://www.yelp.com/developers/documentation/v2/search_api
  /*yelp.search({ term: 'food', location: 'Montreal' })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) {
    console.error(err);
  });*/
 this.rsvp = function (req, res) {
    var barId = req.params.bar;
    Bars
        .findOneAndUpdate({barId: barId}, { $inc: { 'nbrAttending': 1 } })
        .exec(function (err, result) {
                if (err) { throw err; }

                if (result) {
                    res.json(result);
                } else {
                    var newDoc = new Bars({barId: barId, 'nbrAttending': 1 });
                    newDoc.save(function (err, doc) {
                        if (err) { throw err; }

                        res.json(doc);
                    });

                }
            }
        );
};

  this.request_yelp = function(req, res) {
    var outputArr = [];
    var outputObj = {};
    var searchLocation = req.query.searchInput;
    yelp.search({
        term: 'bars',
        location: searchLocation
      })
      .then(function(data) {
        var bars = data.businesses;
        function asyncLoop( i, callback ) {
            if( i < bars.length ) {
              var barInfo = {};
              console.log(i);
              barInfo.image_url = bars[i].image_url;
              barInfo.url = bars[i].url;
              barInfo.snippet_text = bars[i].snippet_text;
              barInfo.name = bars[i].name;
              barInfo.id = bars[i].id;
              Bars.findOne({
                barId: barInfo.id
              }, function(err, result) {
                if (err) {
                  throw err;
                } console.log('huh');
                if (!result) {
                  barInfo.attending = 0;
                  
                } else {
                  console.log("if attending " + result);
                  barInfo.attending = result.nbrAttending;
                }
                outputArr.push(barInfo);
            asyncLoop( i+1, callback ); 
              });
               
            } else {
                callback();
            }
        }
        //recursive loop from http://stackoverflow.com/a/21830088
        asyncLoop( 0, function() {
          outputObj.bars = outputArr;
          console.log(outputObj);
          res.send(outputObj);
            // put the code that should happen after the loop here
        });
      });

  };
  /*
  // See http://www.yelp.com/developers/documentation/v2/business
  yelp.business('yelp-san-francisco')
    .then(console.log)
    .catch(console.error);

  yelp.phoneSearch({ phone: '+15555555555' })
    .then(console.log)
    .catch(console.error);

  // A callback based API is also available:
  yelp.business('yelp-san-francisco', function(err, data) {
    if (err) return console.log(error);
    console.log(data);
  });*/
}

module.exports = SearchHandler;