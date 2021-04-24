const express = require('express');
const passport = require('../auth/passport');

const pedidoService = require('../services/pedido.service');

// carrengado express router
const rotas = express.Router();

// carregar rotas
rotas.get('/', getAll);
rotas.get('/:id', getById);
rotas.post('/', createRegister, getAll);
rotas.put('/:id', updateRegister, getAll);
rotas.delete('/:id', deleteRegister, getAll);
rotas.get('/meus', getOwn);

module.exports = rotas;

function getAll(req, res) {
  pedidoService.listar()
      .then((resultado) => {
        if (resultado.length > 0) {
          resultado = resultado.map(row => {
            if (row.carrinho && row.carrinho.length > 0) {
              row.carrinho = row.carrinho.map(item => {
                item.valor_unitario = +(item.valor_unitario.toFixed(2));
                item.valor_total = +(item.valor_total.toFixed(2));
                return item;
              });
            }
            row.valor_pedido = +(row.valor_pedido.toFixed(2));
            return row;
          })
        }
        res.json({
          tipo: 'sucesso',
          resultado,
          mensagem: 'Lista carregada.'
        });
      })
      .catch((erro) => {
        console.log(erro)
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Não foi possivel carregar lista de pedidos.'});
      });
}

function getById(req, res) {
  pedidoService.procurar(req.params.id)
      .then((resultado) => {
        if (resultado) {
          res.json({
            tipo: 'sucesso',
            resultado,
            mensagem: 'Pedido encontrado.'});
        } else {
          res.status(400).json({
            tipo: 'erro',
            mensagem: 'Pedido não encontrado.'});
        }
      })
      .catch((erro) => {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Pedido não encontrado.'});
      });
}

function createRegister(req, res, next) {
  pedidoService.criar(req.body)
      .then((resultado) => {
        if (resultado) {
          next();
        } else {
          res.status(400).json({
            tipo: 'erro',
            mensagem: 'Pedido não cadastrado.'});
        }
      })
      .catch((erro) => {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Pedido não cadastrado.'});
      });
}

function updateRegister(req, res, next) {
  pedidoService.editar(req.params.id, req.body)
      .then((resultado) => {
        next();
      })
      .catch((erro) => {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Pedido ' + req.params.id + ' não foi alterado.'});
      });
}

function deleteRegister(req, res, next) {
  pedidoService.deletar(req.params.id)
      .then((resultado) => {
        if (resultado && (req.user.cargo === 'Administrador' || req.user.id === req.params.id)) {
          next();
        } else {
          res.status(400).json({
            tipo: 'erro',
            mensagem: 'Pedido ' + req.params.id + ' não foi apagado.'});
        }
      })
      .catch((erro) => {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Pedido ' + req.params.id + ' não foi apagado.'});
      });
}

function getOwn(req, res) {
  pedidoService.listarMeus(req.user.id)
  .then(resultado => {
      if (resultado) {
        res.status(200).json({
          tipo: 'sucesso',
          resultado,
          mensagem: 'Pedidos buscados.'});
      } else {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Pedido não encontrados.'});
      }
    })
    .catch((erro) => {
      res.status(400).json({
        tipo: 'erro',
        mensagem: 'Pedido não encontrados.'});
  });
}