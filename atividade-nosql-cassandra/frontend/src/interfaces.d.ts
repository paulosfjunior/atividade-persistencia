export namespace oldIntrefaces {
    export interface Customer {
        id?: any;
        name: string
        address: string;
        email: string;
        pass: string;
        role: "Administrador" | "Usuario"
    }
    export interface Item {
        id?: any
        name: string;
        desc: string;
        price: string;
    }
    export interface Cart {
        payment?: string;
        customer: CustomerCart;
        items: Item[]
        enable: boolean
    }
    type CustomerCart = { id: Customer['id'], name: Customer['name'] }
    type CustomerLogged = { id: Customer['id'], name: Customer['name'], token: string }
}

export interface tryLoginReturn {
    usuario:string
    cargo: string
    email: string
    exp: number
    iat: number
    id: string
    endereco:Endereco
    nome: string
    refreshToken: string
}
export interface Cliente {
    id?: string;
    usuario: string;
    nome: string;
    endereco: Endereco;
    email: string;
    cargo: string;
    hash?: string;
    salt?: string;
    refresh_tolken?: string;
    senha?:string;
}
export type ClienteLogin = { usuario: Cliente['usuario'], senha: string }
export interface Endereco {
    endereco: string;
    bairro: string;
    cidade: string;
    pais: string;
    cep: string
}
export interface Produto {
    id?: any;
    nome: string;
    descricao: string;
    preco: number;
    quantidade?: number;
}
export type itemCarrinho = { id?: Produto['id'], produto: Produto['descricao'], valor_unitario: Produto['preco'], quantidade: number, valor_total: Produto['preco'] }
export type clientePedido = { id?: Cliente['id'], nome: Cliente['nome'] }
export interface Pedido {
    id?: any;
    cliente: clientePedido;
    data_pedido: Date;
    carrinho: itemCarrinho[];
    valor_pedido: number;
    forma_pagamento: string;
    status: string

}
