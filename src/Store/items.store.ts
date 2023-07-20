import { tr } from "@faker-js/faker";
import Item from "antd/es/list/Item";
import { makeObservable, observable, action, computed } from "mobx";
import { SingeItemType } from "types";


const ITEMS_URL = 'https://mocki.io/v1/9f345655-d334-4ac6-adc8-e44e53272e1f';

class ItemsStore {
    isFeched: boolean = false;
    fetchRequest?: Promise<any>;
    list: SingleItem[] = [];

    constructor() {
        makeObservable(this,{
            map: computed,
            isFeched: observable,
            setIsFetched: action,
            setItems: action,
            idsList: computed,
        });
    }

    get map(): {[id: string]: SingleItem } {
        return this.list.reduce((map: {[id: string]: SingleItem }, item: SingleItem) => Object.assign(map, {[item.id]: item}), {});
    }

    get idsList(): string[] {
        return this.list.map(item => item.id);
    }

    setIsFetched(value: boolean): void {
        this.isFeched = value;
    }

    setItems(items: SingeItemType[]): void {
        this.list = items.map(item => new SingleItem(item));
    }

    async sendFetchRequest(): Promise<SingeItemType[]> {
        const response = await fetch(ITEMS_URL);
        return await response.json();
    };

    async fetch(): Promise<boolean> {
        if (this.fetchRequest) {
           return this.fetchRequest;
        }
        
        if (this.isFeched) {
            return true;
        }

        try {
            this.fetchRequest = this.sendFetchRequest();
            const items = await this.fetchRequest;
            this.setItems(items);
            this.setIsFetched(true);
            return true
        } catch (e) {
            console.error(e)
            return false
        } finally {
            this.fetchRequest = undefined;
        }
    }

    search(_query: string): string[] {
        const query = _query.toLocaleLowerCase();
        return this.list
        .filter(item => item.id.toLocaleLowerCase() === query || item.title.toLocaleLowerCase().includes(query))
        .map(item => item.id);
    }
}

export class SingleItem implements SingeItemType {
    id: string = '';
    title: string = '';
    price: number = 0;
    descrption?: string;
    category?: string;
    image?: string;
    rating?: {
        rate: number;
        count: number;
    }

    constructor(_item: SingeItemType) {
        Object.assign(this, _item)
    }
}

export default ItemsStore;