import { ItemType } from "antd/es/breadcrumb/Breadcrumb";

export interface SingeItemType {
    id: string;
    title: string;
    price: number;
    descrption?: string;
    category?: string;
    image?: string;
    rating?: {
        rate: number;
        count: number;
    }
}

export interface CartItemType {
    id: string,
    count: number,
}

export type Field = keyof Omit<SingeItemType, "rating"> | "quantity" | "totalCost";
