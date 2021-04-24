var express = require('express')
var rotas = express.Router()

const bancRedis = require('../services/redis.service')
const servRedis = require('../services/clients.service')

rotas.get('/r', criarClientes)
rotas.get('/', listaClientes)
rotas.get('/e/:cliente', editarClientes)
rotas.get('/d/:cliente', deletarClientes)
rotas.post('/r', registrarClientes)
rotas.post('/e/:cliente', atualizarClientes)

module.exports = rotas

function criarClientes (req, res) {
  res.render('criarCliente', { titulo: 'Cadastrar Cliente' })
}

function registrarClientes (req, res) {
  let cli = req.body.cliente.trim()

  if (cli) {
    servRedis.criar(bancRedis, cli)
  }
  res.redirect('/clientes')
}

function listaClientes (req, res) {
  servRedis.ler(bancRedis)
    .then((r) => {
      r.sort()
      res.render('listarCliente', { titulo: 'Lista de Clientes', clientes: r })
    })
    .catch((e) => {
      res.render('listarCliente', { titulo: 'Lista de Clientes', clientes: [] })
    })
}

function editarClientes (req, res) {
  let cli = req.params.cliente.trim()

  if (cli) {
    res.render('atualizarCliente', { titulo: 'Atualizar Cliente', cliente: cli })
  } else {
    res.redirect('/clientes')
  }
}

function atualizarClientes (req, res) {
  let cli = req.params.cliente.trim()
  let nov = req.body.cliente.trim()

  if (cli && nov) {
    servRedis.atualizar(bancRedis, cli, nov)
  }
  res.redirect('/clientes')
}

function deletarClientes (req, res) {
  let cli = req.params.cliente.trim()

  if (cli) {
    servRedis.deletar(bancRedis, cli)
  }
  res.redirect('/clientes')
}
