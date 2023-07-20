import React from 'react';
import styles from './Header.module.css';
import CheckoutButton from 'CheckoutButton/CheckoutButton';

const logoSrc = 'https://www.melondesign.co.il/wp-content/uploads/Dropit-shopping-logo.png';

const Header = () => {
    return <header className={styles.container}>
        <img src={logoSrc} className={styles.logo}/>
        <nav>
            <CheckoutButton />
        </nav>
    </header>
}

export default Header;