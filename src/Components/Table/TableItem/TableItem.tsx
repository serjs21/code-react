import { observer } from "mobx-react";
import React, { ReactElement } from "react";
import store from "Store";
import styles from './TableItem.module.css';
import { Field } from "types";
import AddToCartButton from "Components/AddToCartButton/AddToCartButton";


export interface Props {
    id: string;
    className?: string;
    fields: Field[];
    actionButton?: React.ReactElement;
}

const TableItem = ({ id, className = '', fields, actionButton }: Props) => {
    const itemData = store.items.map[id];

    if (!itemData) {
        return null;
    }


    const fieldValue = (field: Field) => {
        if (field === 'quantity') return <AddToCartButton id={id} nullable />
        if (field === 'totalCost') return `$${(store.cart.addedItems[id] || 0) * itemData.price}`;
        return `${field === 'price' ? '$': ''}${itemData[field]}`
    }
    
    return <div className={`${styles.container} ${className}`}>
        <div className={`${styles.field} ${styles.imageCointainer}`}>
            <img src={itemData.image} className={styles.image}/>
        </div>
        {fields.map(field =>
        <div className={styles.field} key={`${field}_${id}`}><span className={styles.text}>{fieldValue(field)}</span></div>)}
        {!!actionButton && <div className={`${styles.field} ${styles.action}`}>
            {actionButton}
        </div>}
    </div>
}

export default observer(TableItem);