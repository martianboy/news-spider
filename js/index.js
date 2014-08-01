var xhr      = require('promisified-xhr');
var spawn    = require('./lib/spawn');
var db       = require('./config/db');
var AppView  = require('./views/App');

var registry;

chrome.runtime.getBackgroundPage(function(bg) {
	registry = window.registry = bg.registry || (bg.registry = {});
	registry.db = db;

	main();
});

function readConfig() {
	function *refreshSourcesIndex() {
		var feeds = yield xhr.getJSON('js/config/feeds-index.json');
		yield db.open();

		db.sources.add(feeds).then(console.log('Add records added!'));
	}

	function *loadSources() {
		yield db.open();
		registry.feed_sources = yield db.sources.getAll();
	}
	// spawn(refreshSourcesIndex);
	return spawn(loadSources);
}

function initUi() {
	try {
		AppView.init({el: document.body});
	}
	catch(ex) {
		console.error(ex);
	}
}

function main() {
	readConfig().then(initUi);
}
