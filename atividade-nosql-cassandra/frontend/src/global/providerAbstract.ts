import { Cliente, ClienteLogin, Produto, Pedido} from '../interfaces';
import { BehaviorSubject, Observable } from "rxjs";
import { DefaultRequest, DefaultRequestMethod } from "../helpers/utils";

export abstract class DefaultCustomerProvider {
    public list: BehaviorSubject<Cliente[]> = new BehaviorSubject([])

    public getList():Observable<Cliente[]>{
        return this.list.asObservable();
    }
    public getLastList(): Cliente[] {
        return this.list.getValue()
    }
    public abstract updateList(qtn?: number): void
    public abstract insert(customer: Cliente): void;
    public abstract edit(newcustomer: Cliente, oldCustomer: Cliente): void;
    public abstract remove(customer: Cliente): void;
    public abstract tryLogin(login:ClienteLogin): Promise<Cliente>;
    public request(method: DefaultRequestMethod, address: string, body: Object) {
        return DefaultRequest(method, address, body)
    }
}
export abstract class DefaultItemProvider {
    public list: BehaviorSubject<Produto[]> = new BehaviorSubject([])

    public getList():Observable<Produto[]>{
        return this.list.asObservable();
    }
    public getLastList(): Produto[] {
        return this.list.getValue()
    }
    public abstract updateList(qtn?: number): void;
    public abstract insert(customer: Produto): void;
    public abstract edit(newcustomer: Produto, oldCustomer: Produto): void;
    public abstract remove(customer: Produto): void;
    public request(method: DefaultRequestMethod, address: string, body: Object) {
        return DefaultRequest(method, address, body)
    }
}
export abstract class DefaultCartProvider {
    public list: BehaviorSubject<Pedido[]> = new BehaviorSubject([])

    public getList():Observable<Pedido[]>{
        return this.list.asObservable();
    }
    public getLastList(): Pedido[] {
        return this.list.getValue()
    }
    public abstract updateList(qtn?: number): void
    public abstract insert(customer: Pedido): void;
    public abstract edit(newcustomer: Pedido, oldCustomer: Pedido): void;
    public abstract remove(customer: Pedido): void;
    public abstract getEnableCart(): Pedido;
    public abstract newCart(): void;
    public abstract closeEnableCart(type: string): void;
    public abstract addItemToCart(item: Produto): void;
    public abstract removeItemFromCarrinho(itemCOd:Produto['id'])
    public request(method: DefaultRequestMethod, address: string, body: Object) {
        return DefaultRequest(method, address, body)
    }
}

