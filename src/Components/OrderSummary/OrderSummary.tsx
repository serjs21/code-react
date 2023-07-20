import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";
import store from 'Store';
import styles from './OrderSummary.module.css';
import { Modal } from 'antd';

const OrderSummary = () => {
    const [isModalOpen, setModalIsOpen] = useState<boolean>(false);
    
    const total = useMemo(() => {
        return Object.entries(store.cart.addedItems).reduce((sum: number, [id, count]: [string, number]) => {
            return sum + store.items.map[id].price * (count || 0);
        }, 0)
    }, [store.cart.totalCount]);

    const onCheckoutClick = () => {
        setModalIsOpen(true);
    }

    const onClose = () => {
        store.cart.submitRequest();
        window.location.replace('/');
        setModalIsOpen(false);
    }

    return <div>
    <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.summary}>
                <div className={styles.title}>Order summary</div>
                <div className={styles.entry}><span>Subtotal</span> <span>${total}</span></div>
                <div className={styles.entry}><span>Shipping</span> <span>Free</span></div>
            </div>
            
            <div className={styles.total}>
                <div className={styles.entry}><span>Total</span> <span>${total}</span></div>
            </div>
        </div>

        </div>
        <button className={styles.checkout} onClick={onCheckoutClick}>Checkout</button>
        <Modal 
            className={styles.modal} 
            open={isModalOpen}
            onCancel={onClose}
            title='Checkout completed' 
            footer={<button className={styles.closeButton} onClick={onClose}>SEE YA</button>}>
                <div className={styles.modalContent}>Thanks for buying, see you soon!</div>
        </Modal>
        </div>
}


export default observer(OrderSummary)