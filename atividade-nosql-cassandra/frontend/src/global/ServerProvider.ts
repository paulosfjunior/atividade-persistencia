import { DefaultCustomerProvider, DefaultItemProvider, DefaultCartProvider } from "./providerAbstract";
import { DefaultRequestMethod, ClienteController, TokenController } from '../helpers/utils';
import { ClienteLogin, Pedido, Produto, Cliente, tryLoginReturn } from '../interfaces';

const { GET, POST, PUT, DELETE } = DefaultRequestMethod;

export class CustomerProvider extends DefaultCustomerProvider {
  async updateList() {
    const res = await this.request(GET, '/usuarios', {});
    console.log("res: " + res)
    this.list.next(res.resultado)
  }
  async insert(item: Cliente) {
    const res = await this.request(POST, '/usuarios', item);
    this.list.next(res.resultado)
  }
  async edit(itemEdit: Cliente) {
    const res = await this.request(PUT, '/usuarios/' + itemEdit.id, itemEdit);
    this.list.next(res.resultado)
  }
  async remove(item: Cliente) {
    const res = await this.request(DELETE, '/usuarios/' + item.id, item);
    this.list.next(res.resultado)
  }
  async logOut(){
    const res = await this.request(POST, '/logout', {});
    return res
  }
  async tryLogin(login: ClienteLogin) {
    const res = await this.request(POST, '/usuarios/autenticar', login);
    const tokenDecode = this.parseJwt(res.token)
    const newCliente: Cliente = {
      id: tokenDecode.id,
      nome: tokenDecode.nome,
      cargo: tokenDecode.cargo,
      email: tokenDecode.email,
      endereco: tokenDecode.endereco,
      refresh_tolken: tokenDecode.refreshToken,
      usuario: tokenDecode.usuario
    }
    ClienteController.set(newCliente)
    TokenController.set(res.token)

    return await res
  }
  parseJwt(token): tryLoginReturn {
    var base64Url = token.split('.')[1];
    var base64 = decodeURIComponent(atob(base64Url).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(base64);
  };
}

export class ItemProvider extends DefaultItemProvider {
  async updateList() {
    const res = await this.request(GET, '/produtos', {});
    this.list.next(res.resultado);

  }
  async insert(item: Produto) {
    const res = await this.request(POST, '/produtos', item);
    this.list.next(res.resultado)
  }
  async edit(itemEdit: Produto) {
    const res = await this.request(PUT, '/produtos/' + itemEdit.id, itemEdit);
    this.list.next(res.resultado)
  }
  async remove(item: Produto) {
    const res = await this.request(DELETE, '/produtos/' + item.id, item);
    this.list.next(res.resultado)
  }
}

export class CartProvider extends DefaultCartProvider {
  async updateList() {
    const res = await this.request(GET, '/pedidos', {});
    this.list.next(res.resultado)
  }
  async insert(item: Pedido) {
    const res = await this.request(POST, '/pedidos', item);
    this.list.next(res.resultado)
  }
  async edit(itemEdit: Pedido) {
    const res = await this.request(PUT, '/pedidos/' + itemEdit.id, itemEdit);
    this.list.next(res.resultado)
  }
  async remove(item: Pedido) {
    const res = await this.request(DELETE, '/pedidos', item);
    this.list.next(res.resultado)
  }
  getEnableCart() {
    return this.list.getValue().find(row => {
      return row.status == "não Pago" && row.cliente.id == ClienteController.get().id
    })
  }
  async newCart() {
    const loggedUser = ClienteController.get()
    const newCart: Pedido = { status: "não Pago", carrinho: [], cliente: loggedUser, data_pedido: new Date(), valor_pedido: 0, forma_pagamento: "" }
    this.insert(newCart);
  }
  async closeEnableCart(type) {
    let item = await this.getEnableCart()
    item.status = "Pago"
    item.forma_pagamento = type;

    await this.edit(item)
  }
  async addItemToCart(item: Produto) {
    let pedido = await this.getEnableCart()
    if (pedido.carrinho) {
      const repeatId = pedido.carrinho.findIndex(row => {
        return row.id == item.id
      })
      if (repeatId != -1) {
        pedido.carrinho[repeatId].quantidade = pedido.carrinho[repeatId].quantidade + item.quantidade
        console.log(pedido.carrinho[repeatId].quantidade)
        pedido.carrinho[repeatId].valor_total = pedido.carrinho[repeatId].valor_unitario * +(pedido.carrinho[repeatId].quantidade)
      }
      else {
        pedido.carrinho.push({ "id": item.id, "produto": item.nome, "quantidade": item.quantidade, "valor_total": (item.preco * item.quantidade), "valor_unitario": item.preco })
      }
      pedido.valor_pedido = pedido.carrinho.reduce((cout, row) => {
        return row.valor_total + cout
      }, 0)
    }
    else {
      pedido.carrinho = [({ "id": item.id, "produto": item.nome, "quantidade": item.quantidade, "valor_total": (item.preco * item.quantidade), "valor_unitario": item.preco })]
      pedido.valor_pedido = (item.quantidade * item.preco)
    }
    await this.edit(pedido)
  }
  async removeItemFromCarrinho(item: Produto['id']) {
    let pedido = await this.getEnableCart();
    pedido.carrinho = pedido.carrinho.filter(row => {
      return row.id != item
    })
    pedido.valor_pedido = pedido.carrinho.reduce((cout, row) => {
      return row.valor_total + cout
    }, 0)
    await this.edit(pedido)
  }
}