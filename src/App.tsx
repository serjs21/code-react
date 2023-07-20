import Header from 'Components/Header/Header';
import { Routes, Route, Navigate, useLocation} from "react-router-dom";
import Cart from 'Views/Cart/Cart';
import Catalog from 'Views/Catalog/Catalog';
import styles from './App.module.css';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import store from 'Store';
import { Spin } from 'antd';


const TitlesMap: {[route: string]: string} = {
  '/': 'Catalog page',
  '/checkout': 'Your cart'
}

function App() {
  const location = useLocation();

  useEffect(() => {
    store.items.fetch();
  }, [])


  useEffect(() => {
    document.title = TitlesMap[location.pathname] || 'Dropit';
  }, [location.pathname]);

  if (!store.items.isFeched) {
    return <div className={styles.loader}>
      <Spin size={'large'} />
    </div>
  }

  return (
    <div className={styles.container}>
    <Header />
    
    <div className={styles.content}>
    <div className={styles.title}>{TitlesMap[location.pathname]}</div>
      <Routes>
              <Route path="/checkout" element={<Cart />}/>
              <Route path="/" element={<Catalog />} />
              <Route path="*" element={<Navigate to='/'/>} />
        </Routes>
    </div>
    
    </div>
  );
}

export default observer(App);
