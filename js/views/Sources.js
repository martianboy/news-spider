var moment = require('moment-jalaali');
moment.loadPersian();

var LazyGen = require('lazy.generators');
var El = require('../lib/dom').createEl;

var View = require('./View');
var FeedSources = require('../collections/FeedSources');

module.exports = View.extend({
	init: function() {
		View.init.apply(this, arguments);
		FeedSources.on('fetch', this.render.bind(this));

		FeedSources.fetch();
	},

	template: function(feed) {
		return El('tr', [
			El('td.on', 
				El('button.fa', '\uf046')
			),
			El('td', feed.title),
			El('td[data-field=last_active]', moment(feed.last_active).calendar())
		]);
	},

	bindings: {
		'model.last_active': {
			type: 'text',
			transform: function(timestamp) {
				return moment(timestamp).calendar()
			},
			selector: '[data-field=last_active]'
		}
	},

	render: function() {
		while (this.el.hasChildNodes()) {
			this.el.removeChild(this.el.lastChild);
		}

		FeedSources
			.map(this.template)
			.each(this.el.appendChild.bind(this.el));
	}
});
