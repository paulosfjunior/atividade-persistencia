const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ 
	contactPoints: ['127.0.0.1:9042'],
	localDataCenter: 'datacenter1'
});

client.connect(async err => {
	err
		? console.log(err)
		: console.log('Connected to Cassandra.')
});

module.exports = client;