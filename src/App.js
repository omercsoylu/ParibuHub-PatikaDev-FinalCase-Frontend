import React, { useEffect, useState } from "react";
import { Button, Grid, Image, Message } from "semantic-ui-react";
import { ethers } from "ethers";
import Contracts from "./Contracts";
import Abi from "./Abi";

import Profile from "./Components/Profile";
import Companies from "./Components/Companies";
import MintableArea from "./Components/MintableArea";

/*
@Author/Dev : Ömer Can Soylu
@contact: github.com/omercsoylu

Firstly, BusinessToken ERC20 and BusinessCard ERC721 Contract must be deploy to any EVM-based blockchain network.
Then the "contract addresses" should be replaced with the variables in Contracts.js
The ABIs of each contract should be replaced with ​​in Abi.js

The BusinessWorld contract is deployed with the addresses of the BusinessToken and BusinessCard contracts.
In the same way, contract address and ABI of BusinessWorld should be replaced with in Contracts.js and Abi.js.

In order for the BusinessWorld contract to access the BusinessToken, 
the BusinessWorld contract address must be added as the owner with the "addOwner" function of the BusinessToken contract.

!!"polygon testnet" mumbai is used in this project.
Please make sure you have polygon mumbai tesnet in your wallet and active network is mumbai when testing.
*/
function App() {
  // Connecting Wallet
  const [walletAddress, setWalletAddress] = useState();
  const [balanceOfBST, setBalanceOfBST] = useState();
  const [provider, setProvider] = useState();

  const connectWallet = async () => {
    const connectProvider = new ethers.providers.Web3Provider(window.ethereum);
    await connectProvider.send("eth_requestAccounts", []);

    try {
      const { ethereum } = window;
      ethereum.on("accountsChanged", (accounts) => {
        console.log("Account changed to:", accounts[0], "Accounts: ", accounts);
        console.log(
          "New provider to:",
          new ethers.providers.Web3Provider(ethereum)
        );
        setProvider(new ethers.providers.Web3Provider(ethereum));
        console.log("connectProvider: ", connectProvider);
        setWalletAddress(accounts[0]);
        console.log("provider: ", provider, "walletAddress: ", walletAddress);
      });
    } catch (error) {
      console.log(error);
    }

    const signer = connectProvider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);
    setProvider(connectProvider);
    console.log("Connecting wallet:", address);
  };

  const getAndListeningEvent = async () => {
    const tContract = new ethers.Contract(
      Contracts.BUSINESS_TOKEN,
      Abi.BUSINESS_TOKEN,
      provider
    );

    console.log(
      "BST Transfer listening...",
      "provider:",
      provider,
      "wallet:",
      walletAddress
    );

    try {
      tContract.on("Transfer", async (_from, _to, _value) => {
        if (_from == walletAddress || _to == walletAddress) {
          console.log(
            "BST Transfer listening...",
            "_from: ",
            _from,
            "_to: ",
            _to,
            "_value",
            _value
          );
          const balance = await tContract.balanceOf(walletAddress);
          setBalanceOfBST(
            Number(ethers.utils.formatEther(balance)).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })
          );
        }
      });
    } catch (e) {
      console.log("BST listening error: ", e);
    }

    const balance = await tContract.balanceOf(walletAddress);
    console.log(
      "BST Balance: ",
      balance,
      "BST Balance: ",
      Number(ethers.utils.formatEther(balance)).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })
    );
    setBalanceOfBST(
      Number(ethers.utils.formatEther(balance)).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })
    );
  };

  useEffect(() => {
    if (provider) {
      getAndListeningEvent();
    }
  }, [provider]);

  const disconnectWallet = () => {
    setWalletAddress("");
    setProvider("");
    console.log("Disconnecting...", "walletAddress:", walletAddress);
  };

  useEffect(() => {
    //connectWallet();
  }, []);

  return (
    <Grid celled>
      {/*
      HEADER
      */}
      <Grid.Row>
        <Grid.Column width={14}>
          <Message>
            <Message.Header>BusinessWorld NFT Game</Message.Header>
            <p>
              You can earn BusinessToken (BST) by mint BusinessCard nft and
              putting to work in companies.
            </p>
            <p>
              Please ensure your wallet is in "polygon mumbai tesnet" network.
              This is an educational project. There is no security guarantee
              therefore please use your test wallet.
              <strong>author/dev: @github/omercsoylu</strong>
            </p>
          </Message>
        </Grid.Column>
        <Grid.Column width={2}>
          {walletAddress ? (
            <>
              <Button basic color="orange" fluid onClick={disconnectWallet}>
                {walletAddress.slice(0, 8) + "..." + walletAddress.slice(-6)}
              </Button>
              <Message size="small" color="teal">
                <p>
                  {" "}
                  <strong>$BST: </strong>
                  {balanceOfBST}
                </p>
              </Message>
            </>
          ) : (
            <Button color="orange" fluid onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
        </Grid.Column>
      </Grid.Row>

      {/*
      BASE
      */}
      <Grid.Row>
        {/*
      LEFT-PROFILE
      */}
        <Grid.Column width={3}>
          <Profile provider={provider} />
        </Grid.Column>
        {/*
      COMPANIES
      */}
        <Grid.Column width={10}>
          <Companies provider={provider} />
        </Grid.Column>
        {/*
      RIGHT-MINT-SECTION
      */}
        <Grid.Column width={3}>
          <MintableArea provider={provider} />
        </Grid.Column>
      </Grid.Row>
      {/*
      LEFT-PROFILE
      */}
    </Grid>
  );
}

export default App;
