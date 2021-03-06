'use strict';

(function() {
  var searchButton = document.querySelector('#searchSubmit');
  var allPolls = document.querySelector('#searchResults');
  var apiUrl = appUrl + '/search?searchInput=';
  var searchQuery;

  // main function for displaying search results
  function displayResults(data) {
    var results = JSON.parse(data);
    var bars = results.bars;
    var output = "<ul class='list-group'>";
    for (var i = 0; i < bars.length; i++) {
      output += "<li class='list-group-item'>";
      output += '<img src="' + bars[i].image_url + '" class="img-rounded img-business" alt="...">';
      output += "<a href='" + bars[i].url + "'>" + bars[i].name + "</a><span class='rsvpButton' id='" + bars[i].id + "'>" + bars[i].attending + " going</span><br />";
      output += bars[i].snippet_text;
      output += "</li>";
    }
    output += "</ul>";
    document.getElementById("searchResults").innerHTML = output;

  }
  // main rsvp function
  function getRsvp(data) {
    var response = JSON.parse(data);
    // if not logged in redirect to login page
    if (response.hasOwnProperty('error')) {
      window.location.href = '/login?searchInput=' + searchQuery;
      return;
    } else {
      var barId = response.barId;
      barId = "#" + barId;
      var attending = response.nbrAttending;
      $(barId).text(attending + " going");


    }
  }
  // clicking rsvp button listener
  $("#searchResults").on("click", ".rsvpButton", function() {
    var barId = $(this).attr('id');
    var rsvpUrl = appUrl + "/rsvp/" + barId;
    ajaxFunctions.ajaxRequest('POST', rsvpUrl, getRsvp);
  });

  //stay on page after form submission
  $(document).ready(function() {

    var $form = $('form');
    $form.submit(function() {

      searchQuery = $('#searchInput').val();
      apiUrl += searchQuery;
      ajaxFunctions.ajaxRequest('get', apiUrl, displayResults);

    });
  });

  //function to check for query string at home address
  $(function() {
    var search = window.location.search;

    if (search.indexOf('searchInput=') >= 0) {
      var searchUrl = appUrl + "/search" + search;
      searchQuery = search.slice(13);
      ajaxFunctions.ajaxRequest('get', searchUrl, displayResults);
    }

  });



})();