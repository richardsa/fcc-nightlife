/* require the modules needed */
var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var request = require('request');
var qs = require('querystring');
var _ = require('lodash');
var Bars = require('../models/bars.js');
var Users = require('../models/users.js');
var Rsvps = require('../models/rsvp.js');

function SearchHandler() {

  // Request API access: http://www.yelp.com/developers/getting_started/api_access
  var Yelp = require('yelp');

  var yelp = new Yelp({
    consumer_key: process.env.YELP_KEY,
    consumer_secret: process.env.YELP_SECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKEN_SECRET,
  });
  // rsvp function
  this.rsvp = function(req, res) {
    
    if (typeof req.user.github.id === "undefined") {
      res.redirect('/login');
    }
    var githubId = req.user.github.id;
    var barId = req.params.bar;
    Rsvps.findOne({
        barId: barId,
        githubId: githubId
      },
      function(err, rsvp) {
        if (err) {
          throw err;
        }
        if (rsvp) {
          rsvp.remove(function(err) {
            if (err) {
              throw err;
            }
            });
          Bars
            .findOneAndUpdate({
              barId: barId
            }, {
              $inc: {
                'nbrAttending': -1
              }
            }, {
              'new': true
            })
            .exec(function(err, doc) {
              if (err) {
                throw err;
              }
              res.json(doc);
            });

        } else {
          var newRsvp = new Rsvps({
            barId: barId,
            githubId: githubId,
          });
          newRsvp.save(function(err, docRsvp) {
            if (err) {
              throw err;
            }
            
            Bars
              .findOneAndUpdate({
                barId: barId
              }, {
                $inc: {
                  'nbrAttending': 1
                },
              }, {
                'new': true
              })
              .exec(function(err, result) {
                if (err) {
                  throw err;
                }

                if (result) {
                  res.json(result);
                } else {
                  var newDoc = new Bars({
                    barId: barId,
                    'nbrAttending': 1
                  });
                  newDoc.save(function(err, doc) {
                    if (err) {
                      throw err;
                    }
                    res.json(doc);
                  });

                }
              });

          });

        }

        // closing tags
      });


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

        function asyncLoop(i, callback) {
          if (i < bars.length) {
            var barInfo = {};
            
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
              }
              
              if (!result) {
                barInfo.attending = 0;

              } else {
                
                barInfo.attending = result.nbrAttending;
              }
              outputArr.push(barInfo);
              asyncLoop(i + 1, callback);
            });

          } else {
            callback();
          }
        }
        //recursive loop from http://stackoverflow.com/a/21830088
        asyncLoop(0, function() {
          outputObj.bars = outputArr;
          res.send(outputObj);
        });
      });

  };

}

module.exports = SearchHandler;