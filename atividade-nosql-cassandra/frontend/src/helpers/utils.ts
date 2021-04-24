import { Cliente } from '../interfaces';

export var API_LINK = "http://10.64.206.50:8080"
export var CLIENT_ID = "00000001"

export async function DefaultRequest(method: DefaultRequestMethod, address: string, body: Object) {
    try {
        const token = TokenController.get();
        let rec = {
            headers: { 'Content-Type': 'application/json', 'Authorization': `bearer ${token}` },
            method: method,

            body: JSON.stringify(body)
        }
        if(!TokenController.get()){
            delete rec.headers['Authorization']
        }
        if (method == DefaultRequestMethod.GET){delete rec['body'];delete rec['credentials']}
        console.log(rec)
        //@ts-ignore
        const res = await fetch(`${API_LINK}${address}`, rec);
        return await res.json();
    } catch (err) {
        throw err;
    }
}

export class ClienteController {
    static TokenKey: string = "loggedUser";
    static get(): Cliente {
        return JSON.parse(localStorage.getItem(this.TokenKey))
    }
    static set(newToken: Cliente) {
        localStorage.setItem(this.TokenKey, JSON.stringify(newToken))
    }
    static remove() {
        localStorage.removeItem(this.TokenKey)
    }
}
export class TokenController {
    static TokenKey: string = "token";
    static get(): string {
        return localStorage.getItem(this.TokenKey)
    }
    static set(newToken: string) {
        localStorage.setItem(this.TokenKey, newToken)
    }
    static remove() {
        localStorage.removeItem(this.TokenKey)
    }
}

export enum DefaultRequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
