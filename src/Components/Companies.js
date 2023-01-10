import React, { useEffect, useState } from "react";
import { Button, Image, Card, Icon, Placeholder } from "semantic-ui-react";
import { ethers } from "ethers";
import Contracts from "../Contracts";
import Abi from "../Abi";
import CompanyOne from "../Assets/company_1.png";
import CompanyTwo from "../Assets/company_2.png";
import CompanyThree from "../Assets/company_3.png";
import CompanyFour from "../Assets/company_4.png";

const Companies = (props) => {
  const [signer, setSigner] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [provider, setProvider] = useState();

  const initializeF = async () => {
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const _sig = _provider.getSigner();
    const _resAdd = await _sig.getAddress();
    setSigner(_sig);
    setWalletAddress(_resAdd);
    setProvider(_provider);
  };

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    setCompanies([]);
    await initializeF();
    const wContract = new ethers.Contract(
      Contracts.BUSINESS_WORLD,
      Abi.BUSINESS_WORLD,
      provider
    );

    const data = await wContract.getCompanies();
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].baseSalary == 0) {
          continue;
        }
        setCompanies((companies) => [...companies, data[i]]);
      }
    }
  };

  useEffect(() => {
    if (walletAddress != "") {
      getCompanies();
    } else {
      setCompanies([]);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (props.wallet != "") {
      initializeF();
    } else {
      setWalletAddress("");
    }
  }, [props.wallet]);

  const randomCompanyImage = (_index) => {
    switch (_index % 4) {
      case 0:
        return CompanyOne;
      case 1:
        return CompanyTwo;
      case 2:
        return CompanyThree;
      case 3:
        return CompanyFour;
      default:
        return CompanyOne;
    }
  };

  return (
    <Card.Group centered>
      {companies.length > 0 ? (
        companies.map((company, index) => (
          <Card key={company}>
            <Image src={randomCompanyImage(index)} wrapped ui={false} />
            <Card.Content>
              <Card.Header>{company.name}</Card.Header>
              <Card.Meta>
                <span className="date">a blockchain company.</span>
              </Card.Meta>
              <Card.Description>
                <Icon name="user" />
                {Number(company.activeEmployee)} /{" "}
                {Number(company.maxEmployment)} Employment
              </Card.Description>
            </Card.Content>

            <Card.Content extra>
              <Button
                color="purple"
                disabled
                onClick={() =>
                  console.log("index: ", Number(company.companyIndex))
                }
              >
                Get A Job
              </Button>
            </Card.Content>
          </Card>
        ))
      ) : (
        <>
          <Card>
            <Placeholder>
              <Placeholder.Image square />
            </Placeholder>

            <Card.Content>
              <Placeholder>
                <Placeholder.Header>
                  <Placeholder.Line length="very short" />
                  <Placeholder.Line length="medium" />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                  <Placeholder.Line length="short" />
                </Placeholder.Paragraph>
              </Placeholder>
            </Card.Content>

            <Card.Content extra>
              <Button disabled color="purple">
                Get A Job
              </Button>
              <Button disabled color="red">
                Fire from Job
              </Button>
            </Card.Content>
          </Card>
          <Card>
            <Placeholder>
              <Placeholder.Image square />
            </Placeholder>

            <Card.Content>
              <Placeholder>
                <Placeholder.Header>
                  <Placeholder.Line length="very short" />
                  <Placeholder.Line length="medium" />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                  <Placeholder.Line length="short" />
                </Placeholder.Paragraph>
              </Placeholder>
            </Card.Content>

            <Card.Content extra>
              <Button disabled color="purple">
                Get A Job
              </Button>
              <Button disabled color="red">
                Fire from Job
              </Button>
            </Card.Content>
          </Card>
          <Card>
            <Placeholder>
              <Placeholder.Image square />
            </Placeholder>

            <Card.Content>
              <Placeholder>
                <Placeholder.Header>
                  <Placeholder.Line length="very short" />
                  <Placeholder.Line length="medium" />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                  <Placeholder.Line length="short" />
                </Placeholder.Paragraph>
              </Placeholder>
            </Card.Content>

            <Card.Content extra>
              <Button disabled color="purple">
                Get A Job
              </Button>
              <Button disabled color="red">
                Fire from Job
              </Button>
            </Card.Content>
          </Card>
          <Card>
            <Placeholder>
              <Placeholder.Image square />
            </Placeholder>

            <Card.Content>
              <Placeholder>
                <Placeholder.Header>
                  <Placeholder.Line length="very short" />
                  <Placeholder.Line length="medium" />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                  <Placeholder.Line length="short" />
                </Placeholder.Paragraph>
              </Placeholder>
            </Card.Content>

            <Card.Content extra>
              <Button disabled color="purple">
                Get A Job
              </Button>
              <Button disabled color="red">
                Fire from Job
              </Button>
            </Card.Content>
          </Card>
          <Card>
            <Placeholder>
              <Placeholder.Image square />
            </Placeholder>

            <Card.Content>
              <Placeholder>
                <Placeholder.Header>
                  <Placeholder.Line length="very short" />
                  <Placeholder.Line length="medium" />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                  <Placeholder.Line length="short" />
                </Placeholder.Paragraph>
              </Placeholder>
            </Card.Content>

            <Card.Content extra>
              <Button disabled color="purple">
                Get A Job
              </Button>
              <Button disabled color="red">
                Fire from Job
              </Button>
            </Card.Content>
          </Card>
          <Card>
            <Placeholder>
              <Placeholder.Image square />
            </Placeholder>

            <Card.Content>
              <Placeholder>
                <Placeholder.Header>
                  <Placeholder.Line length="very short" />
                  <Placeholder.Line length="medium" />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                  <Placeholder.Line length="short" />
                </Placeholder.Paragraph>
              </Placeholder>
            </Card.Content>

            <Card.Content extra>
              <Button disabled color="purple">
                Get A Job
              </Button>
              <Button disabled color="red">
                Fire from Job
              </Button>
            </Card.Content>
          </Card>
        </>
      )}
    </Card.Group>
  );
};

export default Companies;
