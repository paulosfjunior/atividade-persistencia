var Bluebird = require('bluebird');
var uuid = require('uuid/v1');

var cassandra = require('./db.service');

var servico = {}

servico.criar = criarRegistro
servico.listar = listarRegistro
servico.listarMeus = listarMeusRegistros
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

function tipoItemExiste() {
  return new Bluebird((resolve, reject) => {
    keyspaceExiste()
      .then((r) => {
        let query = 'CREATE TYPE IF NOT EXISTS atividadenosql.itemCarrinho ' + 
                    '(id uuid, produto text, valor_unitario float, quantidade float, valor_total float)';
    
        cassandra.execute(query, (e, r) => {
          if (e) reject(e);
          if (r) resolve(r);
        });
      })
      .catch((e) => reject(e));
  });
}

function tipoClienteExiste() {
  return new Bluebird((resolve, reject) => {
    keyspaceExiste()
      .then((r) => {
        let query = 'CREATE TYPE IF NOT EXISTS atividadenosql.clientePedido ' + 
                    '(id uuid, nome text)';
    
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
    tipoItemExiste()
      .then((r) => {
        tipoClienteExiste()
          .then((r) => {
            let query = 'CREATE TABLE IF NOT EXISTS atividadenosql.pedido ' + 
                        '(id uuid, cliente frozen<clientePedido>, data_pedido date, carrinho list<frozen<itemCarrinho>>, valor_pedido float, forma_pagamento text, status text, PRIMARY KEY(id))';
    
            cassandra.execute(query, (e, r) => {
              if (e) reject(e);
              if (r) resolve(r);
            });

          })
          .catch((e) => reject(e));
      })
      .catch((e) => reject(e));
  });
}

function criarRegistro(p) {
  return new Bluebird((resolve, reject) => {
    tabelaExiste()
      .then((r) => {
        let parametro = p;
        parametro.valor_pedido = parseFloat(p.valor_pedido);
        parametro.id = uuid();

        for (let x = 0, t = p.carrinho.length; x < t; x++) {
          parametro.carrinho[x].valor_unitario = parseFloat(p.carrinho[x].valor_unitario);
          parametro.carrinho[x].quantidade = parseFloat(p.carrinho[x].quantidade);
          parametro.carrinho[x].valor_total = parseFloat(p.carrinho[x].valor_total);
        }

        let query = 'INSERT INTO atividadenosql.pedido ' +
                    '(id, cliente, data_pedido, carrinho, valor_pedido, forma_pagamento, status) VALUES ' +
                    '(:id, :cliente, :data_pedido, :carrinho, :valor_pedido, :forma_pagamento, :status)';

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
        let query = 'SELECT * FROM atividadenosql.pedido';
    
        cassandra.execute(query, (e, r) => {
          if (e) reject(e);
          if (r) resolve(r.rows);
        });
      })
      .catch((e) => reject(e));
  })
}

function listarMeusRegistros(id) {
  return new Bluebird((resolve, reject) => {
    tabelaExiste()
      .then((r) => {
        let parametro = {
          id: id
        }

        let query = 'SELECT * FROM atividadenosql.pedido WHERE cliente.id = :id ALLOW FILTERING';
    
        cassandra.execute(query, parametro, {prepare: true}, (e, r) => {
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
        parametro.valor_pedido = parseFloat(p.valor_pedido);
        parametro.id = id;

        for (let x = 0, t = p.carrinho.length; x < t; x++) {
          parametro.carrinho[x].valor_unitario = parseFloat(p.carrinho[x].valor_unitario);
          parametro.carrinho[x].quantidade = parseFloat(p.carrinho[x].quantidade);
          parametro.carrinho[x].valor_total = parseFloat(p.carrinho[x].valor_total);
        }

        let query = 'UPDATE atividadenosql.pedido SET ' +
                    'cliente = :cliente, ' + 
                    'data_pedido = :data_pedido, ' + 
                    'carrinho = :carrinho, ' + 
                    'valor_pedido = :valor_pedido, ' + 
                    'forma_pagamento = :forma_pagamento, ' + 
                    'status = :status ' + 
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

        let query = 'DELETE FROM atividadenosql.pedido ' +
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
        let parametro = {
          id: id,
          status: 'Aberto'
        };

        let query = 'SELECT * FROM atividadenosql.pedido ' +
                    'WHERE id = :id AND status = :status';

        cassandra.execute(query, parametro, {prepare: true}, (e, r) => {
          if (e) reject(e);
          if (r) resolve(r.rows);
        });
      })
      .catch((e) => reject(e));
  })
}