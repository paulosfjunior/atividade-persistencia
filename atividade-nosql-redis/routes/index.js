var express = require('express')
var rotas = express.Router()

const bancRedis = require('../services/redis.service')
const servRedis = require('../services/clients.service')

rotas.get('/', selecionarCliente)

module.exports = rotas

function selecionarCliente (req, res) {
  servRedis.ler(bancRedis)
    .then((r) => {
      r.sort()
      res.render('index', { titulo: 'Selecionar Cliente', clientes: r })
    })
    .catch((e) => {
      res.render('index', { titulo: 'Selecionar Cliente', clientes: [] })
    })
}
