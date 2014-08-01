var db = require('../config/db');
var spawn = require('../lib/spawn');
var extend = require('../lib/utils').extend;

var FeedSource = require('../models/FeedSource');

var BBEvents = require('backbone-events-standalone');
var LazyGen = require('lazy.generators');

module.exports = extend({
	fetch: function() {
		return spawn(function *() {
			yield db.open();
			var feeds = yield db.sources.getAll();

			this.models = LazyGen(feeds)
				.map(function(feed) {
					return new FeedSource(feed);
				});

			this.trigger('fetch', this.models);
		}.bind(this));
	},

	get: function(id) {
		return this.models.findWhere({id: id});
	},

	map: function(fn, context) {
		return this.models.map(fn, context || this);
	},

	each: function(fn, context) {
		return this.models.each(fn, context || this);
	}
}, BBEvents);
