import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Container, Card, Image, Button, Message } from "semantic-ui-react";
import Contracts from "../Contracts";
import Abi from "../Abi";
import BusinessCards from "../Assets/businesscards.png";

const MintableArea = (props) => {
  // Signer and provider => getWalletAddress
  const [signer, setSigner] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [provider, setProvider] = useState();

  // if provider coming from props, initialize.
  const initializeF = async (_provider) => {
    const _sig = _provider.getSigner();
    const _wallet = await _sig.getAddress();
    setSigner(_sig);
    setWalletAddress(_wallet);
    setProvider(_provider);
  };

  // NFT mint function.
  const claimCardNFT = async () => {
    if (provider) {
      const businessCardNFT = new ethers.Contract(
        Contracts.BUSINESS_CARD,
        Abi.BUSINESS_CARD,
        provider
      );
      const nftContracts = businessCardNFT.connect(signer);
      const tx = await nftContracts.mintBusinessCard();
      console.log("tx: ", tx);
    } else {
      console.log("Error: ", "provider not found.");
    }
  };

  // initialize useEffect
  useEffect(() => {
    if (props.provider != null) {
      console.log("props.provider in MintableArea: ", props.provider);
      initializeF(props.provider);
    } else {
      setSigner("");
      setWalletAddress("");
      setProvider("");
    }
  }, [props.provider]);

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
