const express = require('express');
const passport = require('../auth/passport');

const usuarioServico = require('../services/usuario.service');
const { hashPasswordWithSalt, hashPassword, genAccessToken, genRefreshToken } = require('../auth/_auth');

// carrengado express router
const rotas = express.Router();

// carregar rotas
rotas.get('/', passport.authenticate('jwt', { session: false }), getAll);
rotas.get('/:id', passport.authenticate('jwt', { session: false }), getById);
rotas.post('/', passport.authenticate('jwt', { session: false }), createRegister, getAll);
rotas.put('/:id', passport.authenticate('jwt', { session: false }), updateRegister, getAll);
rotas.delete('/:id', passport.authenticate('jwt', { session: false }), deleteRegister, getAll);
rotas.post('/autenticar', authUser);
rotas.post('/logout', passport.authenticate('jwt', { session: false }), logoutUser);
 
module.exports = rotas;

function getAll(req, res) {
  usuarioServico.listar()
      .then((resultado) => {
        res.json({
          tipo: 'sucesso',
          resultado,
          mensagem: 'Lista carregada.'});
      })
      .catch((erro) => {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Não foi possivel carregar lista de usuários.'});
      });
}

function getById(req, res) {
  usuarioServico.procurar(req.params.id)
      .then((resultado) => {
        if (resultado) {
          res.json({
            tipo: 'sucesso',
            resultado,
            mensagem: 'Usuario encontrado.'});
        } else {
          res.status(400).json({
            tipo: 'erro',
            mensagem: 'Usuário não encontrado.'});
        }
      })
      .catch((erro) => {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Usuário não encontrado.'});
      });
}

function createRegister(req, res, next) {
  usuarioServico.criar(req.body)
      .then((resultado) => {
        if (resultado) {
          next();
        } else {
          res.status(400).json({
            tipo: 'erro',
            mensagem: 'Usuário não cadastrado.'});
        }
      })
      .catch((erro) => {
        console.log(erro)
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Usuário não cadastrado.'
        });
      });
}

function updateRegister(req, res, next) {
  console.log(req.body)
  usuarioServico.editar(req.params.id, req.body)
      .then((resultado) => {
        if (resultado && (req.user.cargo === 'Administrador' || req.user.id === req.params.id)) {
          next();
        } else {
          res.status(400).json({
            tipo: 'erro',
            mensagem: 'Usuário não foi alterado.'});
        }
      })
      .catch((erro) => {
        console.log(erro)
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Usuário não foi alterado.'});
      });
}

function deleteRegister(req, res, next) {
  usuarioServico.deletar(req.params.id)
      .then((resultado) => {
        if (resultado && (req.user.cargo === 'Administrador' || req.user.id === req.params.id)) {
          next();
        } else {
          res.status(400).json({
            tipo: 'erro',
            mensagem: 'Usuário não foi apagado.'
          });
        }
      })
      .catch((erro) => {
        res.status(400).json({
          tipo: 'erro',
          mensagem: 'Usuário não foi apagado.'
        });
      });
}

function authUser(req, res) {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (!user) return res.status(422).json({ message: info.message });

    req.login(user, { session: false }, async (err) => {
      const refreshToken = genRefreshToken(user);
      user.refresh_token = refreshToken;
      usuarioServico.editar(user.id, user)
          .then((resultado) => {
            if (resultado) {
              console.log({user, refreshToken})
              return res.status(200).json({
                token: genAccessToken(user, refreshToken),
                message: info.message 
              });
            } else {
              return res.status(500).json({ message: 'Ocorreu um erro interno.' });
            }
          })
          .catch((erro) => {
            console.log(erro)
            return res.status(500).json({ message: 'Ocorreu um erro interno.' });
          });
    });
  })(req, res);
}

function logoutUser(req, res) {
  usuarioServico.procurar(req.user.id)
      .then((usuario) => {
        if (usuario) {
          usuario.refresh_token = null;
          usuarioServico.editar(req.user.id, usuario)
              .then((resultado) => {
                if (resultado) {
                  return res.status(200).json({ message: 'Sessão finalizada com sucesso.' });
                } else {
                  return res.status(500).json({ message: 'Ocorreu um erro interno.' });
                }
              })
        } else {
          return res.status(500).json({ message: 'Ocorreu um erro interno.' });
        }
      })
      .catch((erro) => {
        return res.status(500).json({ message: 'Ocorreu um erro interno.' });
      }); 
}