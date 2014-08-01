var _forEach = require('../lib/utils')._forEach;
var extend = require('../lib/utils').extend;

var View = {
	init: function(options) {
		this._initView(options);
	},
	_initView: function(options) {

		this.el = options.el;
		this.$ = this.el.querySelectorAll.bind(this.el);

		this.delegateEvents();
		this.createBindings();

		this.model = options.model || {};
		if (options.model)
			this.afterModelIsSet(this.model);
	},

	createBindings: function() {},
	afterModelIsSet: function(model) {},
	render: function() {
		if (this.template)
			this.el.appendChild(this.template(this.model));
	},

	delegateEvents: function() {
		var delegateEventSplitter = /^(\S+)\s*(.*)$/;

		_forEach(this.events, function(value, key) {
			var pair = key.match(delegateEventSplitter).slice(1);
			var event = pair[0],
				selector = pair[1];

			if (typeof value === 'function') {
				this.el.addEventListener(event, function(e) {
					if (!selector || e.target.matches(selector))
						value.call(this, e);

				}.bind(this), true);
			}
		}.bind(this));
	},
	undelegateEvents: function() {
		var delegateEventSplitter = /^(\S+)\s*(.*)$/;

		_forEach(events, function(value, key) {
			var pair = key.match(delegateEventSplitter).slice(1);
			var event = pair[0],
				selector = pair[1];

			if (typeof value === 'function') {
				this.el.removeEventListener(event);
			}
		});
	},
	teardown: function() {
		this.undelegateEvents();
	},

	extend: function(props) {
		return extend(Object.create(View), props);
	},

	trigger: function(type, detail, options) {
		this.el.dispatchEvent(new CustomEvent(type, extend({
			bubbles: true,
			cancelable: true,
			detail: detail
		}, options || {})));
	}
};

module.exports = View;