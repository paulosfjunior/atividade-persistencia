var redis = require('redis')
var bluebird = require('bluebird')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

var host = 'localhost'
var port = 6379

var cliente = redis.createClient(port, host)

cliente.on('connect', () => {
  console.log('Conectado ao Redis')
})

cliente.on('ready', () => {
  console.log('Redis está pronto')
})

cliente.on('error', (e) => {
  console.log('Erro: ' + e)
})

module.exports = cliente
