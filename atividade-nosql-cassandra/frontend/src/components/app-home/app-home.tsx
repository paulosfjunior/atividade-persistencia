import { Component, Element, State } from '@stencil/core';
import "@ionic/core"
import { ItemProvider, CartProvider } from '../../global/ServerProvider';
import { Pedido, Produto } from '../../interfaces';
import { ClienteController } from '../../helpers/utils';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {
  @Element() el;
  @State() cartsProvider = new CartProvider();
  @State() itemsProvider = new ItemProvider();
  @State() cartList: Pedido[] = [];
  @State() itemList: Produto[] = []
  componentDidLoad() {
    this.cartsProvider.updateList()
    this.itemsProvider.updateList()
  }
  constructor() {
    this.itemsProvider.getList().subscribe(list => {
      this.itemList = list
    })
    this.cartsProvider.getList().subscribe(list => {
      this.cartList = list
    })
  }



  render() {
    return [
      <app-header name="MERCADINHO DE TUDO" isHome={true}></app-header>,
      <ion-content padding>

        <ion-list>
          <ion-item-divider>
            <h2>Compras realizadas</h2>
          </ion-item-divider>
          {this.cartList.map(row => {
            if (row.cliente.id == ClienteController.get().id && row.status == "Pago") {
              return [
                <ion-card padding>
                  <ion-card-title>{row.cliente.nome}</ion-card-title>
                  <ion-card-subtitle>R$:{row.valor_pedido}<br></br>{new Date(row.data_pedido).toUTCString().split("00:")[0]}</ion-card-subtitle>
                  {row.carrinho.map(cartItem => {
                    return <div><br></br><ion-item>{cartItem.produto}<div class="cartItemPrice">{(cartItem.valor_total).toFixed(2)}</div></ion-item></div>
                  })}

                </ion-card>
              ]
            }

          }
          )}
        </ion-list>
      </ion-content>,
      <ion-footer><app-fab></app-fab></ion-footer>
    ];
  }
}
