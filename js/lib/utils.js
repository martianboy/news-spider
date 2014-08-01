var slice = Array.prototype.slice;

module.exports.extend = function _extend(obj) {
	slice.call(arguments, 1).forEach(function(source) {
		if (source) {
			for (var prop in source) {
				obj[prop] = source[prop];
			}
		}
	});
	return obj;
}

module.exports._forEach = function _forEach(obj, fn) {
	if (!obj) return;

	Object.keys(obj).forEach(function(key) {
		return fn(obj[key], key, obj);
	});
}
