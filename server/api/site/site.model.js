'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SiteSchema = new Schema({
  sitename: String,
  siteimg: String,
  version:String,
  info: String,
  sitetype: String,
  timeCreated: { type: Date, default: Date.now },
  isActive: String
});

  SiteSchema.plugin(require('../../lib/plugins/pagedFind'));
  SiteSchema.index({ sitename: 1 }, { unique: true });
  SiteSchema.index({ timeCreated: 1 });


module.exports = mongoose.model('Site', SiteSchema);