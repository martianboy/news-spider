var spawn = require('./spawn');

var slice = Array.prototype.slice;
var splice = Array.prototype.splice;
var _forEach = require('./utils')._forEach;
var _extend = require('./utils').extend;

function IDB(name, version, schema) {
	function createStores(schema, name) {
		this[name] = new IDBStore(name, schema, this);
	}

	this.name = name;
	this.version = version;
	this.schema = schema;

	_forEach(schema, createStores.bind(this));
}

IDB.prototype.open = function() {
	function promiseFn(resolve, reject) {
		if (this._internalDb) {
			resolve(this);
			return;
		}

		var request = indexedDB.open(this.name, this.version);

		request.onsuccess = function(e) {
			this._internalDb = request.result;
			resolve(this);
		}.bind(this);

		request.onerror = function(ex) { reject(ex); };

		request.onupgradeneeded = function (e) {
			function createObjectStore(storeSchema, storeName) {
				function createIndex(options, name) {
					if (!store.indexNames.contains(name))
						store.createIndex(name, name, options);
				}

				var store;
				if (db.objectStoreNames.contains(storeName))
					store = e.currentTarget.transaction.objectStore(storeName);
				else
					store = db.createObjectStore(storeName, storeSchema.key);

				_forEach(storeSchema.indexes, createIndex);
			}

			var db = e.target.result;

			_forEach(this.schema, createObjectStore);

			// var sourcesStore = db.createObjectStore("sources", { autoIncrement : true });
			// sourcesStore.createIndex('url', 'url', {unique: true});
			// sourcesStore.createIndex('source', 'source', {unique: false});
		}.bind(this);
	}

	return new Promise(promiseFn.bind(this));
};
IDB.prototype.close = function() {
	if (this._internalDb) {
		this._internalDb.close();
		this._internalDb = null;
	}
};

IDB.prototype.transaction = function(storeNames, mode, operationsFn) {
	var promiseFn = function(resolve, reject) {
		var trx = this._internalDb.transaction(storeNames, mode);
		var result;

		trx.oncomplete = function(e) { 
			if (result && typeof result.then === 'function')
				result.then(resolve);
			else
				resolve(result);
		};
		trx.onerror = function(ex) { reject(ex); };

		try {
			result = operationsFn(trx)
		}
		catch(ex) {
			reject(ex);
		}
	}
	return new Promise(promiseFn.bind(this));
}

function IDBCursor(host) {
	this._host = host;
}
IDBCursor.prototype.getAll = function() {
	return new Promise(function(resolve, reject) {
		var values = [];
		this._host.openCursor().onsuccess = function(e) {
			var cursor = e.target.result;
			if (cursor) {
				values.push(cursor.value);
				cursor.continue();
			}
			else {
				resolve(values);
			}
		};
	}.bind(this));
};

function IDBStore(name, schema, db) {
	_extend(this, { name: name, db: db }, schema);

	function createIndex(options, index) {
		this[index] = new IDBIndexWrapper(index, name, options);
	}
	_forEach(schema.indexes, createIndex.bind(this));
}

IDBStore.prototype.add = function() {
	var objects = slice.call(arguments, 0);

	return this.db.transaction([this.name], 'readwrite', function(trx) {
		var store = trx.objectStore(this.name);

		addArray(objects);

		function addArray(array) {
			array.forEach(function(obj) {
				if (Array.isArray(obj))
					addArray(obj);
				else
					store.add(obj);
			});
		}
	}.bind(this));
}
IDBStore.prototype.put = function() {
	var objects = slice.call(arguments, 0);

	return this.db.transaction([this.name], 'readwrite', function(trx) {
		var store = trx.objectStore(this.name);

		addArray(objects);

		function addArray(array) {
			array.forEach(function(obj) {
				var key;
				if (store.keyPath)
					key = obj[key];

				if (Array.isArray(obj))
					addArray(obj);
				else
					store.put(obj, key);
			});
		}
	});
}

IDBStore.prototype.getAll = function() {
	return this.db.transaction([this.name], 'readonly', function(trx) {
		var store = trx.objectStore(this.name);
		var cursor = new IDBCursor(store);

		return cursor.getAll();
	}.bind(this));
}


function IDBIndexWrapper(name, objectStore, options) {
	this.name = name;
	this.objectStore = objectStore;

	this.unique = options.unique || false;
	this.multiEntry = options.multiEntry || false;
}

IDBIndexWrapper.prototype.getAll = function() {
	return this.db.transaction([this.name], 'readonly', function(trx) {
		var index = trx.objectStore(this.objectStore).index(this.name);
		var cursor = new IDBCursor(index);

		return cursor.getAll();
	}.bind(this));
}


module.exports = IDB;
