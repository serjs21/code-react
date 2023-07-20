import { faker } from '@faker-js/faker';
import { SingeItemType } from 'types';
import Items from '../items.store';
import ItemsStore from '../items.store';

const getMockItem = () : SingeItemType => ({
    id: faker.string.uuid(),
    title: faker.commerce.product(),
    price: faker.number.float(),
    descrption: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    image: faker.internet.avatar(),
    rating: {
        rate: faker.number.float({min: 0, max: 5}),
        count: faker.number.int(),
    }
});

const FETCH_RESULTS_SIZE = 5;

describe('Items', () => {
    let items: Items;
    
    beforeEach(() => {
        items = new Items();
        items.sendFetchRequest = jest.fn().mockImplementation(() => Promise.resolve(new Array(FETCH_RESULTS_SIZE).fill(null).map(getMockItem)));
    })

    describe('map', () => {
        it('should be calculated after items set', () => {
            const item1 = getMockItem();
            const item2 = getMockItem();
            item1.id = item1.id + '1';
            item2.id = item1.id + '2';
            expect(items.map[item1.id]).toBeUndefined();
            expect(items.map[item2.id]).toBeUndefined();
            expect(items.map).toEqual({});

            items.setItems([item1, item2]);

            expect(items.map[item1.id].title).toBe(item1.title);
            expect(items.map[item2.id].title).toBe(item2.title);;
        });
    });

    describe('fetch', () => {
        it('should initialize items data after the fetch', async () => {
            expect(items.list.length === 0);
            expect(items.isFeched).toBeFalsy();
            await items.fetch();
            expect(items.list.length === FETCH_RESULTS_SIZE);
            expect(items.isFeched).toBeTruthy();
            expect(items.fetchRequest).toBeUndefined();
        });

        it ('should set fetching to false even if the fetch fails', async () => {
            items.sendFetchRequest = async () => { throw new Error('mock error')};
            expect(items.list.length === 0);
            expect(items.isFeched).toBeFalsy();
            await items.fetch();
            expect(items.list.length === 0);
            expect(items.isFeched).toBeFalsy();
            expect(items.fetchRequest).toBeUndefined();
        });

        it('should return request promise if already fetching', async() => {
            expect(items.list.length === 0);
            expect(items.isFeched).toBeFalsy();
            const initialfetch = items.fetch();
            const repeatedFetch = items.fetch();
            expect(repeatedFetch).toBeInstanceOf(Promise);
            expect(items.sendFetchRequest).toBeCalledTimes(1);
            expect(initialfetch).toEqual(repeatedFetch);
        });

        it('should not refetch after successful fetch', async () => {
            expect(items.list.length === 0);
            expect(items.isFeched).toBeFalsy();
            const initialfetch = await items.fetch();
            expect(items.sendFetchRequest).toBeCalledTimes(1);
            const repeatedFetch = await items.fetch();
            expect(items.sendFetchRequest).toBeCalledTimes(1);
        })
    })

    describe('search', () => {
        it('should return ids of items if item title includes query or query equal to id', () => {
            const itemsList = [getMockItem(), getMockItem()];
            itemsList[0].id = 'id1';
            itemsList[0].title = 'abc_111';
            itemsList[1].id = 'id2';
            itemsList[1].title = 'xyz_111';
            expect(items.search('abc')).toEqual([]);
            expect(items.search('xyz')).toEqual([]);
            items.setItems(itemsList);
            expect(items.search('abc')).toEqual([itemsList[0].id]);
            expect(items.search('xyz')).toEqual([itemsList[1].id]);
            expect(items.search('111')).toContain(itemsList[0].id);
            expect(items.search('111')).toContain(itemsList[1].id);
            expect(items.search('222')).toEqual([]);
            expect(items.search(itemsList[0].id)).toEqual([itemsList[0].id]);
        })
    })
})