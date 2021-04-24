var Bluebird = require('bluebird')

var servico = {}

servico.criar = criarItem
servico.ler = lerItem
servico.atualizar = atualizarItem
servico.deletar = deletarItem
servico.item = item

module.exports = servico

function criarItem (redis, f, v) {
  return new Bluebird((resolve, reject) => {
    redis.hsetAsync('item', f, v)
      .then((r) => resolve(r))
      .catch((e) => reject(e))
  })
}

function lerItem (redis) {
  return new Bluebird((resolve, reject) => {
    redis.hgetallAsync('item')
      .then((r) => resolve(r))
      .catch((e) => reject(e))
  })
}

function atualizarItem (redis, item, f, v) {
  return new Bluebird((resolve, reject) => {
    redis.multi()
      .hdel('item', item)
      .hset('item', f, v)
      .exec((e, r) => {
        if (e) reject(e)
        if (r) resolve(r)
      })
  })
}

function deletarItem (redis, parametro) {
  return new Bluebird((resolve, reject) => {
    redis.hdelAsync('item', parametro)
      .then((r) => resolve(r))
      .catch((e) => reject(e))
  })
}

function item (redis, parametro) {
  return new Bluebird((resolve, reject) => {
    redis.hgetAsync('item', parametro)
      .then((r) => resolve(r))
      .catch((e) => reject(e))
  })
}
