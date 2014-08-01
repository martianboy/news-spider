chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('main.html',
		{id: 'news-crawler', bounds: {width: 800, height: 550}, frame: 'none'});
});
