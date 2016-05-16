'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
      barId: String,
      nbrAttending: Number
});

module.exports = mongoose.model('Bar', Bar);