var express = require('express')
var rotas = express.Router()

const bancRedis = require('../services/redis.service')
const servRedis = require('../services/items.service')

rotas.get('/r', criarItens)
rotas.get('/', listaItens)
rotas.get('/e/:item', editarItens)
rotas.get('/d/:item', deletarItens)
rotas.post('/r', registrarItens)
rotas.post('/e/:item', atualizarItens)

module.exports = rotas

function criarItens (req, res) {
  res.render('criarItem', { titulo: 'Cadastrar Item' })
}

function registrarItens (req, res) {
  let ite = req.body.item.trim()
  let pre = req.body.preco.trim()

  if (ite && pre) {
    servRedis.criar(bancRedis, ite, pre)
  }
  res.redirect('/itens')
}

function listaItens (req, res) {
  servRedis.ler(bancRedis)
    .then((r) => {
      let i = []

      for (const k in r) {
        i.push({
          item: k,
          preco: r[k]
        })
      }
      i.sort((a, b) => a.item > b.item ? 1 : a.item < b.item ? -1 : 0)
      res.render('listarItem', { titulo: 'Lista de Itens', itens: i })
    })
    .catch((e) => {
      res.render('listarItem', { titulo: 'Lista de Itens', itens: [] })
    })
}

function editarItens (req, res) {
  let ite = req.params.item.trim()

  if (ite) {
    servRedis.item(bancRedis, ite)
      .then((r) => {
        res.render('atualizarItem', { titulo: 'Atualizar Item', item: ite, preco: r })
      })
      .catch((e) => res.redirect('/itens'))
  } else {
    res.redirect('/itens')
  }
}

function atualizarItens (req, res) {
  let ite = req.params.item.trim()
  let nov = req.body.item.trim()
  let pre = req.body.preco.trim()

  if (ite && nov && pre) {
    servRedis.atualizar(bancRedis, ite, nov, pre)
  }
  res.redirect('/itens')
}

function deletarItens (req, res) {
  let ite = req.params.item.trim()

  if (ite) {
    servRedis.deletar(bancRedis, ite)
  }
  res.redirect('/itens')
}
