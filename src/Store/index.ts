import ItemsStore from "./items.store";
import CartStore, { CART_SESSION_KEY } from "./cart.store";
import { faker } from '@faker-js/faker';
import { autorun } from "mobx";

export interface Store { 
    items: ItemsStore, 
    cart: CartStore 
}

const initStore = (): Store => {
    const itemsStore = new ItemsStore();
    const cartStore = new CartStore();

    return { 
        items: itemsStore, 
        cart: cartStore 
    }
}

const store = initStore();
autorun(() => {
    window?.sessionStorage.setItem(CART_SESSION_KEY, JSON.stringify(store.cart.addedItems))
})

export default store;
