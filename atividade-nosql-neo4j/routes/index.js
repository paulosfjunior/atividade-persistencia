/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require('express');
const uuid = require('uuid/v1');
const url = require('url');

const rotas = express.Router();

const linkedin = require('../services/linkedin.service');
const facebook = require('../services/facebook.service');
const neo4j = require('../services/index.service');

rotas.get('/', carregarInicial);
rotas.get('/c', carregarCadastro);
rotas.get('/l', carregarLogin);
rotas.get('/a/', carregarAutorizacao);
rotas.get('/g', carregarGrafo);
rotas.get('/e', carregarErro);
rotas.post('/c', cadastrarPessoa);

module.exports = rotas;

/**
 * função para carregar tela inicial
 * @param {object} req
 * @param {object} res
 */
function carregarInicial(req, res) {
  console.log('carregarInicial');

  res.render('index', {titulo: 'Inicio'});
}

/**
 * função para carregar tela de cadastro
 * @param {object} req
 * @param {object} res
 */
function carregarCadastro(req, res) {
  console.log('carregarCadastro');

  res.render('create', {titulo: 'Cadastrar'});
}

/**
 * função para registrar pessoa e relacao
 * @param {object} req
 * @param {object} res
 */
function cadastrarPessoa(req, res) {
  console.log('cadastrarPessoa');

  const o = req.body.origem;
  const t = req.body.relacao;
  const d = req.body.destino;

  if (o && t && d) {
    neo4j.cadastrar({id: uuid(), nome: o})
      .then((r) => {
        neo4j.cadastrar({id: uuid(), nome: d})
          .then((r) => {
            neo4j.relacao({tipo: t, origem: o, destino: d})
              .then((r) => {
                res.redirect('/c');
              }).catch((e) => {
                res.redirect('/');
              });
          }).catch((e) => {
            res.redirect('/');
          });
      }).catch((e) => {
        res.redirect('/');
      });
  } else {
    if (o || d) {
      neo4j.cadastrar({id: uuid(), nome: (o ? o : d)})
        .then((r) => {
          if (o ? d : o) {
            neo4j.cadastrar({id: uuid(), nome: o ? d : o})
              .then((r) => {
                res.redirect('/c');
              }).catch((e) => {
                res.redirect('/');
              });
          } else {
            res.redirect('/c');
          }
        }).catch((e) => {
          res.redirect('/');
        });
    }
  }
}

/**
 * função para carregar tela de login para autorizacao
 * @param {object} req
 * @param {object} res
 */
function carregarLogin(req, res) {
  console.log('carregarLogin');

  res.redirect(facebook.gerarTokenMembro());
}

/**
 * função para carregar tela após autorizar
 * @param {object} req
 * @param {object} res
 */
function carregarAutorizacao(req, res) {
  console.log('carregarAutorizacao');

  if (req.query.state === global['codState']) {
    if (!req.query.error) {
      const io = req.app.get('socketio');

      res.render('loader', {titulo: 'Copiando Dados', nMenu: true});

      linkedin.gerarTokenAplicacao(req.query.code)
        .then((r) => {
          linkedin.getPerfilUsuario(r)
            .then((r) => {
              io.emit('finish', {url: '/g'});
            })
            .catch((e) => {
              console.log('Erro: linkedin.getPerfilUsuario');
              console.log({e});
              io.emit('finish', {url: '/'});
            });
        })
        .catch((e) => {
          console.log('Erro: linkedin.gerarTokenAplicacao');
          console.log({e});
          res.redirect('/');
        });
    } else {
      res.status(401).redirect(montarUrl({
        pagina: 'failure',
        titulo: 'Erro na Autorização',
        error: 'Usuário não ' + (req.query.error === 'user_cancelled_authorize' ? 'autorizou' : 'fez login'),
        error_description: req.query.error_description}));
    }
  } else {
    res.status(401).redirect(montarUrl({
      pagina: 'failure',
      titulo: 'Falha na Autorização',
      error: 'State Divergente',
      error_description: 'A string de retorno STATE é divergente da enviada.'}));
  }
}

/**
 * função para carregar a tela principal
 * @param {object} req
 * @param {object} res
 */
function carregarGrafo(req, res) {
  console.log('carregarGrafo');

  neo4j.listar()
    .then((r) => {
      const styleNode = {
        symbolSize: 28.685715,
        x: null,
        y: null,
        attributes: {
          modularity_class: 0}};

      for (let x = 0, t = r.dados.length; x < t; x++) {
        // eslint-disable-next-line guard-for-in
        for (const k in styleNode) {
          r.dados[x][k]= styleNode[k];
        }
      }

      res.render('graph', {titulo: 'Conexões Linkedin', gf: r});
    })
    .catch((e) => res.redirect('/'));
}

/**
 * função para carregar tela de erro
 * @param {object} req
 * @param {object} res
 */
function carregarErro(req, res) {
  console.log('carregarErro');

  res.render(req.query.pagina, req.query);
}

/**
 * função para formatar url
 * @param {object} p
 * @return {any} retorna a url formatada para envio
 */
function montarUrl(p) {
  const r = url.parse('/e', true);
  r.query = p;
  delete r.search;
  return url.format(r);
}
