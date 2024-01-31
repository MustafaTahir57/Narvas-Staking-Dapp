import React, { useEffect, useState } from 'react'
import "./About.css"
import { poolStakingAddress, poolStakingAbi } from "../../utils/contract/poolStaking"
import {tokenContractAddress, tokenContractAbi} from "../../utils/contract/tokenContract"
import Modal from 'react-bootstrap/Modal';
import { RxCross2 } from "react-icons/rx";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { toast } from "react-toastify";
import Web3 from 'web3';
import DailyIncreaseChart from '../chart/chart'
import axios from 'axios';
const AboutOne = ({connectWallets}) => {
  const [selectValue, setSelectValue] = useState('Block Remaining')
  const [performanceFee, setPerformanceFee] = useState(0)
  const [totalEarnStaked, setTotalEarnStaked] = useState(0)
  const [balanceOf, setBalanceOf] = useState(0)
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShowWithdraw, setModalShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [amount, setAmount] = useState(0)
  const [sumOfArray, setSumOfArray] = useState(0)
  const [depositAmount, setDepositAmount] = useState()
  const [lockUpObject,setLockUpObject] = useState({})
  const [pendingCOnvert, setPendingCOnvert] = useState(0)
  const [pendingReward,setPendingReward] = useState(0)
  const selectLine = document.querySelector('.pool__remain-line')
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [navras,setNavras] = useState(0)
  const [depositTime, setDepositTime] = useState()
  const [lineWidth, setLineWidth] = useState(0);
  const [myStakedValue,stMyStakedValue] = useState(0)
  function handleChangeSelect(e) {
    setSelectValue(e.target.value)
  }

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
  const getValue = async () => {
    try {
      if (connectWallets == "Connect Wallet") {
      } else if (connectWallets == "Wrong Network") {
      } else {
        const web3 = window.web3;
        let contract = integrateContract()
        let tokenContract = integrateTokenContract()
        let balanceOf = await tokenContract.methods.balanceOf(connectWallets).call()
        balanceOf = Number(balanceOf)
        balanceOf = Number(balanceOf) / 1e18
        balanceOf = parseFloat(balanceOf);
        balanceOf = balanceOf.toFixed(2)
        setBalanceOf(balanceOf)

        let performanceFee = await contract.methods.performanceFee().call()
        performanceFee = Number(performanceFee);
        performanceFee = web3.utils.fromWei(performanceFee, 'ether')
        setPerformanceFee(performanceFee)

        let userStaked = await contract.methods.userStaked(connectWallets).call();
        userStaked = Number(userStaked?.amount)
        userStaked = web3.utils.fromWei(userStaked, 'ether')
        setAmount(userStaked)
         
        let userInfo = await contract.methods.userInfo(1, connectWallets).call()
        userInfo = Number(userInfo.amount) /1e18
        stMyStakedValue(userInfo)

        let lockups = await contract.methods.lockups(1).call()
        let depositFee =   Number(lockups.depositFee)    
        let withdrawFee = Number(lockups.withdrawFee) /100
        let lastRewardBlock = Number(lockups.lastRewardBlock);
        let totalStaked  = Number(lockups.totalStaked) /1e18
        let lockUpArray = {depositFee: depositFee,withdrawFee:withdrawFee ,lastRewardBlock: lastRewardBlock, totalStaked: totalStaked}
        setLockUpObject(lockUpArray)

        


        let pendingReward = await contract.methods.pendingReward(connectWallets, 1).call()
        pendingReward = Number(pendingReward)
        pendingReward = web3.utils.fromWei(pendingReward, 'ether')
        let pendingRewardConvert = pendingReward
        pendingReward = parseFloat(pendingReward).toFixed(6)

        setPendingReward(pendingReward)

        let rewardAmount = await contract.methods.rewardAmount().call()
        rewardAmount = Number(rewardAmount) / 1e18
        rewardAmount = parseInt(rewardAmount)

        let availableRewardTokens = await contract.methods.availableRewardTokens().call();
        availableRewardTokens = Number(availableRewardTokens)/1e18
        availableRewardTokens =parseInt(availableRewardTokens)
        let rewardPercentage = ((rewardAmount - availableRewardTokens) / rewardAmount) * 100
        let bonusEndBlock = await contract.methods.bonusEndBlock().call()
        bonusEndBlock = Number(bonusEndBlock)
        const webs3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
       let blockNumber = await webs3.eth.getBlockNumber()
       const percentage = (Number(blockNumber) / bonusEndBlock) * 100;
        if(selectValue == 'Reward Remaining'){
          setCurrent(availableRewardTokens)
          setProgress(rewardPercentage)
        } else{
          setCurrent(bonusEndBlock - Number(blockNumber))
          setProgress(percentage)
        }
        
        const intervalId = setInterval(() => {
          setCurrentDate(new Date());
        }, 24 * 60 * 60 * 1000);
        let totalEarnStaked = await contract.methods.totalStaked().call();
        totalEarnStaked = Number(totalEarnStaked) /1e18
        let valueCOnvert = totalEarnStaked
        totalEarnStaked = parseFloat(totalEarnStaked).toFixed(4)
        setTotalEarnStaked(totalEarnStaked)

        const response = await axios.get('https://api.geckoterminal.com/api/v2/simple/networks/eth/token_price/0x796ef302e922fbe7020ccc1a5ead2da2970d2ff7');
        let tokenPrice = response.data.data.attributes.token_prices['0x796ef302e922fbe7020ccc1a5ead2da2970d2ff7'];
        let convertValue = valueCOnvert * tokenPrice
        let pendingCOnvert = pendingRewardConvert * tokenPrice
        pendingCOnvert = parseFloat(pendingCOnvert).toFixed(7)
        setPendingCOnvert(pendingCOnvert)
        convertValue = parseFloat(convertValue).toFixed(7)
        setNavras(convertValue)
        
        let depositTime = await contract.methods.depositTime().call()
        depositTime = Number(depositTime)
        const data = new Date(1706469195 * 1000);
        const formattedDate = `${data.getDate().toString().padStart(2, '0')}-${(data.getMonth() + 1).toString().padStart(2, '0')}`;
        const formattedTime = `${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
        setDepositTime(`${formattedTime} /${formattedDate}`)

        let userStakeCount = await contract.methods.userStakeCount(connectWallets).call()
        userStakeCount = Number(userStakeCount)
        if( userStakeCount>=1){
          let rewardDebtArray = [];
            for (var i = 0; i < userStakeCount; i++) {
                let userStakes = await contract.methods.userStakes(connectWallets, i).call();
                if (Number(userStakes.stakeType) == 1) {
                  let rewardDebt = Number(userStakes.rewardDebt) / 1e18;
                  rewardDebtArray.push(rewardDebt);
              }
                
            }
            let sumOfArray = rewardDebtArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            sumOfArray = parseFloat(sumOfArray).toFixed(6);
            setSumOfArray(sumOfArray)
        }
          
      }
    } catch (e) {
      console.log("e", e);
    }
  }
  const date = currentDate.toDateString();

  const handleWithdraw = async () => {
    try {
      if (connectWallets == "Connect Wallet") {
        toast.error("Please Connect wallet first")
      } else if (connectWallets == "Wrong Network") {
        toast.error("Please Connect Goerli network")
      } else {
        const web3 = window.web3;
        let contract = integrateContract()
        let performanceFee = await contract.methods.performanceFee().call()
        performanceFee = Number(performanceFee)
        if(withdrawAmount <= amount){
          let amounts = web3.utils.toWei(withdrawAmount, 'ether')
          let withdraw = await contract.methods.withdraw(amounts, 1)
          .send({
            from: connectWallets,
            value: performanceFee
          })

        if (withdraw) {
          toast.success("Withdraw successfully.")
          setWithdrawAmount("")
          getValue()
        }
        } else{
          toast.error("your amount is greater then your balance.")
        }
       
      }
    } catch (e) {
      console.log("e", e);
    }
  }

  const handleDeposit = async () => {
    try {
      if (connectWallets == "Connect Wallet") {
        toast.error("Please Connect wallet first")
      } else if (connectWallets == "Wrong Network") {
        toast.error("Please Connect Goerli network")
      } else {
        const web3 = window.web3;
        let contract = integrateContract()
        let tokenContract = integrateTokenContract()
        let performanceFee = await contract.methods.performanceFee().call()
        let amount = web3.utils.toWei(depositAmount, 'ether')
        if(depositAmount <=parseInt(balanceOf)){
           await tokenContract.methods.approve(poolStakingAddress, amount)
          .send({
            from : connectWallets
          })
          let deposit = await contract.methods.deposit(amount, 1)
            .send({
              from: connectWallets,
              value: Number(performanceFee)
            })
  
          if (deposit) {
            toast.success("Deposit successfully.")
            setDepositAmount("")
            getValue()
          }
        } else{
          toast.error("your amount is greater then your balance.")
        }
        
      }
    } catch (e) {
      console.log("e", e);
    }
  }

  const handleClaimReward = async () => {
    try {
      if (connectWallets == "Connect Wallet") {
        toast.error("Please Connect wallet first")
      } else if (connectWallets == "Wrong Network") {
        toast.error("Please Connect Goerli network")
      } else { 
        let contract = integrateContract()
        let performanceFee = await contract.methods.performanceFee().call()
        let claimReward = await contract.methods.claimReward(1)
        .send({
           from :  connectWallets,
           value: Number(performanceFee)
        })
        if (claimReward) {
          toast.success("Claim Reward successfully.")
          setDepositAmount("")
          getValue()
        }
      }
    } catch (e) {
      console.log("e", e);
    }
  }
  const handleCompoundReward = async () => {
    try {
      if (connectWallets == "Connect Wallet") {
        toast.error("Please Connect wallet first")
      } else if (connectWallets == "Wrong Network") {
        toast.error("Please Connect Goerli network")
      } else {
        let contract = integrateContract();
        let performanceFee = await contract.methods.performanceFee().call()
        let compoundReward = await contract.methods.compoundReward(1).send({
          from: connectWallets,
          value: Number(performanceFee)
        })
        if(compoundReward){
          toast.success("Compound Reward successfully")
        }
      }
    } catch (e) {
      console.log("e", e);
    }
  }

  useEffect(() => {
    if (selectValue === 'Block Remaining' || selectValue === 'Reward Remaining') {
      setLineWidth(parseInt(progress));
    } else {
      setLineWidth(0);
    }
    // if (selectLine != undefined) {
    //   if (selectValue === 'Block Remaining') {
    //     selectLine.style.width = `${parseInt(progress)}%`;
    //   } else {
    //     selectLine.style.width = "0%";
    //   }
      
    //   if (selectValue === 'Reward Remaining') {
    //     selectLine.style.width = `${parseInt(progress)}%`;
    //   } else {
    //     selectLine.style.width = "0%";
    //   }
    // }
    getValue();
  }, [selectValue, connectWallets, progress]);
    return (
      <section className='staking'>
      <h1 className="staking__header">Staking Pools</h1>
      <h2 className="staking__subheader">Stake, farm, zap and explore indexes for passive income</h2>
      <div className="staking__btns">
        <button className='staking__btn'>← Back</button>
        <div className="staking__nav">
          <button className='staking__btn' onClick={() => setModalShow(true)}>Deposit</button>
          <button className='staking__btn' onClick={() => setModalShowWithdraw(true)}>Withdraw</button>
        </div>
      </div>
      <div className="staking__blocks">
        <div className="staking__pool">
          <div className="pool__subheader-cont">
            <h4 className="pool__subheader">Pool</h4>
            <h4 className="pool__subheader">30 Days</h4>
          </div>
          <div className="pool__header-cont pool__header-cont_margin">
            <h3 className="pool__header">Navras</h3>
            <p className="pool__apr">
              APR:
              <span className="pool__apr_blue">100%</span>
            </p>
          </div>
          <h4 className="pool__subheader">Pool</h4>
          <h3 className="stake__header"><span className="stake__header_blue">Navras</span> earn <span className="stake__header_blue">Navras</span></h3>
          <ul className="stake__ul">
            <li className="stake__li">Deposit Fee {lockUpObject.depositFee}%</li>
            <li className="stake__li">Withdraw Fee {lockUpObject.withdrawFee}%</li>
            <li className="stake__li">Performance Fee {performanceFee} ETH</li>
          </ul>
        </div>
        <div className="staking__pool">
          <div className="pool__subheader-cont">
            <h4 className="pool__subheader">Pool Rewards</h4>
            <h4 className="pool__subheader">Pending</h4>
          </div>
          <div className="pool__header-cont">
            <h3 className="pool__header">Navras <span className="pool__header-span">Earned</span></h3>
            <p className="pool__total">{sumOfArray} NAVRAS</p>
          </div>
          <div className="pool__header-cont">
            <h3 className="pool__header">Navras <span className="pool__header-span">Rewards</span></h3>
            <p className="pool__total">{pendingReward} NAVRAS</p>
          </div>
          {/* <h4 className="pool__subheader pool__subheader_margin">Pool</h4>
          <p className="pool__total">0.00 NAVRAS</p>
          <p className="pool__total">0.00 Navras</p> */}
        </div>
      </div>
      <div className="staking__pool staking__pool_full">
        <h4 className="pool__subheader">Pool Query</h4>
        <form action="" className="pool__remains">
          <div className="pool__select">
            <select name="poolSelect" onChange={handleChangeSelect}>
              <option value="Block Remaining">Block Remaining</option>
              <option value="Reward Remaining">Reward Remaining</option>
            </select>
          </div>
          <div className="pool__remain">
            <p className="pool__remain-text">{selectValue}: <span className="pool__remain-text_underline">{current}</span></p>
            <span className="pool__remain-line" style={{ width: `${lineWidth}%` }}></span>
          </div>
        </form>
      </div>
      <div className="staking__blocks">
        <div className="staking__pool graph">
          <div className="graph__container">
            <div className="graph__cont text-start">
              <h4 className="pool__subheader">Total Staked Value</h4>
              <p className="pool__total graph__text">{lockUpObject.totalStaked} Navras</p>
              <p className="pool__total graph__text"> {date}</p>
            </div>
            <div className="pool__select graph__select">
              <select name="poolSelect" >
                <option value="Total Stake">Total Stake Value     ${navras}</option>
                {/* <option value="50 Stake">50 Stake Value     $1.2M</option>
                <option value="10 Stake">10 Stake Value     $0.53M</option> */}
              </select>
            </div>
          </div>
          <DailyIncreaseChart totalEarnStaked={lockUpObject.totalStaked} depositTime={depositTime}/>
        </div>
        <div className="staking__blocks tokens">
          <div className="staking__pool token">
            <h4 className="pool__subheader">My Staked Tokens</h4>
            <span className="stake__header_blue token__header_blue">{myStakedValue} NAVRAS</span>
          </div>
          <div className="staking__pool token">
            <h4 className="pool__subheader">USD Value</h4>
            <span className="stake__header_blue token__header_blue">${navras}</span>
          </div>
          <h4 className="pool__subheader pool__subheader_large">Pool Rewards</h4>
          <div className="staking__pool token">
            <h4 className="pool__subheader">Compound {pendingReward} Navras</h4>
            <span className="stake__header_blue token__header_blue">${pendingCOnvert}</span>
            <button className='header__link__modals' onClick={handleCompoundReward}>Compound</button>
          </div>
          <div className="staking__pool token">
            <h4 className="pool__subheader">Harvest {pendingReward} Navras</h4>
            <span className="stake__header_blue token__header_blue">${pendingCOnvert}</span>
            <button className='header__link__modals ' onClick={handleClaimReward}>Harvest</button>
          </div>
        </div>
      </div>

      {
        modalShow ? (
          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}

            aria-labelledby="contained-modal-title-vcenter"
            centered
          >

            <Modal.Body>
              <div className='d-flex justify-content-between align-items-center'>
                <h3 className="pool__header">Deposit</h3>
                <RxCross2 onClick={() => setModalShow(false)} style={{ cursor: "pointer" }} size={25} />
              </div>
              <h2 className="staking__subheaderss">Balance available for use</h2>
              <span className="pool__headers">{balanceOf} NAVRAS</span>
              <InputGroup className="mb-3 mt-3" size="lg">
                <Form.Control
                  placeholder="Enter Number"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  id="inputGroup-sizing-lg"
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setDepositAmount(parseInt(balanceOf))}>
                  Max
                </Button>
              </InputGroup>
              <button className='header__link__modals' onClick={handleDeposit}>Deposit</button>
            </Modal.Body>
          </Modal>
        ) : (
          <>
          </>
        )
      }
      {
        modalShowWithdraw ? (
          <Modal
            show={modalShowWithdraw}
            onHide={() => setModalShowWithdraw(false)}

            aria-labelledby="contained-modal-title-vcenter"
            centered
          >

            <Modal.Body>
              <div className='d-flex justify-content-between align-items-center'>
                <h3 className="pool__header">Withdraw</h3>
                <RxCross2 onClick={() => setModalShowWithdraw(false)} style={{ cursor: "pointer" }} size={25} />
              </div>
              <h2 className="staking__subheaderss">Balance available for use</h2>
              <span className="pool__headers">{amount} NAVRAS</span>
              <InputGroup className="mb-3 mt-3" size="lg">
                <Form.Control
                  placeholder="Enter Number"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  id="inputGroup-sizing-lg"
                  value={withdrawAmount}
                  type="number"
                  onChange={(e)=>setWithdrawAmount(e.target.value)}
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setWithdrawAmount(amount)}>
                  Max
                </Button>
              </InputGroup>
              <button className='header__link__modals' onClick={handleWithdraw}>Withdraw</button>
              
            </Modal.Body>
          </Modal>
        ) : (
          <>
          </>
        )
      }
    </section>
    )
}

export default AboutOne