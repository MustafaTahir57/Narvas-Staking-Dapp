
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './source/fonts/fonts.css'
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom'
import Staking from "./components/Staking/Staking"
import About from "./components/About/About"
import AboutOne from "./components/About/aboutOne"
import AboutTwo from "./components/About/abouttwo"
import AboutFour from "./components/About/aboutFour"
import Header from "./components/Header/Header"
function App() {
  const [connectWallets, setConnectWallets] = useState("Connect Wallet");
  return (
    <div className="App">
     <Header setConnectWallets={setConnectWallets}/>
      <main className='main'>
        <Routes>
          <Route path='/' element={<Staking connectWallets={connectWallets}/>} />
          <Route path='/about' element={<About connectWallets={connectWallets}/>} />
          <Route path='/about-30day' element={<AboutOne connectWallets={connectWallets}/>}/>
          <Route path='/about-90day' element={<AboutTwo connectWallets={connectWallets}/>}/>
          <Route path='/about-180day' element={<AboutFour connectWallets={connectWallets}/>}/>
        </Routes>
      </main>
    </div>
  );
}

export default App;
