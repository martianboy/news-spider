var AmpersandModel = require('ampersand-model');

module.exports = AmpersandModel.extend({
	props: {
		url: 'string',
		top: 'string',
		title: 'string',
		source: 'string',
		last_active: 'number'
	},
	derived: {
		last_active_time: {
			deps: ['last_active'],
			fn: function() {
				return new Date(this.last_active)
			}
		}
	},

	save: function(attributes, options) {
		window.registry.db.sources.put(this.attributes);
	}
});
