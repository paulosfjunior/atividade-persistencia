const bodyParser = require('body-parser')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const serveStatic = require('serve-static')
const serveFavicon = require('serve-favicon')

var indexRouter = require('./routes/index')
var cliesRouter = require('./routes/clients')
var itemsRouter = require('./routes/items')
var purchasesRouter = require('./routes/purchases')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(serveStatic(path.join(__dirname, 'public')))
app.use(serveFavicon(path.join(__dirname, '/public/images/favicon.ico')))

app.use('/', indexRouter)
app.use('/clientes', cliesRouter)
app.use('/itens', itemsRouter)
app.use('/compras', purchasesRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
