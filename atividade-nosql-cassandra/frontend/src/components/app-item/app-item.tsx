import { Component, State, Element } from '@stencil/core';
import { ItemProvider } from '../../global/ServerProvider';
import { Produto } from '../../interfaces';

@Component({
  tag: 'app-item',
  styleUrl: 'app-cadastro.css'
})
export class AppCadastroItem {
  @State() lista: Produto[];
  @State() provider = new ItemProvider();
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
  openModalCreate() {
    //@ts-ignore
    this.el.querySelector("#cad").open = true
  }
  render() {
    return [<div><app-header name="Cadastro de Itens" isHome={false}></app-header>
      <ion-button expand="full" onClick={() => { this.openModalCreate() }}>Novo Item</ion-button>
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
              <ion-card-subtitle>{row.preco}</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        })}
      </ion-list>
      <app-cadastro-item id="cad" onCreate={(e) => { this.provider.insert(e.detail.new); this.update++ }}></app-cadastro-item>
      <app-cadastro-item id="edit" onCreate={(e) => { this.provider.edit(e.detail.new); this.update++ }}></app-cadastro-item>
    </div>]
  }
  openEditModal(row: Produto) {
    //@ts-ignore
    this.el.querySelector("#edit").open = true
    //@ts-ignore
    this.el.querySelector("#edit").name = row.name
    //@ts-ignore
    this.el.querySelector("#edit").desc = row.desc
    //@ts-ignore
    this.el.querySelector("#edit").price = row.price
    //@ts-ignore
    this.el.querySelector("#edit").old = row
  }
}