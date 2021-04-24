var Bluebird = require('bluebird')

var servico = {}

servico.criar = criarCompra
servico.ler = lerCompra
servico.deletar = deletarCompra

module.exports = servico

function criarCompra (redis, c, f, v) {
  return new Bluebird((resolve, reject) => {
    redis.hsetAsync(c, f, v)
      .then((r) => resolve(r))
      .catch((e) => reject(e))
  })
}

function lerCompra (redis, c) {
  return new Bluebird((resolve, reject) => {
    redis.hgetallAsync(c)
      .then((r) => resolve(r))
      .catch((e) => reject(e))
  })
}

function deletarCompra (redis, c, f) {
  return new Bluebird((resolve, reject) => {
    redis.hdelAsync(c, f)
      .then((r) => resolve(r))
      .catch((e) => reject(e))
  })
}
