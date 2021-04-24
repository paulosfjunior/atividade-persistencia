var Bluebird = require('bluebird');
var uuid = require('uuid/v1');

var cassandra = require('../services/db.service');
const { hashPasswordWithSalt, hashPassword } = require('../auth/_auth');

var servico = {}

servico.criar = criarRegistro
servico.listar = listarRegistro
servico.editar = editarRegistro
servico.deletar = deletarRegistro
servico.procurar = procurarRegistro
servico.autenticar = autenticarUsuario

module.exports = servico;

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

function tipoExiste() {
  return new Bluebird((resolve, reject) => {
    keyspaceExiste()
      .then((r) => {
        let query = 'CREATE TYPE IF NOT EXISTS atividadenosql.endereco ' + 
                    '(endereco text, bairro text, cidade text, pais text, cep text)';
    
        cassandra.execute(query, (e, r) => {
          if (e) reject(e);
          if (r) resolve(r);
        });
      })
      .catch((e) => reject(e));
  });
}

function tabelaExiste() {
  return new Bluebird((resolve, reject) => {
    tipoExiste()
      .then((r) => {
        let query = 'CREATE TABLE IF NOT EXISTS atividadenosql.usuario ' + 
                    '(id uuid, usuario text, nome text, endereco endereco, email text, cargo text, hash text, salt text, refresh_token text, PRIMARY KEY(id))';
    
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
        parametro.id = uuid();
        const { hash, salt } = hashPassword(parametro.senha);
        parametro.hash = hash;
        parametro.salt = salt;
        parametro.refresh_token = null;

        let query = 'INSERT INTO atividadenosql.usuario ' +
                    '(id, usuario, nome, endereco, email, hash, salt, cargo, refresh_token) VALUES ' +
                    '(:id, :usuario, :nome, :endereco, :email, :hash, :salt, :cargo, :refresh_token)';

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
        let query = 'SELECT * FROM atividadenosql.usuario';
    
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
        procurarRegistro(id).then(res => {
          let parametro = p;
          parametro.hash = res.hash;
          parametro.salt = res.salt;
          // parametro.refresh_token = res.refresh_token;

          let query = 'UPDATE atividadenosql.usuario SET ' +
                      'usuario = :usuario, ' + 
                      'nome = :nome, ' + 
                      'endereco = :endereco, ' + 
                      'email = :email, ' + 
                      'hash = :hash, ' + 
                      'salt = :salt, ' +
                      'cargo = :cargo, ' +
                      'refresh_token = :refresh_token ' +
                      'WHERE id = :id';
      
          cassandra.execute(query, parametro, {prepare: true}, (e, r) => {
            if (e) reject(e);
            if (r) resolve(r);
          });
        })
        .catch((e) => reject(e));
        })
  })
}

function deletarRegistro(id) {
  return new Bluebird((resolve, reject) => {
    tabelaExiste()
      .then((r) => {
        let parametro = {id: id};

        let query = 'DELETE FROM atividadenosql.usuario ' +
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

        let query = 'SELECT * FROM atividadenosql.usuario ' +
                    'WHERE id = :id';

        cassandra.execute(query, parametro, {prepare: true}, (e, r) => {
          if (e) reject(e);
          if (r) resolve(r.rows[0]);
        });
      })
      .catch((e) => reject(e));
  })
}

function autenticarUsuario(usuario) {
  return new Bluebird((resolve, reject) => {
    tabelaExiste()
      .then((r) => {
        let parametro = {usuario: usuario};

        let query = 'SELECT * FROM atividadenosql.usuario ' +
                    'WHERE usuario = :usuario ALLOW FILTERING';

        cassandra.execute(query, parametro, {prepare: true}, (e, r) => {
          if (e) reject(e);
          if (r) resolve(r.rows[0]);
        });
      })
      .catch((e) => reject(e));
  })
}
