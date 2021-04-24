import { Component, State, Element } from '@stencil/core';
import { CustomerProvider } from '../../global/ServerProvider';
import { Cliente } from '../../interfaces';

@Component({
  tag: 'app-customer',
  styleUrl: 'app-cadastro.css'
})
export class AppCadastroCustomer {
  @State() lista: Cliente[];
  @State() provider = new CustomerProvider();
  @State() update: number = 0
  @Element() el: HTMLElement;

  constructor() {
    this.provider.getList().subscribe(list =>{
      this.lista = list
    })
  }
  componentDidLoad() {
    this.provider.updateList()
  }
  opemModalCreate() {
    //@ts-ignore
    this.el.querySelector("#cad").open = true
  }
  render() {
    return [<div><app-header name="Cadastro de Clientes" isHome={false}></app-header>
      <ion-button expand="full" onClick={() => { this.opemModalCreate() }}>Novo Cliente</ion-button>
      <ion-list>
        {this.lista.map(row => {
          return <ion-card>
            <ion-card-header>
              <ion-card-title>
                <ion-row>
                  {row.nome}
                  <div class="right">
                    <ion-button onClick={() => { this.provider.remove(row); this.update++ }}><ion-icon name="trash"></ion-icon></ion-button>
                    <ion-button onClick={() => { this.openEditModal(row); this.update++ }}><ion-icon name="create"></ion-icon></ion-button>
                  </div>
                </ion-row>
              </ion-card-title>
              <ion-card-subtitle>{row.email}</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        })}
      </ion-list>
      <app-cadastro-customer id="cad" onCreate={(e) => { this.provider.insert(e.detail.new); this.update++ }}></app-cadastro-customer>
      <app-cadastro-customer id="edit" onCreate={(e) => { this.provider.edit(e.detail.new); this.update++ }}></app-cadastro-customer>
    </div>]
  }
  openEditModal(row: Cliente) {
    //@ts-ignore
    this.el.querySelector("#edit").open = true
    //@ts-ignore
    this.el.querySelector("#edit").name = row.name
    //@ts-ignore
    this.el.querySelector("#edit").pass = row.pass
    //@ts-ignore
    this.el.querySelector("#edit").email = row.email
    //@ts-ignore
    this.el.querySelector("#edit").address = row.address
    //@ts-ignore
    this.el.querySelector("#edit").rule = row.rule
    //@ts-ignore
    this.el.querySelector("#edit").old = row
  }
}