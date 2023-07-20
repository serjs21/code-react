import { makeObservable, observable, action, computed } from "mobx";

export const CART_SESSION_KEY = 'cartSession';

class CartStore {
    addedItems: { [id: string]: number } = {};

    constructor() {
        makeObservable(this, {
            addedItems: observable,
            totalCount: computed,
            addItem: action,
            removeItem: action,
            emptyCart: action,
        });

        const sessionStorage = window.sessionStorage.getItem(CART_SESSION_KEY);

        if (sessionStorage) {
            try {
                const parsedValue = JSON.parse(sessionStorage);
                console.log('JSON.parse(sessionStorage)', parsedValue);
                this.addedItems = parsedValue;
            } catch {
                window.sessionStorage.removeItem(CART_SESSION_KEY);
            }
        }
    }

    get totalCount(): number {
        return Object.values(this.addedItems).reduce((sum, item) => item + sum, 0);
    }

    addItem(id: string, count: number = 1): void {
        this.addedItems[id] = (this.addedItems[id] || 0) + count;
    }

    removeItem(id: string, count?: number): void {
        if (!this.addedItems[id]) return;
        if (!count) {
            delete this.addedItems[id];    
            return;
        }
        this.addedItems[id] = (this.addedItems[id] || 0) - count;
        if (this.addedItems[id] === 0) delete this.addedItems[id];
    }

    emptyCart() {
        this.addedItems = {};
    }

    async sendRequest() {
        console.log('send request', JSON.stringify(this.addedItems, null, 2));
        return true;
    }

    async submitRequest() {
        try {
            await this.sendRequest();
            this.emptyCart();
        } catch (e) {
            console.error(e);
        }
    }
}

export default CartStore;