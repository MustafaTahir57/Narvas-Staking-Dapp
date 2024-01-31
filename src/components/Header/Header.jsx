import { useState } from 'react'
import './Header.css'
import { NavLink } from 'react-router-dom'
import { loadWeb3 } from '../../utils/Api/api';
function Header({setConnectWallets}) {
  const [address, setAddress] = useState("Connect Wallet");
    const handleConnect = async () => {
        try {
          let acc = await loadWeb3();
          if (acc === "No Wallet") {
            // setConnectWallet("No Wallet");
            setAddress("Wrong Network");
          } else if (acc === "Wrong Network") {
            // setConnectWallet("Wrong Network");
            setAddress("Wrong Network");
          } else {
            setAddress(acc.substring(0, 4) + "..." + acc.substring(acc.length - 4))
            setConnectWallets(acc)
          }
        } catch (err) {
          console.log("err", err);
        }
      }
  return (
    <header className="header">
        <nav className="header__container">
            <NavLink to='/' className='header__logo'></NavLink>
            <NavLink  className='header__link' onClick={handleConnect}>{address}</NavLink>
        </nav>
    </header>
  )
}

export default Header
