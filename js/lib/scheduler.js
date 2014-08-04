// C/M/n/c queue:
//	- a queue with constant entry rate, n servers

// scheduler dequeues repeatedly until the serving queue is full,
// then waits until the queue has space to start again:
// while(!serving_queue_full) {
//		
// }

// Jobs return a promise

// Bulk Jobs:
//	- take n promises and wait till all of them have resolved.
//	- return a promise with results of its jobs.
//	- Caveat: Bulks are fixed.

// define circular queue object
// - enqueue
// - dequeue
// - job generator

var feed_reader = require('./feed-reader');

function update_source_timestamp(source) {
	source.last_acitve = (new Date()).valueOf();
	db.sources.put(source)
}

function *rss_jobs() {
	var sources = yield db.sources.last_active.getAll();

	yield (function *() {
		for(var i = 0; i < sources.length; i++)
			yield (function() {
				return feed_reader(sources[i].url)
					.then(function(result) {
						update_source_timestamp(sources[i]);
						log('Fetched RSS Feed from', sources[i].source);

						return result;
					});
			});
	});
}

function *job_generator() {
	while (!empty_queue) {

	}
}

function *serving_queue(n) {
	var queue = [],
		jobs = job_generator(),
		active_jobs_count = 0,
		job, i = 0;

	// initialize serving queue
	do {
		job = jobs.next();

		if (!job.done) {
			queue.push(job.value.call(null));
			active_jobs_count++;
		}
	} while(i++ < n && !job.done);

	while(queue.length) {
		yield queue.shift().then(function(result) {
			job = jobs.next();
			if (job.done)
				active_jobs_count--;
			else
				queue.push(job.value.call(null);
		});
	}
}