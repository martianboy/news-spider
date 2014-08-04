var xhr = require('promisified-xhr');
var convertRss1 = require('./rss1');
var convertRss2 = require('./rss2');
var convertAtom = require('./atom');

module.exports = function(url) {
	return xhr({
		url: 'http://farsnews.com/rss.php',
		dataType: 'xml'
	}).then(convertFeed, errorHandler);
}

function convertFeed(dom) {
	var document = dom.documentElement;

	if (document.nodeName === 'rss') {
		if (document.getAttribute('version') === '2.0')
			return convertRss2(dom);
		else
			return convertRss1(dom);
	}
	else if (dom.documentElement.nodeName === 'feed')
		return convertAtom(dom);
}

function errorHandler(ex) {
	console.error(ex);
	throw ex;
}
