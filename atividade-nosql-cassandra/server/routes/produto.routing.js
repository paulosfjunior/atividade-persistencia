const express = require('express');
const passport = require('../auth/passport');

const produtoService = require('../services/produto.service');

// carrengado express router
const rotas = express.Router();

// carregar rotas
rotas.get('/', passport.authenticate('jwt', { session: false }), getAll);
rotas.get('/:id', passport.authenticate('jwt', { session: false }), getById);
rotas.post('/', passport.authenticate('adminJwt', { session: false }), createRegister, getAll);
rotas.put('/:id', passport.authenticate('adminJwt', { session: false }), updateRegister, getAll);
rotas.delete('/:id', passport.authenticate('adminJwt', { session: false }), deleteRegister, getAll);

module.exports = rotas;

function getAll(req, res) {
  produtoService.listar()
      .then((resultado) => {
        if (resultado.length > 1) {
          resultado = resultado.map(item => {
            item.preco = +(item.preco.toFixed(2));
            return item;
          });
        }
        res.json({
          tipo: 'sucesso',
          resultado,
          mensagem: 'Lista carregada.'
        });
      })
      .catch((erro) => {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Não foi possivel carregar lista de produtos.'});
      });
}

function getById(req, res) {
  produtoService.procurar(req.params.id)
      .then((resultado) => {
        console.log({resultado})
        if (resultado) {
          res.json({
            tipo: 'sucesso',
            resultado,
            mensagem: 'Produto encontrado.'
          });
        } else {
          res.status(400).json({
            tipo: 'erro',
            mensagem: 'Produto não encontrado.'});
        }
      })
      .catch((erro) => {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Produto não encontrado.'});
      });
}

function createRegister(req, res, next) {
  produtoService.criar(req.body)
      .then((resultado) => {
        if (resultado) {
          next();
        } else {
          res.status(400).json({
            tipo: 'erro',
            mensagem: 'Produto não cadastrado.'});
        }
      })
      .catch((erro) => {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Produto não cadastrado.'});
      });
}

function updateRegister(req, res, next) {
  produtoService.editar(req.params.id, req.body)
      .then((resultado) => {
        if (resultado) {
          next();
        } else {
          res.status(400).json({
            tipo: 'erro',
            mensagem: 'Produto não foi alterado.'
          });
        }
      })
      .catch((erro) => {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Produto não foi alterado.'
        });
      });
}

function deleteRegister(req, res, next) {
  produtoService.deletar(req.params.id)
      .then((resultado) => {
        if (resultado) {
          next();
        } else {
          res.status(400).json({
            tipo: 'erro',
            mensagem: 'Produto não foi apagado.'});
        }
      })
      .catch((erro) => {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Produto não foi apagado.'});
      });
}
