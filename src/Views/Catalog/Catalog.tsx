import React, { useMemo, useState } from "react";
import store from 'Store';
import styles from './Catalog.module.css';
import { observer } from "mobx-react";
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Table from "Components/Table/Table";
import { ShoppingCartOutlined } from '@ant-design/icons';
import AddToCartButton from "Components/AddToCartButton/AddToCartButton";

const Catalog = () => {
    const [query, setQuery] = useState<string>('');
    const displayedIds: string[] = useMemo(() => {
        return query.length ? store.items.search(query): store.items.idsList;
    }, [query, store.items.list])
    

    return <div className={styles.container}>
        <Input 
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} 
            placeholder="Search item" 
            type="search"
            className={styles.search}
            prefix={<SearchOutlined  className={styles.searchIcon}/>}
        />
        <Table fields={['id', 'title', 'price']} 
            titles={['Image', 'ID', 'Title', 'Price']} 
            displayedIds={displayedIds}
            action={(id) => <AddToCartButton id={id}/>}
        />
        </div>
}

export default observer(Catalog);