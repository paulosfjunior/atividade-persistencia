/* eslint-disable max-len */
const Bluebird = require('bluebird');

const driver = require('./neo4j.service');

const servico = {};

servico.cadastrar = cadastrar;
servico.relacao = relacao;
servico.listar = listar;

module.exports = servico;

/**
 * funcao para cadastrar dados do usuario e as conexoes
 * @param {object} p
 * @return {any} retorna a resposta do cadastro
 */
function cadastrar(p) {
  const sessao = driver.session();
  // let query = '';
  // query = query + 'MERGE (P:{sexo} {id: {id}) ';
  // query = query + 'SET P = {id: {id}, nome: {nome}, email: {email}} ';
  // query = query + 'RETURN P';
  let query = '';
  query = query + 'MERGE (P:Pessoa {nome: {nome}}) ';
  query = query + 'SET P = {id: {id}, nome: {nome}, email: "Sem email"} ';
  query = query + 'RETURN P';

  return new Bluebird((resolve, reject) => {
    sessao.run(
      query,
      p)
      .then((r) => {
        sessao.close();
        resolve(r);
        driver.close();
      })
      .catch((e) => {
        sessao.close();
        reject(e);
        driver.close();
      });
  });
}

/**
 * funcao para cadastrar relacao das pessoas
 * @param {object} p
 * @return {any} retorna a resposta do cadastro
 */
function relacao(p) {
  const sessao = driver.session();
  // let query = '';
  // query = query + 'MERGE (O {id: {origem}}) ';
  // query = query + 'MERGE (D {id: {destino}}) ';
  // query = query + 'MERGE (O)-[R:Amigo]->(D) ';
  // query = query + 'RETURN O, R, D';
  let query = '';
  query = query + 'MATCH (O {nome: {origem}}) ';
  query = query + 'MATCH (D {nome: {destino}}) ';
  query = query + `MERGE (O)-[R:${p.tipo}]->(D) `;
  query = query + 'RETURN O, R, D';

  return new Bluebird((resolve, reject) => {
    sessao.run(
      query,
      p)
      .then((r) => {
        sessao.close();
        resolve(r);
        driver.close();
      })
      .catch((e) => {
        sessao.close();
        reject(e);
        driver.close();
      });
  });
}

/**
 * funcao para listar dados e conexoes
 * @return {any} retorna lista
 */
function listar() {
  const sessao = driver.session();
  let query = '';
  query = query + 'MATCH (P) ';
  query = query + 'OPTIONAL MATCH (P)-[R]->(O) ';
  query = query + 'RETURN P, R, O';

  return new Bluebird((resolve, reject) => {
    sessao.run(
      query)
      .then((r) => {
        sessao.close();
        const lista = r.records;
        const retorno = {
          categorias: [],
          dados: [],
          relacoes: []};
        const id = [];
        const ct = [];

        for (const x of lista) {
          if (x['_fields'] !== null) {
            const fields = x['_fields'];
            const c = {
              name: '',
              source: '',
              target: '',
              dados: ''};

            for (let n = 0, t = fields.length; n < t; n++) {
              const no = fields[n];

              if (n == 0) {
                const p = no['properties'];
                const l = no['labels'];

                c.source = p.id;
                p['name'] = no['properties']['nome'];
                delete p['nome'];

                if (l) {
                  for (const label of l) {
                    if (ct.indexOf(label) == -1) {
                      retorno.categorias.push({name: label});
                      ct.push(label);
                    }
                  }

                  p['categorias'] = l[0];
                } else {
                  p['categorias'] = 'Sem Categoria';
                }

                if (id.indexOf(p.id) == -1) {
                  retorno.dados.push(p);
                  id.push(p.id);
                }
              } else {
                if (n == 1 && no != null) {
                  c.dados = no['properties'];
                  c.name = no['type'] ? no['type'] : 'Sem Identificação';
                } else {
                  if (n == 2 && no != null) {
                    c.target = no['properties']['id'];
                  }
                }
              }

              if (c.name && c.target) {
                retorno.relacoes.push(c);
              }
            }
          }
        }

        resolve(retorno);
        driver.close();
      })
      .catch((e) => {
        sessao.close();
        reject(e);
        driver.close();
      });
  });
}
