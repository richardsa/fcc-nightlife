'use strict';

(function() {
    var searchButton = document.querySelector('#searchSubmit');
    //var searchResults = document.querySelector('#searchResults');
    var allPolls = document.querySelector('#searchResults');
    var apiUrl = appUrl + '/search?searchInput=';

    function displayResults(data) {
        
        var results = JSON.parse(data);
        var bars = results.bars;
        console.log(results);
        results += "yeah buddy";
        var output = "<ul class='list-group'>";
        for (var i = 0; i < bars.length; i++ ){
            output += "<li class='list-group-item'>";
            output += '<img src="' + bars[i].image_url + '" class="img-rounded img-business" alt="...">'
           output += "<a href='" + bars[i].url + "'>" + bars[i].name + "</a><span class='rsvpButton' id='" + bars[i].id + "'>" +  bars[i].attending + " going</span><br />"
           output += bars[i].snippet_text
           output += "</li>"
           //console.log(bars[i].name)
        }
        output += "</ul>";
        //console.log(output);
        document.getElementById("searchResults").innerHTML = output

    }
    
   
$( "#searchResults" ).on( "click", ".rsvpButton", function() {
   var barId = $(this).attr('id');
  var rsvpUrl = appUrl + "/rsvp/" + barId;
  console.log(rsvpUrl);
 //  ajaxFunctions.ajaxRequest('get', rsvpUrl);
 //  ajaxFunctions.ajaxRequest('get', apiUrl, displayResults);
  ajaxFunctions.ajaxRequest('POST', rsvpUrl, function () {
        ajaxFunctions.ajaxRequest('GET', apiUrl, displayResults);
      });

  
});

//ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, displayResults));

    searchButton.addEventListener('click', function() {
        var location = $('#searchInput').val();
        apiUrl += location;
        console.log(apiUrl)
        ajaxFunctions.ajaxRequest('get', apiUrl, displayResults);

    }, false);



})();