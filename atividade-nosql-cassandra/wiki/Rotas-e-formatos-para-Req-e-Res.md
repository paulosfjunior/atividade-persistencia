# **Utilize o [POSTMAN](https://www.postman.com/) para executar as requisições abaixo**

# **Usuário**

## Criar Usuário

> ### **[localhost:8080/usuarios](localhost:8080/usuarios)**
>
> Enviar requisição conforme modelo abaixo via `POST`.

```json
{
  "usuario": "nomeUsuario",
  "nome": "Nome completo do Usuario",
  "endereco":
  {
    "endereco": "Endereco do usuario com o numero",
    "bairro": "Centro",
    "cidade": "Pompéia",
    "estado": "São Paulo",
    "pais": "Brasil",
    "cep": "17507-390"
  },
  "email": "emailusuairo@nosqlcassandra.com",
  "senha": "1234567890",
  "regra": "Administrador"
}
```

> Retorno para função de criar usuário será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": "Usuário nomeUsuario foi cadastrado."
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Usuário não cadastrado."
}
```

## Listar Usuários

> ### **[localhost:8080/usuarios](localhost:8080/usuarios)**
>
> Enviar requisição via `GET`.
>
> Retorno para função de listar usuários será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": [{
    "id": "aabeeca0-6ccf-11e9-99be-bd80270ea429",
    "email": "emailusuairo@nosqlcassandra.com",
    "endereco": {
      "endereco": "Endereco do usuario com o numero",
      "bairro": "Centro",
      "cidade": "Marilia",
      "pais": "Jardim Aquarius",
      "cep": "17507-390"
    },
    "hash": "1234567890",
    "nome": "Nome completo do Usuario",
    "regra": "Administrador",
    "salt": "0987654321",
    "usuario": "nomeUsuario"
  }]
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Não foi possivel carregar lista de usuários."
}
```

## Editar Usuário

> ### **[localhost:8080/usuarios/aabeeca0-6ccf-11e9-99be-bd80270ea429](localhost:8080/usuarios/aabeeca0-6ccf-11e9-99be-bd80270ea429)**
>
> Enviar requisição conforme modelo abaixo via `PUT`.

```json
{
  "usuario": "nomeUsuario",
  "nome": "Nome completo do Usuário",
  "endereco":
  {
    "endereco": "Endereço do usuário com o número",
    "bairro": "Jardim Aquarius",
    "cidade": "Marilia",
    "estado": "São Paulo",
    "pais": "Brasil",
    "cep": "17507-39"0
  },
  "email": "emailusuairo@nosqlcassandra.com.br",
  "senha": "1234567890",
  "regra": "Administrador"
}
```

> Retorno para função de editar usuário será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": "Usuário nomeUsuario foi alterado."
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Usuário não foi alterado."
}
```

## Deletar Usuário

> ### **[localhost:8080/usuarios/aabeeca0-6ccf-11e9-99be-bd80270ea429](localhost:8080/usuarios/aabeeca0-6ccf-11e9-99be-bd80270ea429)**
>
> Enviar requisição conforme modelo abaixo via `DELETE`.
>
> Retorno para função de deletar usuário será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": "Usuário aabeeca0-6ccf-11e9-99be-bd80270ea429 foi apagado."
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Usuário não foi apagado."
}
```

## Procurar Usuário

> ### **[localhost:8080/usuarios/aabeeca0-6ccf-11e9-99be-bd80270ea429](localhost:8080/usuarios/aabeeca0-6ccf-11e9-99be-bd80270ea429)**
>
> Enviar requisição conforme modelo abaixo via `GET`.
>
> Retorno para função de procurar usuário será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": [{
    "id": "aabeeca0-6ccf-11e9-99be-bd80270ea429",
    "email": "emailusuairo@nosqlcassandra.com.br",
    "endereco": {
      "endereco": "Endereço do usuário com o número",
      "bairro": "Jardim Aquarius",
      "cidade": "Marilia",
      "pais": "Brasil",
      "cep": "17507-390"
    },
    "hash": "1234567890",
    "nome": "Nome completo do Usuário",
    "regra": "Administrador",
    "salt": "0987654321",
    "usuario": "nomeUsuario"
  }]
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Usuário não encontrado."
}
```

## Autenticar Usuário

> ### **[localhost:8080/usuarios/autenticar](localhost:8080/usuarios/autenticar)**
>
> Enviar requisição conforme modelo abaixo via `POST`.

```json
{
  "usuario": "nomeUsuario",
  "senha": "1234567890"
}
```

> Retorno para função de autenticar usuário será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": true
}

OU

{
  "tipo": "sucesso",
  "mensagem": false
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Usuário não encontrado."
}
```

---
---

# **Produto**

## Criar Produto

> ### **[localhost:8080/produtos](localhost:8080/produtos)**
>
> Enviar requisição conforme modelo abaixo via `POST`.

```json
{
  "nome": "Açucar",
  "descricao": "Saco de açucar 5kg",
  "preco": "7.53"
}
```

> Retorno para função de criar produto será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": "Produto Açucar foi cadastrado."
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Produto não cadastrado."
}
```

## Listar Produtos

> ### **[localhost:8080/produtos](localhost:8080/produtos)**
>
> Enviar requisição via `GET`.
>
> Retorno para função de listar produtos será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": [{
    "id": "2c1caa90-6cd9-11e9-a14c-9545368f415d",
    "descricao": "Saco de açucar 5kg",
    "nome": "Açucar",
    "preco": 7.53000020980835
  }]
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Não foi possivel carregar lista de produtos."
}
```

## Editar Produto

> ### **[localhost:8080/produtos/2c1caa90-6cd9-11e9-a14c-9545368f415d](localhost:8080/produtos/2c1caa90-6cd9-11e9-a14c-9545368f415d)**
>
> Enviar requisição conforme modelo abaixo via `PUT`.

```json
{
  "nome": "Açucar",
  "descricao": "Saco de açucar 5kg",
  "preco": "7.84"
}
```

> Retorno para função de editar produto será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": "Produto Açucar foi alterado."
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Produto não foi alterado."
}
```

## Deletar Produto

> ### **[localhost:8080/produtos/2c1caa90-6cd9-11e9-a14c-9545368f415d](localhost:8080/produtos/2c1caa90-6cd9-11e9-a14c-9545368f415d)**
>
> Enviar requisição conforme modelo abaixo via `DELETE`.
>
> Retorno para função de deletar produto será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": "Produto 2c1caa90-6cd9-11e9-a14c-9545368f415d foi apagado."
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Produto não foi apagado."
}
```

## Procurar Produto

> ### **[localhost:8080/produtos/2c1caa90-6cd9-11e9-a14c-9545368f415d](localhost:8080/produtos/2c1caa90-6cd9-11e9-a14c-9545368f415d)**
>
> Enviar requisição conforme modelo abaixo via `GET`.
>
> Retorno para função de procurar produto será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": [{
    "id": "2c1caa90-6cd9-11e9-a14c-9545368f415d",
    "descricao": "Saco de açucar 5kg",
    "nome": "Açucar",
    "preco": 7.840000152587891
  }]
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Produto não encontrado."
}
```

---
---

# **Pedido**

## Criar Pedido

> ### **[localhost:8080/pedidos](localhost:8080/pedidos)**
>
> Enviar requisição conforme modelo abaixo via `POST`.

```json
{
  "cliente": {
    "id": "aabeeca0-6ccf-11e9-99be-bd80270ea429",
    "nome": "Nome completo do Usuário"
  },
  "data_pedido": "2019-05-02",
  "carrinho": [{
    "id": "2c1caa90-6cd9-11e9-a14c-9545368f415d",
    "produto": "Açucar",
    "valor_unitario": 7.53,
    "quantidade": 2,
    "valor_total": 15.06
  }],
  "valor_pedido": 15.06,
  "forma_pagamento": "A Vista",
  "status": "Aberto"
}
```

> Retorno para função de criar pedido será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": "Pedido cadastrado."
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Pedido não cadastrado."
}
```

## Listar Pedidos

> ### **[localhost:8080/pedidos](localhost:8080/pedidos)**
>
> Enviar requisição via `GET`.
>
> Retorno para função de listar pedidos será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": [{
    "id": "8f7a4270-6cdc-11e9-a14c-9545368f415d",
    "carrinho": [{
      "id": "2c1caa90-6cd9-11e9-a14c-9545368f415d",
      "produto": "Açucar",
      "valor_unitario": 7.53000020980835,
      "quantidade": 2,
      "valor_total": 15.0600004196167
    }],
    "cliente": {
      "id": "aabeeca0-6ccf-11e9-99be-bd80270ea429",
      "nome": "Nome completo do Usuário"
    },
    "data_pedido": "2019-05-02",
    "forma_pagamento": "A Vista",
    "valor_pedido": 15.0600004196167,
    "status": "Aberto"
  }]
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Não foi possivel carregar lista de pedidos."
}
```

## Editar Pedido

> ### **[localhost:8080/pedidos/8f7a4270-6cdc-11e9-a14c-9545368f415d](localhost:8080/pedidos/8f7a4270-6cdc-11e9-a14c-9545368f415d)**
>
> Enviar requisição conforme modelo abaixo via `PUT`.

```json
{
  "cliente": {
    "id": "aabeeca0-6ccf-11e9-99be-bd80270ea429",
    "nome": "Nome completo do Usuário"
  },
  "data_pedido": "2019-05-02",
  "carrinho": [{
    "id": "2c1caa90-6cd9-11e9-a14c-9545368f415d",
    "produto": "Açucar",
    "valor_unitario": 7.53,
    "quantidade": 2,
    "valor_total": 15.06
  }, {
    "id": "11c2d690-6cdb-11e9-a14c-9545368f415d",
    "produto": "Arroz",
    "valor_unitario": 16.34,
    "quantidade": 5,
    "valor_total": 81.70
  }],
  "valor_pedido": 96.76,
  "forma_pagamento": "A Vista",
  "status": "Aberto"
}
```

> Retorno para função de editar pedido será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": "Pedido 8f7a4270-6cdc-11e9-a14c-9545368f415d foi alterado."
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Pedido 8f7a4270-6cdc-11e9-a14c-9545368f415d não foi alterado."
}
```

## Deletar Pedido

> ### **[localhost:8080/pedidos/8f7a4270-6cdc-11e9-a14c-9545368f415d](localhost:8080/pedidos/8f7a4270-6cdc-11e9-a14c-9545368f415d)**
>
> Enviar requisição conforme modelo abaixo via `DELETE`.
>
> Retorno para função de deletar pedido será da seguinte forma.
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": "Pedido 8f7a4270-6cdc-11e9-a14c-9545368f415d foi apagado."
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Pedido 8f7a4270-6cdc-11e9-a14c-9545368f415d não foi apagado."
}
```

## Procurar Pedido

> ### **[localhost:8080/pedidos/8f7a4270-6cdc-11e9-a14c-9545368f415d](localhost:8080/pedidos/8f7a4270-6cdc-11e9-a14c-9545368f415d)**
>
> Enviar requisição conforme modelo abaixo via `GET`.
>
> Retorno para função de procurar pedido será da seguinte forma (Retorna apenas pedidos com o status *Aberto*).
>
> Sucesso

```json
{
  "tipo": "sucesso",
  "mensagem": [{
    "id": "8f7a4270-6cdc-11e9-a14c-9545368f415d",
    "carrinho": [{
      "id": "2c1caa90-6cd9-11e9-a14c-9545368f415d",
      "produto": "Açucar",
      "valor_unitario": 7.53000020980835,
      "quantidade": 2,
      "valor_total": 15.0600004196167
    }, {
      "id": "11c2d690-6cdb-11e9-a14c-9545368f415d",
      "produto": "Arroz",
      "valor_unitario": 16.34000015258789,
      "quantidade": 5,
      "valor_total": 81.69999694824219
    }],
    "cliente": {
      "id": "aabeeca0-6ccf-11e9-99be-bd80270ea429",
      "nome": "Nome completo do Usuário"
    },
    "data_pedido": "2019-05-02",
    "forma_pagamento": "A Vista",
    "valor_pedido": 96.76000213623047,
    "status": "Aberto"
  }]
}
```

> Erro

```json
{
  "tipo": "erro",
  "mensagem": "Pedido não encontrado."
}
```
