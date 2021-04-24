const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const createError = require('http-errors')
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const serveFavicon = require('serve-favicon');
const serveStatic = require('serve-static');

const app = express();

const routes = require('./routes/routes');

const whitelist = ['http://localhost:3333', 'http://10.64.206.158:3333', 'http://10.64.204.140:3333', 'http://10.64.204.100'];

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(serveFavicon(path.join(__dirname, '/public/images/favicon.ico')));

// app.use(cors());
app.use(cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}));

app.use('/', routes);

// carregando funções de erro;
app.use(paginaNaoEncontrada);
app.use(manipularErro);

function paginaNaoEncontrada(req, res, next) {
  const err = new Error('Not Found');

  console.log({err});

  err['name'] = 'Not Found';
  err['status'] = 404;

  next(err);
}

function manipularErro(err, req, res, next) {
  // cabeçalho ja enviado para o cliente
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'Not Found') {
    // define status e mensagem de erro
    res.status(404).json({
      tipo: 'erro',
      mensagem: 'Página não encontrada!',
    });
  } else {
    if (err.name === 'UnauthorizedError') {
      // define status e mensagem de erro
      res.status(401).json({
        tipo: 'erro',
        mensagem: 'Token de acesso Inválido!',
      });
    } else {
      // define status e mensagem de erro
      res.status(err.status || 500).json({
        tipo: 'erro',
        mensagem: err.message || 'Erro interno do servidor!',
      });
    }
  }
}

module.exports = app;