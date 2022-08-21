import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  /** Just a state variable we use to store our user's public wallet.*/
  const [, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
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
        console.info(`Found an authorized account: ${account}"`);
        setCurrentAccount(account);
      } else {
        console.warn("No authorized account found!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const wave = () => {};

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
        </div>

        <button className="waveButton" onClick={wave}>
          <span role="img" aria-label="wave">
            👋
          </span>{" "}
          at me
        </button>
      </div>
    </div>
  );
};

export default App;
