import React from 'react';
import store from 'Store';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';
import styles from './CheckoutButton.module.css';

const CheckoutButton = () => {
    return <Link to='/checkout' className={styles.container}>
        <ShoppingCartOutlined className={styles.icon} />
        {!!store.cart.totalCount && <div className={styles.count}>{store.cart.totalCount}</div>}
    </Link>
}

export default observer(CheckoutButton)