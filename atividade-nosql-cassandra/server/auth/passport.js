require('dotenv').config();
const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { hashPasswordWithSalt, hashPassword, genAccessToken } = require('./_auth');
const cassandra = require('../cassandra');

const usuarioServico = require('../services/usuario.service');

passport.use('login', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'senha',
    passReqToCallback: true,
  },
  async (req, usuario, senha, next) => {
    try {
      usuarioServico.autenticar(req.body.usuario)
          .then((user) => {
            if (user) {
              if (user.hash == hashPasswordWithSalt(req.body.senha, user.salt).hash) {
                return next(null, user, { message: 'Sessão iniciada com sucesso.' });
              } else {
                return next(null, false, { message: 'Senha incorreta.' });
              }
            } else {
              return next(null, false, { mensagem: 'Usuário não encontrado.' });
            }
          })
          .catch((erro) => {
            return next(null, false, { mensagem: 'Erro interno' });
          });
    } catch(err) {
      next(err);
    }
  }
));

passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true
  },
  async (req, jwtPayload, next) => {
    try {
      usuarioServico.procurar(jwtPayload.id)
          .then((user) => {
            if (user && (user.cargo === 'Administrador' || user.refresh_token === jwtPayload.refreshToken)) {
              let accessToken = req.headers['authorization'].split(' ')[1];
              jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
                accessToken = genAccessToken(user, jwtPayload.refreshToken);
                return next(null, user, { refreshToken: jwtPayload.refreshToken, accessToken: accessToken });
              }); 
            } else {
              return next(null, false, { message: 'Autenticação falhou.' });
            }
          })
          .catch((erro) => {
            return next(erro);
          });

    } catch(err) {
      return next(err);
    }

  }
));

passport.use('adminJwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true
  },
  async (req, jwtPayload, next) => {
    try {
      usuarioServico.procurar(jwtPayload.id)
          .then((user) => {
            if (user && user.cargo === 'Administrador') {
              let accessToken = req.headers['authorization'].split(' ')[1];
              jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
                accessToken = genAccessToken(user, jwtPayload.refreshToken);
                return next(null, user, { refreshToken: jwtPayload.refreshToken, accessToken: accessToken });
              });
            } else {
              return next(null, false, { message: 'Autenticação falhou.' });
            }
          })
          .catch((erro) => {
            return next(err);
          });

    } catch(err) {
      return next(err);
    }

  }
));

module.exports = passport;