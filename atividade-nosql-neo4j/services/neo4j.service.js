/* eslint-disable max-len */
const neo4j = require('neo4j-driver').v1;
const os = require('os');

const uri = verificarUrl(process.env.n4jUri) + process.env.n4jPort;
const usr = process.env.n4jUsuario;
const psd = process.env.n4jSenha;

const driver = neo4j.driver(uri, neo4j.auth.basic(usr, psd));

module.exports = driver;

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
            url = 'bolt://' + d.address;
          }
        });
      }
    }
  }

  url = url ? url : 'localhost';

  return url;
}
