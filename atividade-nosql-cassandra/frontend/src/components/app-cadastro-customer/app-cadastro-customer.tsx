import { Component, Prop, Event, EventEmitter, Watch } from '@stencil/core';
import { Cliente, Endereco } from '../../interfaces';


@Component({
    tag: 'app-cadastro-customer',
    styleUrl: 'app-cadastro.css'
})
export class AppCadastroCustomer {
    @Prop({ mutable: true }) old: Cliente;
    @Prop({ mutable: true }) name: string;
    @Prop({ mutable: true }) user: string;
    @Prop({ mutable: true }) placeholders = { name: null, };
    @Prop({ mutable: true }) endereco: Endereco = { endereco: "", "bairro": "", "cep": "", "cidade": "", "pais": "" };
    @Prop({ mutable: true }) email: string;
    @Prop({ mutable: true }) pass: string;
    @Prop({ mutable: true }) open: boolean = false;
    @Prop({ mutable: true }) rule: string

    @Event() create: EventEmitter<{ new: Cliente, old: Cliente }>;
    constructor() {
    }
    @Watch("old") 
    handler(nv:Cliente){
        this.name = nv.nome
        this.user = nv.usuario
        this.endereco = nv.endereco
        this.email = nv.email
        console.log(nv.cargo)
        //@ts-ignore
        this.rule = nv.cargo
    }
    
    render() {
        return [
            <div style={{ "display": this.open ? "block" : "none" }} id="myModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <span onClick={() => { this.open = false }} class="close">&times;</span>
                        <h2>{this.old ? "Editar" : "Cadastro"} de Cliente</h2>
                    </div>
                    <div class="modal-body">
                        <ion-item-group>
                            <ion-item>
                                <ion-input type="text" value={this.name} onInput={(e: any) => { this.name = e.target.value }} placeholder="nome do Cliente..."></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-input type="text" value={this.endereco.endereco} onInput={(e: any) => { this.endereco.endereco = e.target.value }} placeholder="Endereço do Cliente..."></ion-input>
                                <ion-input type="text" value={this.endereco.bairro} onInput={(e: any) => { this.endereco.bairro = e.target.value }} placeholder="Bairro do Cliente..."></ion-input>
                                <ion-input type="text" value={this.endereco.cidade} onInput={(e: any) => { this.endereco.cidade = e.target.value }} placeholder="Cidade do Cliente..."></ion-input>
                                <ion-input type="text" value={this.endereco.pais} onInput={(e: any) => { this.endereco.pais = e.target.value }} placeholder="Pais do Cliente..."></ion-input>
                                <ion-input type="text" value={this.endereco.cep} onInput={(e: any) => { this.endereco.cep = e.target.value }} placeholder="Cep do Cliente..."></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-input type="text" value={this.email} onInput={(e: any) => { this.email = e.target.value }} placeholder="Email do Cliente..."></ion-input>
                                <ion-input type="text" value={this.user} onInput={(e: any) => { this.user = e.target.value }} placeholder="Login do Cliente..."></ion-input>
                                {!this.old? <ion-input type="text" value={this.pass} onInput={(e: any) => { this.pass = e.target.value }} placeholder="Senha do Cliente..."></ion-input>:""}
                            </ion-item>
                            <ion-list>
                                <ion-radio-group>
                                    <ion-list-header>
                                        <ion-label>Cargo</ion-label>
                                    </ion-list-header>

                                    <ion-item>
                                        <ion-label>Administrador</ion-label>
                                        <ion-radio checked={this.rule == "Administrador"} onClick={(e: any) => { this.rule = e.target.value }} slot="start" value="Administrador"></ion-radio>
                                    </ion-item>

                                    <ion-item>
                                        <ion-label>Normal</ion-label>
                                        <ion-radio checked={this.rule == "Usuario"} onClick={(e: any) => { this.rule = e.target.value }} slot="start" value="Usuario"></ion-radio>
                                    </ion-item>
                                </ion-radio-group>
                            </ion-list>
                            <br></br>
                            <br></br>
                        </ion-item-group>
                        <ion-button onClick={() => { this.create.emit({ new: {id:this.old?this.old.id:null, endereco: this.endereco, email: this.email, nome: this.name, salt: this.pass, cargo: this.rule, usuario: this.user, hash: null,senha:this.pass }, old: this.old }); this.open = false }} expand="full">{this.old ? "Editar" : "Cadastrar"}</ion-button>
                    </div>
                </div>

            </div>
        ];
    }

}
