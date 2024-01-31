import { useEffect, useState } from 'react'
import './Staking.css'
import { NavLink, useNavigate } from 'react-router-dom'
import About from '../About/About'
import { poolStakingAddress, poolStakingAbi } from "../../utils/contract/poolStaking"
import {tokenContractAddress, tokenContractAbi} from "../../utils/contract/tokenContract"
import Web3 from 'web3';
function Staking({ connectWallets }) {
  const [displayTabs, setDisplayTabs] = useState(0)
  const [stakeType0, setStakeType0] = useState(null);
  const [stakeType1, setStakeType1] = useState(null);
  const [stakeType2, setStakeType2] = useState(null);
  const [stakeType3, setStakeType3] = useState(null);
  const integrateContract = () => {
    window.web3 = new Web3(window.ethereum);
    const web3 = window.web3;
    const poolStaking_Contract = new web3.eth.Contract(
      poolStakingAbi,
      poolStakingAddress
    );
    return poolStaking_Contract;
  };
  const integrateTokenContract = () => {
    const web3 = window.web3;
    const token_Contract = new web3.eth.Contract(
      tokenContractAbi,
        tokenContractAddress
    );
    return token_Contract;
};

const getTVL = async()=>{
  try{
    if (connectWallets == "Connect Wallet") {
    } else if (connectWallets == "Wrong Network") {
    } else { 
      const web3 = window.web3;
      let contract = integrateContract()
      let tokenContract = integrateTokenContract()
      let totalSupply = await tokenContract.methods.totalSupply().call()
      totalSupply = Number(totalSupply) /1e18
      // console.log("totalSupply", totalSupply);
      for(let i=0; i <4; i++){
        const lockups = await contract.methods.lockups(i).call()
        let totalStaked = Number(lockups.totalStaked) / 1e18
        
        if(totalStaked > 0){
          let dividetoken = (totalStaked /600000000) *100
          dividetoken = parseFloat(dividetoken).toFixed(3)
          let type = Number(lockups.stakeType);

          switch (type) {
            case 0:
              setStakeType0(dividetoken);
              break;
            case 1:
              setStakeType1(dividetoken);
              break;
            case 2:
              setStakeType2(dividetoken);
              break;
            case 3:
              setStakeType3(dividetoken);
              break;
            default:
              break;
          }
        }
      }
    }
  }catch(e){
    console.log("e",e);
  }
}

useEffect(()=>{
  getTVL()
},[connectWallets])
  const navigate = useNavigate();
  return (
    <section className='staking'>
      <h1 className="staking__header">Staking Pools</h1>
      <h2 className="staking__subheader">Stake, farm, zap and explore indexes for passive income</h2>
      <div className="staking__stakes">
        <div className="stake">
          <div className="stake__name">
            <p className="stake__subheader">Stake</p>
            <h3 className="stake__header"><span className="stake__header_blue">Navras</span> earn <span className="stake__header_blue">Navras</span></h3>
          </div>
          <p className="stake__percents">
            <span className="stake__percents_blue">100%</span>
            APR
          </p>
          <button className="stake__plus" onClick={() => navigate( `/about`)}>0 Day</button>
          <p className="stake__earn">
            <span className="stake__earn_blue">{stakeType0 ? stakeType0 : "0"}%</span>
            TVL
          </p>
          <ul className="stake__ul">
            <li className="stake__li">Deposit Fee 0%</li>
            <li className="stake__li">Withdraw Fee 0.30%</li>
            <li className="stake__li">Performance Fee 0.00035 ETH</li>
          </ul>
        </div>
        <div className="stake">
          <div className="stake__name">
            <p className="stake__subheader">Stake</p>
            <h3 className="stake__header"><span className="stake__header_blue">Navras</span> earn <span className="stake__header_blue">Navras</span></h3>
          </div>
          <p className="stake__percents">
            <span className="stake__percents_blue">300%</span>
            APR
          </p>
          <button className="stake__plus" onClick={() => navigate( `/about-30day`)}>30 Days</button>
          <p className="stake__earn">
            <span className="stake__earn_blue">{stakeType1 ? stakeType1: "0"}%</span>
            TVL
          </p>
          <ul className="stake__ul">
            <li className="stake__li">Deposit Fee 0%</li>
            <li className="stake__li">Withdraw Fee 0.35%</li>
            <li className="stake__li">Performance Fee 0.00035 ETH</li>
          </ul>
        </div>
        <div className="stake">
          <div className="stake__name">
            <p className="stake__subheader">Stake</p>
            <h3 className="stake__header"><span className="stake__header_blue">Navras</span> earn <span className="stake__header_blue">Navras</span></h3>
          </div>
          <p className="stake__percents">
            <span className="stake__percents_blue">500%</span>
            APR
          </p>
          <button className="stake__plus" onClick={() => navigate( `/about-90day`)}>90 Days</button>
          <p className="stake__earn">
            <span className="stake__earn_blue">{stakeType2 ? stakeType2 : "0"}%</span>
            TVL
          </p>
          <ul className="stake__ul">
            <li className="stake__li">Deposit Fee 0%</li>
            <li className="stake__li">Withdraw Fee 0.4%</li>
            <li className="stake__li">Performance Fee 0.00035 ETH</li>
          </ul>
        </div>
        <div className="stake">
          <div className="stake__name">
            <p className="stake__subheader">Stake</p>
            <h3 className="stake__header"><span className="stake__header_blue">Navras</span> earn <span className="stake__header_blue">Navras</span></h3>
          </div>
          <p className="stake__percents">
            <span className="stake__percents_blue">1000%</span>
            APR
          </p>
          <button className="stake__plus" onClick={() => navigate( `/about-180day`)}>180 Days</button>
          <p className="stake__earn">
            <span className="stake__earn_blue">{stakeType3 ? stakeType3: "0"}%</span>
            TVL
          </p>
          <ul className="stake__ul">
            <li className="stake__li">Deposit Fee 0%</li>
            <li className="stake__li">Withdraw Fee 0.5%</li>
            <li className="stake__li">Performance Fee 0.00035 ETH</li>
          </ul>
        </div>
      </div>

    </section>
  )
}

export default Staking
