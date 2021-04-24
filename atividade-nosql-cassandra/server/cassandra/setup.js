const cassandra = require('../cassandra');

async function createKeyspace() {
	try {
		await cassandra.execute(`CREATE KEYSPACE querino WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 3}`);
		return 'Keyspace criado com sucesso';
	} catch (err) {
		console.log(err);
	}
}

async function createUsuarios() {
	try {
		await cassandra.execute(`CREATE COLUMNFAMILY usuarios (id timeuuid, nome text, endereco text, email text, hash text, salt text, token text)`);
		return 'Usuarios criado com sucesso';
	} catch (err) {
		console.log(err);
	}
}


async function createProdutos() {
	try {
		await cassandra.execute(`CREATE COLUMNFAMILY produtos (id timeuuid, nome text, descricao text, preco float)`);
		return 'Produtos criado com sucesso';
	} catch (err) {
		console.log(err);
	}	
}

async function createPedidos() {
	try {
		await cassandra.execute(`CREATE TYPE querino.itemCarrinho(
			produto text,
			quantia int
		)`);

		await cassandra.execute(`CREATE COLUMNFAMILY produtos (id timeuuid, carrinho List<itemCarrinho>, cliente timeuuid, dataPedido date, valor float, formaPagamento text)`);
		return 'Produtos criado com sucesso';
	} catch (err) {
		console.log(err);
	}	
}