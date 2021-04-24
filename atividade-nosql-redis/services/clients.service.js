var Bluebird = require('bluebird')

var servico = {}

servico.criar = criarCliente
servico.ler = lerCliente
servico.atualizar = atualizarCliente
servico.deletar = deletarCliente

module.exports = servico

function criarCliente (redis, parametro) {
  return new Bluebird((resolve, reject) => {
    redis.saddAsync('cliente', parametro)
      .then((r) => resolve(r))
      .catch((e) => reject(e))
  })
}

function lerCliente (redis) {
  return new Bluebird((resolve, reject) => {
    redis.smembersAsync('cliente')
      .then((r) => resolve(r))
      .catch((e) => reject(e))
  })
}

function atualizarCliente (redis, cliente, parametro) {
  return new Bluebird((resolve, reject) => {
    redis.multi()
      .srem('cliente', cliente)
      .sadd('cliente', parametro)
      .exec((e, r) => {
        if (e) reject(e)
        if (r) resolve(r)
      })
  })
}

function deletarCliente (redis, parametro) {
  return new Bluebird((resolve, reject) => {
    redis.sremAsync('cliente', parametro)
      .then((r) => resolve(r))
      .catch((e) => reject(e))
  })
}
