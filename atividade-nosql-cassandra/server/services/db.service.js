const cassandra = require('cassandra-driver');

const cliente = new cassandra.Client({
	contactPoints: ['127.0.0.1'],
	localDataCenter: 'datacenter1'
});

cliente.connect()
	.then(() => {
		console.log('Acesso ao Cassandra.')
	})
	.catch((e) => {
		console.error('Ocorreu um erro', e);
		return cliente.shutdown();
	});

module.exports = cliente
