import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  /** Just a state variable we use to store our user's public wallet.*/
  const [currentAccount, setCurrentAccount] = useState("");
  const [mining, setMining] = useState(false);
  const [waveTxn, setWaveTxn] = useState(false);
  const [message, setMessage] = useState('');

  /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0x7F05C98D83a957e1447Be989E4C4323Aa3dd5d98";
  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });

        console.log("wavesCleaned", wavesCleaned);

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [contractABI]);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      /** First make sure we have access to window.ethereum */
      const { ethereum } = window;

      if (!ethereum) {
        console.warn("Make sure you have metamask!");
        return;
      } else {
        console.debug("We have the ethereum object", ethereum);
      }

      /** Check if we're authorized to access the user's wallet */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.info(`Found an authorized account: ${account}`);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.warn("No authorized account found!");
      }
    } catch (error) {
      console.error(error);
    }
  }, [getAllWaves]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.info(`Connected account: ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMessageChange = (event) => {
      setMessage(event.target.value);
  }

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        /*
         * Execute the actual wave from your smart contract
         */
        setMining(true);
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);
        setWaveTxn(waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        setMining(false);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">Welcome</div>

        <div className="bio">
          <p>
            I am Attila an Angular Contractor and Web3 Enthusiast, who like
            doing sports.
          </p>
          <p>Connect your Ethereum wallet in order to wave at me!</p>

          {!mining && (
            <div>
              <button className="waveButton" onClick={wave}>
                <span role="img" aria-label="wave">
                  👋
                </span>{" "}
                at me
              </button>
              <input type="text" onChange={handleMessageChange} placeholder="Set your message here"></input>
            </div>
          )}

          {mining && (
            <p>
              Mining your{" "}
              <span role="img" aria-label="wave">
                👋
              </span>
              {" ..."}
              {waveTxn && <span>({waveTxn})</span>}
            </p>
          )}
        </div>

        {/**If there is no currentAccount render this button */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: "OldLace",
                marginTop: "16px",
                padding: "8px",
              }}
            >
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
