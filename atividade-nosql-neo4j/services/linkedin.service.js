/* eslint-disable max-len */
const Bluebird = require('bluebird');
const request = require('request');
const url = require('url');
const os = require('os');

const neo4j = require('./index.service');

const servico = {};

// urlAplicacao=https://www.linkedin.com/oauth/v2/accessToken
// urlMembro=https://www.linkedin.com/oauth/v2/authorization
// urlPerfil=https://api.linkedin.com/v2/me
// urlEmail=https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))
// permissaoAcesso=r_liteprofile r_emailaddress

servico.gerarTokenMembro = gerarTokenMembro;
servico.gerarTokenAplicacao = gerarTokenAplicacao;
servico.getPerfilUsuario = getPerfilUsuario;
servico.getEmailUsuario = getEmailUsuario;

module.exports = servico;

/**
 * funcao para montar a url para solicitar autorizacao
 * @return {any} retorna url configurada
 */
function gerarTokenMembro() {
  console.log('gerarTokenMembro');

  const s = gerarState();
  const p = {
    response_type: 'code',
    client_id: process.env.clienteId,
    redirect_uri: verificarUrl(process.env.urlRedirecionar) + process.env.portRedirecionar,
    state: s,
    scope: process.env.permissaoAcesso};

  const r = url.parse(process.env.urlMembro, true);
  r.query = p;
  delete r.search;

  global['codState'] = s;

  return url.format(r);
}

/**
 * funcao para solicitar token de acesso
 * @param {string} code
 * @return {any} retorna token de acesso
 */
function gerarTokenAplicacao(code) {
  console.log('gerarTokenAplicacao');

  return new Bluebird((resolve, reject) => {
    const p = {
      method: 'POST',
      url: process.env.urlAplicacao,
      headers: {
        'Host': 'www.linkedin.com',
        'Content-Type': 'application/x-www-form-urlencoded'},
      form: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: verificarUrl(process.env.urlRedirecionar) + process.env.portRedirecionar,
        client_id: process.env.clienteId,
        client_secret: process.env.clienteChave}};

    request(p, (error, response, body) => {
      if (error) {
        console.log('Erro: gerarTokenAplicacao');
        reject(error);
      };

      const b = JSON.parse(body);

      resolve(b);
    });
  });
}

/**
 * funcao para solicitar dados do usuario
 * @param {object} p
 * @return {any} retorna dados do usuario
 */
function getPerfilUsuario(p) {
  console.log('getPerfilUsuario');

  return new Bluebird((resolve, reject) => {
    const r = {
      method: 'GET',
      url: process.env.urlPerfil,
      headers: {
        'Host': 'api.linkedin.com',
        'Connection': 'Keep-Alive',
        'Authorization': 'Bearer ' + p.access_token}};

    request(r, (error, response, body) => {
      if (error) {
        console.log('Erro: getPerfilUsuario');
        reject(error);
      };

      const b = JSON.parse(body);
      b['access_token'] = p.access_token;
      b['expires_in'] = p.expires_in;

      getEmailUsuario(b)
        .then((r) => {
          const d = {
            id: b.id,
            nome: b.localizedFirstName + (b.localizedLastName ? ' ' + b.localizedLastName : ''),
            email: (r.elements ? r.elements[0]['handle~'].emailAddress : '')};

          neo4j.cadastrar(d)
            .then((r) => {
              resolve(r);
            }).catch((e) => {
              reject(e);
            });
        }).catch((e) => {
          reject(e);
        });
    });
  });
}

/**
 * funcao para solicitar email do usuario
 * @param {object} p
 * @return {any} retorna email do usuario
 */
function getEmailUsuario(p) {
  console.log('getEmailUsuario');

  return new Bluebird((resolve, reject) => {
    const r = {
      method: 'GET',
      url: process.env.urlEmail,
      headers: {
        'Host': 'api.linkedin.com',
        'Connection': 'Keep-Alive',
        'Authorization': 'Bearer ' + p.access_token}};

    request(r, (error, response, body) => {
      if (error) {
        console.log('Erro: getEmailUsuario');
        reject(error);
      };

      const b = JSON.parse(body);

      resolve(b);
    });
  });
}

/**
 * função para gerar uma string para o state\
 * @return {string}
 */
function gerarState() {
  console.log('gerarState');

  let s = '';

  for (let x = 0; x < 5; x++) {
    s += Math.random().toString(36).substring(2, 15);
  }

  return s;
}

/**
 * função para gerar uma url valida
 * @param {string} u
 * @return {string} url valida
 */
function verificarUrl(u = '') {
  console.log('gerarState');

  const ifaces = os.networkInterfaces();
  let url = u;

  if (!url) {
    for (const dev in ifaces) {
      if (dev.indexOf('Wifi') > -1 || dev.indexOf('Wi-fi') > -1 || dev.indexOf('WIFI') > -1 || dev.indexOf('Wi-Fi') > -1) {
        ifaces[dev].forEach((d) => {
          if (d.family == 'IPv4' && d.internal == false) {
            url = 'http://' + d.address;
          }
        });
      }
    }
  }

  url = url ? url : 'localhost';

  return url;
}
