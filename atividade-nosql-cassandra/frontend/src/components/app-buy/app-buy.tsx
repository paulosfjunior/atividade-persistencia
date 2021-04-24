import { Component, State, Element } from "@stencil/core";
import { ItemProvider, CartProvider } from "../../global/ServerProvider";
import { Pedido, Produto } from "../../interfaces"

@Component({
    tag: 'app-buy',
    styleUrl: 'app-buy.css'
})
export class appbuyComponent {
    @State() itemsProvider = new ItemProvider();
    @State() cartProvider = new CartProvider()
    @State() cartList: Pedido[] = []
    @State() itemsList: Produto[] = []
    @State() update = 0
    @Element() el: HTMLElement;

    constructor() {
        this.itemsProvider.getList().subscribe(list => {
            this.itemsList = list
        })
        this.cartProvider.getList().subscribe(list => {
            this.cartList = list
        })
    }
    componentDidLoad() { this.itemsProvider.updateList(); this.cartProvider.updateList() }
    render() {
        return [<div>
            <app-header name="Nova Compra" isCart={true} isHome={false}></app-header>
            <ion-header>

                <ion-toolbar>
                    <ion-title>Selecione os item que deseja comprar</ion-title>
                </ion-toolbar>
                {this.cartProvider.getEnableCart() ?
                    <ion-button onClick={() => { this.showModal(true); this.update++ }}><ion-icon name="cart"></ion-icon>ver Carrinho</ion-button>
                    :
                    <ion-button onClick={() => { this.cartProvider.newCart(); this.update++ }}><ion-icon name="cart"></ion-icon>Novo Carrinho</ion-button>}

            </ion-header>
            {this.cartProvider.getEnableCart() ?
                <ion-list>
                    {
                        this.itemsList.map(item => {
                            return <ion-item >
                                <div class="produto"><div style={{"width":"30vh"}}>{item.nome}</div>
                                    <div>
                                        qnt:<input type="number" value={item.quantidade?item.quantidade:1} onChange={(e:any)=>{item.quantidade = +(e.target.value);this.update++}}/>
                                    </div>
                                    <button class="Price B" onClick={() => { this.cartProvider.addItemToCart(item); this.update++ }} >{(item.preco * (item.quantidade?item.quantidade:(()=>{item.quantidade = 1;return 1})())).toFixed(2)}<br></br>Comprar</button>
                                </div>


                            </ion-item>
                        })
                    }
                </ion-list> : ""}
            <app-open-cart-modal onClose={() => { this.update++ }} cartProvider={this.cartProvider}></app-open-cart-modal>

        </div>
        ]
    }
    showModal(type: boolean) {
        if (type) {
            this.el.querySelector("app-open-cart-modal").open = true
        }
    }
}