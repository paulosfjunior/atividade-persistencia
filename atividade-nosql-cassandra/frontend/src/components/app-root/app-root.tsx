import { Component } from '@stencil/core';
import { Cliente } from '../../interfaces';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {
  loggedUser:Cliente
  constructor(){
    this.loggedUser = JSON.parse(localStorage.getItem("loggedUser"))
    // console.log(localStorage.getItem("loggedUser"))
  }
  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
        {!this.loggedUser?
          <ion-route url="/" component="app-login" /> :[
          <ion-route url="/" component="app-home" />,
          <ion-route url="/buy" component="app-buy"/>,
          this.loggedUser.cargo =="Administrador"?<ion-route url="/customer" component="app-customer" />:"",
          this.loggedUser.cargo =="Administrador"?<ion-route url="/item" component="app-item" />:""]}
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
