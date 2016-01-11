'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SettingSchema = new Schema({
  item: String,
  info: String
});

module.exports = mongoose.model('Setting', SettingSchema);