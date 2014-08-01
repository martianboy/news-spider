module.exports.$ = document.querySelectorAll.bind(document);
module.exports.$$ = document.querySelector.bind(document);

var forEach = Array.prototype.forEach;

module.exports.createEl = function(tag, content) {
	var groups = tag.match(/(^\w+|\.[\w\-]+|#[\w\-]+|\[[\w\-\=]+\])/g);
	var el = document.createElement(groups[0]);

	groups.slice(1).forEach(function(attr) {
		if (attr.startsWith('.'))
			el.classList.add(attr.slice(1));
		else if (attr.startsWith('#'))
			el.id = attr.slice(1);
		else if (attr.startsWith('[') && attr.endsWith(']'))
			el.setAttribute.apply(el, attr.slice(1, attr.length - 1).split('='));
	});

	if (content) {
		if (typeof content == 'string')
			el.textContent = content;
		else if (typeof content == 'function')
			el.appendChild(content.call(null));
		else if (content instanceof HTMLElement)
			el.appendChild(content);
		else if (content && content.hasOwnProperty('length'))
			forEach.call(content, function(child) {
				el.appendChild(child);
			});
	}

	return el;
}
