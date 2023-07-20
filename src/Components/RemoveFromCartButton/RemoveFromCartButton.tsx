import { observer } from "mobx-react";
import React from "react";
import store from 'Store';
import styles from './RemoveFromCartButton.module.css';

export interface Props {
    id: string;
}

const RemoveFromCartButton = ({id}: Props) => {
    return <button onClick={() => store.cart.removeItem(id)} className={styles.icon}>X</button>
}

export default observer(RemoveFromCartButton)