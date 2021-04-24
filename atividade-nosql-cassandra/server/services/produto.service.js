var Bluebird = require('bluebird');
var uuid = require('uuid/v1');

var cassandra = require('../services/db.service');

var servico = {}

servico.criar = criarRegistro
servico.listar = listarRegistro
servico.editar = editarRegistro
servico.deletar = deletarRegistro
servico.procurar = procurarRegistro

module.exports = servico

function keyspaceExiste() {
  return new Bluebird((resolve, reject) => {
    let query = "CREATE KEYSPACE IF NOT EXISTS atividadenosql WITH replication = " +
                "{'class': 'SimpleStrategy', 'replication_factor': '3' }";
    
    cassandra.execute(query, (e, r) => {
      if (e) reject(e);
      if (r) resolve(r);
    });
  });
}

function tabelaExiste() {
  return new Bluebird((resolve, reject) => {
    keyspaceExiste()
      .then((r) => {
        let query = 'CREATE TABLE IF NOT EXISTS atividadenosql.produto ' + 
                    '(id uuid, nome text, descricao text, preco float, PRIMARY KEY(id))';
    
        cassandra.execute(query, (e, r) => {
          if (e) reject(e);
          if (r) resolve(r);
        });
      })
      .catch((e) => reject(e));
  });
}

function criarRegistro(p) {
  return new Bluebird((resolve, reject) => {
    tabelaExiste()
      .then((r) => {
        let parametro = p;
        parametro.preco = parseFloat(p.preco);
        parametro.id = uuid();

        let query = 'INSERT INTO atividadenosql.produto ' +
                    '(id, nome, descricao, preco) VALUES ' +
                    '(:id, :nome, :descricao, :preco)';

        cassandra.execute(query, parametro, {prepare: true}, (e, r) => {
          if (e) reject(e);
          if (r) resolve(r);
        });
      })
      .catch((e) => reject(e));
  })
}

function listarRegistro() {
  return new Bluebird((resolve, reject) => {
    tabelaExiste()
      .then((r) => {
        let query = 'SELECT * FROM atividadenosql.produto';
    
        cassandra.execute(query, (e, r) => {
          if (e) reject(e);
          if (r) resolve(r.rows);
        });
      })
      .catch((e) => reject(e));
  })
}

function editarRegistro(id, p) {
  return new Bluebird((resolve, reject) => {
    tabelaExiste()
      .then((r) => {
        let parametro = p;
        parametro.preco =  parseFloat(p.preco);
        parametro.id = id;

        let query = 'UPDATE atividadenosql.produto SET ' +
                    'nome = :nome, ' + 
                    'descricao = :descricao, ' + 
                    'preco = :preco ' + 
                    'WHERE id = :id';
    
        cassandra.execute(query, parametro, {prepare: true}, (e, r) => {
          if (e) reject(e);
          if (r) resolve(r);
        });
      })
      .catch((e) => reject(e));
  })
}

function deletarRegistro(id) {
  return new Bluebird((resolve, reject) => {
    tabelaExiste()
      .then((r) => {
        let parametro = {id: id};

        let query = 'DELETE FROM atividadenosql.produto ' +
                    'WHERE id = :id';

        cassandra.execute(query, parametro, {prepare: true}, (e, r) => {
          if (e) reject(e);
          if (r) resolve(r);
        });
      })
      .catch((e) => reject(e));
  })
}

function procurarRegistro(id) {
  return new Bluebird((resolve, reject) => {
    tabelaExiste()
      .then((r) => {
        let parametro = {id: id};

        let query = 'SELECT * FROM atividadenosql.produto ' +
                    'WHERE id = :id';
;
        cassandra.execute(query, parametro, {prepare: true}, (e, r) => {
          if (e) reject(e);
          if (r) resolve(r.rows);
        });
      })
      .catch((e) => reject(e));
  })
}
