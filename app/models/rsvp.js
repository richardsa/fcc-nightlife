'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Rsvp = new Schema({
	githubId: {type: String},
	barId: {type: String}
	
	

});

module.exports = mongoose.model('Rsvp', Rsvp);
