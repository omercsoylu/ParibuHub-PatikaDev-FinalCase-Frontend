import React, { useEffect, useState } from "react";
import { Button, Grid, Image, Message } from "semantic-ui-react";
import { ethers } from "ethers";
import Contracts from "./Contracts";
import Abi from "./Abi";

import Profile from "./Components/Profile";
import Companies from "./Components/Companies";
import MintableArea from "./Components/MintableArea";

function App() {
  // Connecting Wallet
  const [walletAddress, setWalletAddress] = useState();
  const [balanceOfBST, setBalanceOfBST] = useState();

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);
    console.log("Connecting wallet:", address);

    const tContract = new ethers.Contract(
      Contracts.BUSINESS_TOKEN,
      Abi.BUSINESS_TOKEN,
      provider
    );

    tContract.on("Transfer", async (_from, _to, _value) => {
      if (_from == walletAddress || _to == walletAddress) {
        console.log("BST Transfer listening...", "_from: ", _from, "_to: ", _to, "_value", _value);
        const balance = await tContract.balanceOf(address);
        setBalanceOfBST(ethers.utils.formatEther(balance).slice(0, -2));
      }
    });

    const balance = await tContract.balanceOf(address);
    console.log(
      "BST Balance: ",
      balance,
      "BST Balance: ",
      ethers.utils.formatEther(balance)
    );
    setBalanceOfBST(ethers.utils.formatEther(balance).slice(0, -2));
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    console.log("Disconnecting", "walletAddress:", walletAddress);
  };

  useEffect(() => {
    connectWallet();
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
          <Profile wallet={walletAddress} />
        </Grid.Column>
        {/*
      COMPANIES
      */}
        <Grid.Column width={10}>
          <Companies wallet={walletAddress} />
        </Grid.Column>
        {/*
      RIGHT-MINT-SECTION
      */}
        <Grid.Column width={3}>
          <MintableArea wallet={walletAddress} />
        </Grid.Column>
      </Grid.Row>
      {/*
      LEFT-PROFILE
      */}
    </Grid>
  );
}

export default App;
