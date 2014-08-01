var sourcesView = require('./Sources');
var View = require('./View');

var $ = require('../lib/dom').$;
var $$ = require('../lib/dom').$$;

var extend = require('../lib/utils').extend;

module.exports = View.extend({
	events: {
		'change input[name=main-app-view]': function(e) {
			$$('.container.active').classList.remove('active');
			$$('#' + e.target.value).classList.add('active');
		}
	},
	init: function() {
		View.init.apply(this, arguments);

		sourcesView.init({
			el: $$('#feed-sources table tbody')
		});
	}
});
