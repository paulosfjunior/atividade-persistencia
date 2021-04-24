import { Component, Prop } from '@stencil/core';
import { TokenController, ClienteController } from '../../helpers/utils';
import { CustomerProvider } from '../../global/ServerProvider';

@Component({
  tag: 'app-header',
  styleUrl: 'app-header.css'
})
export class AppHeader {

  @Prop() name: string;
  @Prop({ mutable: true }) isHome: boolean;
  @Prop({ mutable: true }) isCart: boolean;
  @Prop({ mutable: true }) clienteProvider = new CustomerProvider();
  logOff() {
    this.clienteProvider.logOut().then(()=>{
    TokenController.remove();
    ClienteController.remove();
    window.location.assign("/")
  })
  }
  render() {
    console.log(this.isHome)
    return [
      <ion-header>
        <ion-toolbar color="dark">
          {!this.isHome ?
            <ion-buttons slot="start">
              <ion-back-button defaultHref="/" />
            </ion-buttons> : ''
          }<ion-row>
          <ion-title>{this.name}</ion-title>
          {this.isCart?"":<div class="cart"><ion-button href="/buy"><ion-icon name="cart"></ion-icon></ion-button></div>}
          <div><ion-button color="danger" onClick={()=>{this.logOff()}}><ion-icon name="log-out"></ion-icon></ion-button></div>
          </ion-row>
        </ion-toolbar>
      </ion-header>,

    ];
  }
}
