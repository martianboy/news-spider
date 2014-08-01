var IDB = require('../lib/indexedDB');

module.exports = new IDB('news-spider', 2, {
	sources: {
		key: { keyPath: 'id' },
		indexes: {
			url: { unique: true },
			source: { unique: false },
			last_active: { unique: false }
		}
	},
	documents: {
		key: { keyPath: 'id', autoIncrement: true },
		indexes: {
			source: { unique: false },
			pubDate: { unique: false },
			topic: { unique: false }
		}
	}
});

// item = {
// 	title: '',
// 	link: '',
// 	pubDate: '',
// 	topic: '',
// 	source: '',
// 	author: '',
// 	modDate: '',
// 	documentSource: ''
// };