import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Container, Card, Image, Button, Message } from "semantic-ui-react";
import Contracts from "../Contracts";
import Abi from "../Abi";
import BusinessCards from "../Assets/businesscards.png";

const MintableArea = (props) => {
  const [signer, setSigner] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [provider, setProvider] = useState();

  const initializeF = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const sig = provider.getSigner();
    const resAdd = await sig.getAddress();
    setSigner(sig);
    setWalletAddress(resAdd);
    setProvider(provider);
  };

  const claimCardNFT = async () => {
    await initializeF();
    const businessCardNFT = new ethers.Contract(
      Contracts.BUSINESS_CARD,
      Abi.BUSINESS_CARD,
      provider
    );

    const nftContracts = businessCardNFT.connect(signer);
    const tx = await nftContracts.mintBusinessCard();
    console.log("tx: ", tx);
  };

  useEffect(() => {
    if (props.wallet != "") {
      initializeF();
    } else {
      setWalletAddress("");
    }
  }, [props.wallet]);

  return (
    <Container>
      <Message success>
        <Message.Header>Claim BusinessCard</Message.Header>
        <p>You can claim BusinessCard NFT.</p>
      </Message>
      <Card fluid>
        <Image src={BusinessCards} wrapped ui={false} />
        <Card.Content>
          <Card.Header>BusinessCard</Card.Header>
          <Card.Meta>Unlimited Supply</Card.Meta>
          <Card.Description>
            After this "NFT" is minted, a random{" "}
            <strong>employee business card</strong> will appear.
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          {walletAddress ? (
            <Button fluid inverted color="purple" onClick={claimCardNFT}>
              Claim
            </Button>
          ) : (
            <Button fluid disabled inverted color="purple">
              Claim
            </Button>
          )}
        </Card.Content>
      </Card>
    </Container>
  );
};

export default MintableArea;
