import CartStore, { CART_SESSION_KEY } from "Store/cart.store";

describe('CartStore', () => {
    let cartStore: CartStore;

    beforeEach(() => {
        cartStore = new CartStore();
    })

    describe('addItem', () => {
        it('should create a new entry if item does not exist', () => {
            const id1 = 'id1';
            const count1 = 1;
            const id2 = 'id2';
            const count2 = 5;
            expect(cartStore.addedItems[id1]).toBeUndefined();
            expect(cartStore.addedItems[id2]).toBeUndefined();
            cartStore.addItem(id1, count1)
            expect(cartStore.addedItems[id1]).toEqual(count1);
            expect(cartStore.addedItems[id2]).toBeUndefined();
            cartStore.addItem(id2, count2);
            expect(cartStore.addedItems[id1]).toEqual(count1);
            expect(cartStore.addedItems[id2]).toEqual(count2);
        });

        it('should add count to existing entries', () => {
            const id1 = 'id1';
            const count1 = 4;
            const count2 = 11;
            expect(cartStore.addedItems[id1]).toBeUndefined();
            cartStore.addItem(id1, count1)
            expect(cartStore.addedItems[id1]).toEqual(count1);
            cartStore.addItem(id1, count2);
            expect(cartStore.addedItems[id1]).toEqual(count1 + count2);
        });
    })

    describe('removeItem', () => {
        const id1 = 'id1';
        const id2 = 'id2';
        const count1 = 3;
        const count2 = 8;

        beforeEach(() => {
            cartStore.addItem(id1, count1);
            cartStore.addItem(id2, count2);
        })

        it('should do nothing if item does not exist', () => {
            const initialState = Object.entries(cartStore.addedItems);
            cartStore.removeItem('non-existing-id');
            expect(initialState).toEqual(Object.entries(cartStore.addedItems));
        });

        it('should remove specified quantity if passed', () => {
            expect(cartStore.addedItems[id1]).toEqual(count1);
            expect(cartStore.addedItems[id2]).toEqual(count2);
            cartStore.removeItem(id1, 1);
            expect(cartStore.addedItems[id1]).toEqual(count1 - 1);
            expect(cartStore.addedItems[id2]).toEqual(count2);
            cartStore.removeItem(id1, 1);
            expect(cartStore.addedItems[id1]).toEqual(count1 - 2);
            expect(cartStore.addedItems[id2]).toEqual(count2);
            cartStore.removeItem(id1, 1);
            expect(cartStore.addedItems[id1]).toBeUndefined;
            expect(cartStore.addedItems[id2]).toEqual(count2);
        });

        it('should remove all items of type if quantity not specified', () => {
            const id = 'id';
            const count = 3;
            cartStore.addItem(id, count);
            expect(cartStore.addedItems[id]).toEqual(count);
            expect(cartStore.addedItems[id2]).toEqual(count2);
            cartStore.removeItem(id);
            expect(cartStore.addedItems[id]).toBeUndefined;
            expect(cartStore.addedItems[id2]).toEqual(count2);
        });
    })

    describe('emptyCart', () => {
        it('should remove all items from cart', () => {
            const id1 = 'id1';
            const count1 = 1;
            const id2 = 'id2';
            const count2 = 5;
            cartStore.addItem(id1, count1)
            cartStore.addItem(id2, count2);
            expect(cartStore.totalCount).not.toEqual(0);
            cartStore.emptyCart();
            expect(cartStore.totalCount).toEqual(0);
        })
    })

    describe('totalCount', () => {
        it('should return sum of all added items', () => {
            const itemCount1 = 1;
            const itemCount2 = 3;
            const itemCount3 = 12;
            expect(cartStore.totalCount).toEqual(0);
            cartStore.addItem('id1', itemCount1);
            expect(cartStore.totalCount).toEqual(itemCount1);
            cartStore.addItem('id2', itemCount2);
            expect(cartStore.totalCount).toEqual(itemCount1 + itemCount2);
            cartStore.addItem('id3', itemCount3);
            expect(cartStore.totalCount).toEqual(itemCount1 + itemCount2 + itemCount3);
            cartStore.removeItem('id3');
            expect(cartStore.totalCount).toEqual(itemCount1 + itemCount2);
            cartStore.removeItem('id2', 1);
            expect(cartStore.totalCount).toEqual(itemCount1 + itemCount2 - 1);
            cartStore.emptyCart();
            expect(cartStore.totalCount).toEqual(0);
        });
    })

    describe('session storage', () => {
        let sessionStorageSpy: jest.MockInstance<any, any> = jest.fn();
        let windowSpy: jest.MockInstance<any, any>;
        let removeSpy: jest.MockInstance<any, any> = jest.fn();
        
        beforeEach(() => {
            windowSpy = jest.spyOn(window, "window", "get");
            windowSpy.mockImplementation(() => ({
                sessionStorage: {
                    getItem: sessionStorageSpy,
                    removeItem: removeSpy, 
                }
            }))
        })
          
          afterEach(() => {
            windowSpy.mockRestore();
            sessionStorageSpy.mockReset();
          });

        it('should not crash if storage value can not be parsed', () => {
            const sessionValue = '{{dfasdf }{}';
            sessionStorageSpy.mockImplementation(() => sessionValue);
            const newStore = new CartStore();
            expect(removeSpy).toBeCalledWith(CART_SESSION_KEY)
            expect(newStore.addedItems).toEqual({});
        })

        it('should init the state from session storage if it exists', () => {
            const sessionValue = {'id1': 4};
            expect(cartStore.addedItems).toEqual({});
            sessionStorageSpy.mockImplementation(() => JSON.stringify(sessionValue));
            const newStore = new CartStore();
            expect(newStore.addedItems).toEqual(sessionValue);
        });
    }) 
})