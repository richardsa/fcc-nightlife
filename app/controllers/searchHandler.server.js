/* require the modules needed */
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');
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
this.rsvp = function(req,res){
  var barId = req.params.bar;
  res.send(barId);
}
  
  this.request_yelp = function(req,res){
    var outputArr = [];
    var outputObj = {}; 
    // var searchTerms = req.params.searchInput;
   var searchLocation = req.query.searchInput;
    console.log(searchLocation);
    yelp.search({ term: 'bars', location: searchLocation })
    .then(function (data) {
      //console.log(data);
      //var results = JSON.parse(data);
      var bars = data.businesses;
      //console.log(bars);
      
      //console.log("bar s " + bars);
      //res.send(data);
       for (var i = 0; i < bars.length; i++ ){
            var barInfo = {};
          barInfo.image_url = bars[i].image_url;
          barInfo.url = bars[i].url;
          barInfo.snippet_text = bars[i].snippet_text;
          barInfo.name = bars[i].name;
          barInfo.id = bars[i].id;
           outputArr.push(barInfo);
         
           //console.log(barInfo);
        }
     outputObj.bars = outputArr;
     
    res.send(outputObj);
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