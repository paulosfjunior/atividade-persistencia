require('dotenv-safe').config({allowEmptyValues: true});

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');
const serveFavicon = require('serve-favicon');
const serveStatic = require('serve-static');

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(helmet());
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(serveFavicon(path.join(__dirname, '/public/images/favicon.ico')));

app.use(session({
  secret: process.env.chave,
  name: 'sessionId',
  resave: false,
  saveUninitialized: true,
}));

app.use('/', indexRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
