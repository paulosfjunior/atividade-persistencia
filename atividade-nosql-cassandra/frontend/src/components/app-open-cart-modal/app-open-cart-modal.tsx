import { Component, Prop, Element, Event, EventEmitter, Listen } from "@stencil/core";
import { CartProvider } from "../../global/ServerProvider";

@Component({
    tag: "app-open-cart-modal",
    styleUrl: "app-open-cart-modal.css"
})
export class appOpenCartModal {
    @Prop({ mutable: true }) open = false
    @Prop({ mutable: true }) cartProvider: CartProvider = null
    @Prop({mutable:true}) update = 0
    @Element() el: HTMLElement;
    @Event() close: EventEmitter
    componentDidLoad() {
        this.el.querySelector("span").onclick = () => { this.close.emit() }
    }
    endCart(type) {
        this.cartProvider.closeEnableCart(type);
        this.close.emit()
    }
    @Listen("close")
    onCloseHandler() {
        this.open = false
    }
    render() {
        return [<div style={{ "display": this.open ? "block" : "none" }} id="myModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                {this.cartProvider.getEnableCart() ? [this.cartProvider.getEnableCart()].map(cart => {
                    return [
                        <div>
                            <h1>{(() => {return cart.cliente.nome })()}</h1>

                            {cart.carrinho && cart.carrinho.length ? cart.carrinho.map(cartItem => {
                                return <ion-item>{cartItem.produto +" ("+cartItem.quantidade+")" }<div class="cartItemPrice">{cartItem.valor_total}</div><button onClick={()=>{this.cartProvider.removeItemFromCarrinho(cartItem.id);this.update++}}><ion-icon name="trash"></ion-icon></button></ion-item>
                            })
                                : <h4 class="emptyCart">Carrinho vazio</h4>}
                            {this.cartProvider.getEnableCart().carrinho && this.cartProvider.getEnableCart().carrinho.length?<div>
                                <div class="dropdown">
                                    <ion-button id="endCart">Finalizar Compra (R${this.cartProvider.getEnableCart().valor_pedido})</ion-button>
                                    <div class="dropdown-content">
                                    <ion-button expand="full" class="Credito" color="danger" onClick={() => { this.endCart("Credito") }}>Credito</ion-button>
                                    <ion-button expand="full" class="Debito" color="danger" onClick={() => { this.endCart("Debito") }}>Debito</ion-button>
                                    <ion-button expand="full" class="A vista" color="danger" onClick={() => { this.endCart("A vista") }}>A Vista</ion-button>
                                    <ion-button expand="full" class="Boleto Bancario" color="danger" onClick={() => { this.endCart("Boleto Bancario") }}>Boleto Bancario</ion-button>
                                    
                                    </div>
                                </div>
                                </div>
                            
                            : ""}

                        </div>
                    ]
                }) : ""}
            </div>

        </div>]
    }
}