// var moment = require('moment');
var forEach = Array.prototype.forEach;
var map = Array.prototype.map;

function convertMetadata(nodes, valueFn) {
	var metadata = {};
	forEach.call(nodes, function(node) {
		valueFn(node, metadata);
	});

	return metadata;
}

module.exports = function convertRss2(dom) {
	var document = dom.documentElement;
	var channel  = document.querySelector('channel');

	var items = map.call(channel.querySelectorAll('item'), convertItem);

	var feed_metadata = convertMetadata(
		document.querySelectorAll('channel > :not(item)'),
		function valueFn(node, metadata) {
			switch(node.nodeName) {
			case 'image':
				metadata['image'] = convertMetadata(node.children, valueFn);
				break;
			case 'lastBuildDate':
				metadata['lastBuildDate'] = new Date(node.textContent);
				break;
			default:
				metadata[node.nodeName] = node.textContent;
			}
		}
	);

	return {
		metadata: feed_metadata,
		items: items
	};
}

function dateValue(node) {
	// return moment(node.textContent).valueOf();
	return node.textContent;
}

function convertItem(item) {
	var item_metadata = convertMetadata(
		item.children,
		function(node, metadata) {
			switch(node.name) {
			case 'dc:date':
			case 'pubDate':
				metadata['timestamp'] = dateValue(node);
				break;
			default:
				metadata[node.nodeName] = node.textContent;
			}
		}
	);

	return item_metadata;
}
