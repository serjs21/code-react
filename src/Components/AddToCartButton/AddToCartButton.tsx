import { observer } from "mobx-react";
import React from "react";
import store from 'Store'
import { ShoppingCartOutlined } from '@ant-design/icons';
import styles from './AddToCartButton.module.css';

export interface Props {
    id: string;
    nullable?: boolean;
}

const AddToCartButton = ({ id, nullable } : Props) => {
    const addedCount = store.cart.addedItems[id] || 0;
    if (!addedCount && !nullable) return <button onClick={() => store.cart.addItem(id)} className={styles.actionButton}><ShoppingCartOutlined /></button>;
    
    return <div className={styles.counterContainer}>
        <button onClick={() => store.cart.removeItem(id, 1)} className={`${styles.actionButton} ${!addedCount ? styles.disabled : ''}`}>-</button>
            <div className={styles.count}>{addedCount}</div>
        <button onClick={() => store.cart.addItem(id, 1)} className={styles.actionButton}>+</button>
    </div>
    
}

export default observer(AddToCartButton)