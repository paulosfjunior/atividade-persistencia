const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('../auth/passport');

const admin = require('./admin');
const pedidos = require('./pedido.routing');
const produtos = require('./produto.routing');
const usuarios = require('./usuario.routing');

router.use('/pedidos', passport.authenticate('jwt', { session: false }), pedidos);
router.use('/produtos', produtos);
router.use('/usuarios', usuarios);
router.use('/admin', passport.authenticate('adminJwt', { session: false }), admin);

module.exports = router;