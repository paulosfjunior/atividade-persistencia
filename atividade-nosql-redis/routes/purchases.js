var express = require('express')
var rotas = express.Router()

const bancRedis = require('../services/redis.service')
const servRedis = require('../services/purchases.service')
const itemRedis = require('../services/items.service')

rotas.get('/', listaCompras)
rotas.post('/c', criarCompras)
rotas.post('/r', registrarCompras, criarCompras)
rotas.get('/d/:cliente/:item', deletarCompras, criarCompras)

module.exports = rotas

function criarCompras (req, res) {
  let cli = req.body.cliente || req.params.cliente
  let ite = []

  cli = cli ? cli.trim() : cli

  if (cli) {
    itemRedis.ler(bancRedis)
      .then((i) => {
        for (const k in i) {
          ite.push(k)
        }
        ite.sort()
        if (ite) {
          servRedis.ler(bancRedis, cli)
            .then((r) => {
              let com = []

              for (const k in r) {
                com.push({
                  item: k,
                  preco: i[k],
                  quantidade: r[k],
                  total: (Number(i[k].replace('.', '').replace(',', '.')) * Number(r[k].replace('.', '').replace(',', '.')))
                })
              }

              com.sort((a, b) => a.item > b.item ? 1 : a.item < b.item ? -1 : 0)

              res.render('criarCompra', { titulo: 'Cadastrar Compra', cliente: cli, itens: ite, compras: com })
            })
            .catch((e) => {
              res.render('criarCompra', { titulo: 'Cadastrar Compra', cliente: cli, itens: ite, compras: [] })
            })
        } else {
          res.redirect('/')
        }
      })
      .catch((e) => res.redirect('/'))
  } else {
    res.redirect('/')
  }
}

function registrarCompras (req, res, next) {
  let cli = req.body.cliente
  let ite = req.body.item
  let qua = req.body.quantidade

  if (ite && cli) {
    servRedis.criar(bancRedis, cli, ite, qua)
      .then((r) => next())
      .catch((e) => next())
  } else {
    res.redirect('/')
  }
}

function listaCompras (req, res) {
  servRedis.ler(bancRedis)
    .then((r) => {
      res.render('listarCompra', { titulo: 'Lista de Compras', clientes: r })
    })
    .catch((e) => {
      res.render('listarCompra', { titulo: 'Lista de Compras', clientes: [] })
    })
}

function deletarCompras (req, res, next) {
  let cli = req.params.cliente
  let ite = req.params.item

  cli = cli ? cli.trim() : cli
  ite = ite ? ite.trim() : ite

  if (cli && ite) {
    servRedis.deletar(bancRedis, cli, ite)
  }
  next()
}
