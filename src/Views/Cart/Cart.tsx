import React, { useMemo } from "react";
import styles from './Cart.module.css';
import Table from "Components/Table/Table";
import store from 'Store';
import { Link } from "react-router-dom";
import RemoveFromCartButton from "Components/RemoveFromCartButton/RemoveFromCartButton";
import { observer } from "mobx-react";
import OrderSummary from "Components/OrderSummary/OrderSummary";

const Cart = () => {
    const displayedIds = Object.keys(store.cart.addedItems);
    if (!displayedIds.length) {
        return <div className={styles.emptyState}>
            <div className={styles.content}>
            No items selected
            <Link to='/' className={styles.link}>Go back</Link>
            </div>
        </div>
    }
    return <div className={styles.container}>
         <Table fields={['title','price', 'quantity', 'totalCost']} 
            titles={['Item', 'Title', 'Price', 'Quantity', 'Total']} 
            displayedIds={displayedIds}
            action={(id) => <RemoveFromCartButton id={id}/>}
        />

        <OrderSummary />
        </div>
}

export default observer(Cart);