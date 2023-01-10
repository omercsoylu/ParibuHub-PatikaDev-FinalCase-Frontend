import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Card,
  Message,
  Segment,
  Placeholder,
  Header,
  Pagination,
  Container,
  Modal,
  Table,
} from "semantic-ui-react";
import { ethers } from "ethers";
import Contracts from "../Contracts";
import Abi from "../Abi";

const Profile = (props) => {
  const apiKey = process.env.REACT_APP_ALCHEMY_API_KEY;
  const [signer, setSigner] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [provider, setProvider] = useState();

  const initializeF = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const sig = provider.getSigner();
    const resAdd = await sig.getAddress();
    setSigner(sig);
    setProvider(provider);
    setWalletAddress(resAdd);
  };

  /*  -------------Employed------------ */
  const [employees, setEmployees] = useState([]);
  const getEmployees = async () => {
    setEmployees([]);
    const wContract = new ethers.Contract(
      Contracts.BUSINESS_WORLD,
      Abi.BUSINESS_WORLD,
      provider
    );

    const getEmployees = await wContract.getEmployees(walletAddress);
    if (getEmployees.length > 0) {
      console.log(
        "There is many employees::: ",
        getEmployees,
        "length: ",
        getEmployees.length
      );
      for (let i = 0; i < getEmployees.length; i++) {
        if (getEmployees[i] == 0) {
          // if delete this stake, will not listed.
          continue;
        }
        const employee = await wContract.employees(getEmployees[i]);
        let draftData = getDraftDataOfNFT(getEmployees[i]);
        draftData.companyId = Number(employee.companyId);
        draftData.startAt = Number(employee.startAt);
        draftData.lastClaimedAt = Number(employee.lastClaimedAt);
        draftData.employeeId = Number(employee.employeeId);

        console.log("Employees::: ", draftData);
        setEmployees((employees) => [...employees, draftData]);
      }
      console.log("Employees::: ", employees);
      //
    } else {
      console.log("no employee");
    }
  };
  /*  -------------claim income------------ */
  const claimIncome = async (_employeeId) => {
    const wContract = new ethers.Contract(
      Contracts.BUSINESS_WORLD,
      Abi.BUSINESS_WORLD,
      provider
    );

    const worldContract = wContract.connect(signer);
    const tx = await worldContract.claimAccumulateIncome(_employeeId);
    console.log("claimAccumulateIncome: ", tx);
  };

  /*  -------------get fired ------------ */
  const getFired = async (_employeeId) => {
    const wContract = new ethers.Contract(
      Contracts.BUSINESS_WORLD,
      Abi.BUSINESS_WORLD,
      provider
    );

    const worldContract = wContract.connect(signer);
    const tx = await worldContract.fireFromJob(_employeeId);
    console.log("fireFromJob: ", tx);
  };

  /*  ------------------------------Employed--------------------------------------------- */

  /*  ---------------Unemployed------------   */
  const [maxUnemployeesPage, setMaxUnemployeesPage] = useState();
  const [activeUnemployeesPage, setActiveUnemployeesPage] = useState(1);
  const [viewUnemployees, setViewUnemployees] = useState([]);
  const [maxOwn, setMaxOwn] = useState();
  const [unemployees, setUnemployees] = useState([]);
  const getUnemployees = async () => {
    setUnemployees([]);

    const wContract = new ethers.Contract(
      Contracts.BUSINESS_CARD,
      Abi.BUSINESS_CARD,
      provider
    );

    console.log("walletAddress", walletAddress);

    const ownCount = await wContract.balanceOf(walletAddress);
    let maxOfOwn = Number(ownCount);
    setMaxOwn(maxOfOwn);
    console.log("maxOfOwn: ", maxOfOwn);
    let loopCounter = 1;
    let foundCounter = 0;
    while (true) {
      if (foundCounter == maxOfOwn) {
        break;
      } else {
        const getOwner = await wContract.ownerOf(loopCounter);
        if (getOwner.toLowerCase() == walletAddress.toLowerCase()) {
          let data = getDraftDataOfNFT(loopCounter);
          data.isApproved = await isApproved(data.id);
          setUnemployees((unemployees) => [...unemployees, data]);
          console.log("data: ", data);
          foundCounter++;
        }
      }
      console.log(
        "unemployees.length: ",
        unemployees.length,
        "maxOfOwn: ",
        maxOfOwn,
        "foundCounter: ",
        foundCounter
      );
      loopCounter++;
    }

    // end of things
    unemployeesMaxPage(maxOfOwn);
    viewPageUnemployees(activeUnemployeesPage);
  };
  // isapproved
  const isApproved = async (_employeeId) => {
    const cContract = new ethers.Contract(
      Contracts.BUSINESS_CARD,
      Abi.BUSINESS_CARD,
      provider
    );

    const approvedAddress = await cContract.getApproved(_employeeId);
    if (
      approvedAddress.toLowerCase() == Contracts.BUSINESS_WORLD.toLowerCase()
    ) {
      return true;
    } else {
      return false;
    }
  };
  // employee max page calculate...
  const unemployeesMaxPage = async (_maxOfOwn) => {
    console.log("max page ....", _maxOfOwn);
    let length = _maxOfOwn;
    if (length <= 3) {
      setMaxUnemployeesPage(1);
      console.log("max page .... length <= 3");
    } else if (length > 3) {
      console.log("lenght > 3");
      if (length % 3 == 1) {
        setMaxUnemployeesPage((length + 2) / 3);
        console.log("setMaxUnemployeesPage", maxUnemployeesPage);
      } else if (length % 3 == 2) {
        console.log("setMaxUnemployeesPage", maxUnemployeesPage);
        setMaxUnemployeesPage((length + 1) / 3);
      } else if (length % 3 == 0) {
        setMaxUnemployeesPage(length / 3);
        console.log("setMaxUnemployeesPage", maxUnemployeesPage);
      }
    }
  };
  // viewunemployee in page
  const viewPageUnemployees = async (_activePage) => {
    console.log("maxOwn::: clicked", maxOwn);
    let length = maxOwn;
    console.log("length in viewpage: ", maxOwn);
    setViewUnemployees([]);
    let startIndex = (_activePage - 1) * 3;
    console.log("startIndex", startIndex);
    let lastIndex;
    console.log("lastIndex", lastIndex);

    if (startIndex + 1 == length) {
      lastIndex = startIndex + 1;
    } else if (startIndex + 2 == length) {
      lastIndex = startIndex + 2;
    } else if (startIndex + 2 == length) {
      lastIndex = startIndex + 3;
    } else {
      lastIndex = 3;
    }

    console.log(
      "startIndex: ",
      startIndex,
      "lastIndex: ",
      lastIndex,
      "_activePage",
      _activePage
    );
    for (let i = startIndex; i < lastIndex; i++) {
      setViewUnemployees((view) => [...view, unemployees[i]]);
      console.log("viewEmployee: ", viewUnemployees);
    }
  };
  useEffect(() => {
    viewPageUnemployees(activeUnemployeesPage);
  }, [unemployees]);
  // is page changed
  const setUnemployeesPageChange = async (e, { activePage }) => {
    setActiveUnemployeesPage(activePage);
    console.log("page changed. active page : ", activePage);
    viewPageUnemployees(activePage);
  };
  // employee approve to contract
  const giveApproveToContract = async (_employeeId, _arrayIndex) => {
    const cContract = new ethers.Contract(
      Contracts.BUSINESS_CARD,
      Abi.BUSINESS_CARD,
      provider
    );

    const cardContract = cContract.connect(signer);
    const tx = await cardContract.approve(
      Contracts.BUSINESS_WORLD,
      _employeeId
    );
    console.log("approvedData: ", tx);

    const prevList = [...unemployees];
    const item = prevList.find((item) => item.id === _arrayIndex);
    item.isApproved = await isApproved(_employeeId);
    setUnemployees(prevList);
  };
  // ----get employee to job------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEmployeeId, setModalEmployeeId] = useState();
  const [modalEmployeeHeader, setModalEmployeeHeader] = useState();
  const [modalEmployeeName, setModalEmployeeName] = useState();
  const [modalEmployeeTitle, setModalEmployeeTitle] = useState();
  const getEmployeeToJob = async (_employeeId, _companyId) => {
    const wContract = new ethers.Contract(
      Contracts.BUSINESS_WORLD,
      Abi.BUSINESS_WORLD,
      provider
    );

    const worldContract = wContract.connect(signer);
    const tx = await worldContract.hireAJob(_companyId, _employeeId);
    console.log(
      "get employee to job: ",
      "companyID: ",
      _companyId,
      "employeeID: ",
      _employeeId,
      "transaction: ",
      tx
    );
  };

  /*  -------------------------------------Unemployed-----------------------------   */

  // company things
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
      // getcompanies max 10
      for (let i = 0; i < 10; i++) {
        if (Number(data[i].baseSalary) == 0) {
          continue;
        }
        setCompanies((companies) => [...companies, data[i]]);
      }
    }
  };
  useEffect(() => {
    getCompanies();
  }, []);
  //

  const showJobModal = (_employeeId, _name, _title) => {
    /* variables */
    setModalEmployeeHeader("Employee: #" + _employeeId);
    setModalEmployeeId(_employeeId);
    setModalEmployeeName(_name);
    setModalEmployeeTitle(_title);

    /*last thing. show() */
    setIsModalOpen(true);
  };
  /*----------------------event listeners--------------------------------*/
  const listenContract = async () => {
    const wContract = new ethers.Contract(
      Contracts.BUSINESS_WORLD,
      Abi.BUSINESS_WORLD,
      provider
    );

    wContract.on("HireAJob", (_employeeId, _employeeOwner) => {
      console.log(
        "HireAJob",
        "_employeeId: ",
        _employeeId,
        "_employeeOwner: ",
        _employeeOwner
      );

      if (_employeeOwner == walletAddress) {
        getUnemployees();
        getEmployees();
      }
    });

    wContract.on("FireFromJob", (_employeeId, _employeeOwner) => {
      console.log(
        "FireFromJob",
        "_employeeId: ",
        _employeeId,
        "_employeeOwner: ",
        _employeeOwner
      );

      if (_employeeOwner == walletAddress) {
        getUnemployees();
        getEmployees();
      }
    });

    const cContract = new ethers.Contract(
      Contracts.BUSINESS_CARD,
      Abi.BUSINESS_CARD,
      provider
    );
    cContract.on("Approval", (_owner, _spender, _value) => {
      console.log(
        "Approval",
        "_owner: ",
        _owner,
        "_spender: ",
        _spender,
        "_value",
        _value
      );
      if (_owner == walletAddress) {
        getUnemployees();
      }
    });
  };
  /*------------------------------------------------------*/

  const getDraftDataOfNFT = (_id) => {
    if (_id % 10 == 1) {
      return {
        id: _id,
        name: "Jenna",
        title: "Chief Executive Officer",
        salary: "25 BST",
      };
    } else if (_id % 10 > 1 && _id % 10 <= 4) {
      return {
        id: _id,
        name: "John",
        title: "Chief Financial Officer",
        salary: "20 BST",
      };
    } else if (_id % 10 > 4 && _id % 10 <= 7) {
      return {
        id: _id,
        name: "Senna",
        title: "Chief Technology Officer",
        salary: "15 BST",
      };
    } else if (_id % 10 > 7 && _id % 10 <= 9) {
      return {
        id: _id,
        name: "Lena",
        title: "Chief Operating Officer",
        salary: "10 BST",
      };
    } else {
      return {
        id: _id,
        name: "Elena",
        title: "Chief Marketing Officer",
        salary: "5 BST",
      };
    }
  };

  useEffect(() => {
    if (props.wallet != "") {
      initializeF();
    } else {
      setWalletAddress("");
      setUnemployees([]);
      setEmployees([]);
      setViewUnemployees([]);
      setCompanies([]);
    }
  }, [props.wallet]);

  useEffect(() => {
    listenContract();
  }, [provider]);

  useEffect(() => {
    if (walletAddress != "") {
      getUnemployees();
      getEmployees();
      getCompanies();
    } else {
      setUnemployees([]);
      setEmployees([]);
      setViewUnemployees([]);
    }
  }, [walletAddress]);

  return (
    <>
      <Message>
        <Message.Header>PROFILE</Message.Header>
        <p>You can see the status of your NFTs here.</p>
      </Message>
      <Message>
        <Message.Header>Your Unemployers</Message.Header>
      </Message>
      {employees.length == 0 ? (
        <>
          <Segment raised>
            <Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length="medium" />
                <Placeholder.Line length="short" />
              </Placeholder.Paragraph>
            </Placeholder>
          </Segment>
          <Segment raised>
            <Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length="medium" />
                <Placeholder.Line length="short" />
              </Placeholder.Paragraph>
            </Placeholder>
          </Segment>
        </>
      ) : (
        viewUnemployees.map((nft, index) => (
          <Card.Group centered key={index}>
            <Card>
              <Card.Content>
                <Image
                  floated="right"
                  size="mini"
                  src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
                />
                <Card.Header>{nft?.name}</Card.Header>
                <Card.Meta>{nft?.title}</Card.Meta>
                <Card.Description>
                  <strong>#{nft?.id}</strong> I'm looking for a job.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui two buttons">
                  {nft?.isApproved ? (
                    <Button disabled color="green">
                      Approved
                    </Button>
                  ) : (
                    <Button
                      basic
                      color="green"
                      onClick={(e) => giveApproveToContract(nft.id, index)}
                    >
                      Approve
                    </Button>
                  )}
                  {nft?.isApproved ? (
                    <Button
                      basic
                      color="purple"
                      onClick={(e) => showJobModal(nft.id, nft.name, nft.title)}
                    >
                      Get a Job
                    </Button>
                  ) : (
                    <Button basic disabled color="purple">
                      Get a Job
                    </Button>
                  )}
                </div>
              </Card.Content>
            </Card>
          </Card.Group>
        ))
      )}
      {employees.length > 0 ? (
        <Container textAlign="center" style={{ marginTop: "1rem" }}>
          <Pagination
            activePage={activeUnemployeesPage}
            totalPages={maxUnemployeesPage}
            onPageChange={setUnemployeesPageChange}
          />
        </Container>
      ) : null}

      <Message>
        <Message.Header>Your Employers</Message.Header>
      </Message>
      {employees.length == 0 ? (
        <>
          <Segment raised>
            <Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length="medium" />
                <Placeholder.Line length="short" />
              </Placeholder.Paragraph>
            </Placeholder>
          </Segment>
          <Segment raised>
            <Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length="medium" />
                <Placeholder.Line length="short" />
              </Placeholder.Paragraph>
            </Placeholder>
          </Segment>
        </>
      ) : (
        employees.map((nft, index) => (
          <Card.Group centered key={index}>
            <Card>
              <Card.Content>
                <Image
                  floated="right"
                  size="mini"
                  src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
                />
                <Card.Header>{nft?.name}</Card.Header>
                <Card.Meta>{nft?.title}</Card.Meta>
                <Card.Description>
                  <strong> #{Number(nft?.id)}</strong> I'm looking for a job.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui two buttons">
                  <Button
                    basic
                    color="green"
                    onClick={(e) => claimIncome(nft.id)}
                  >
                    Claim Income
                  </Button>
                  <Button basic color="red" onClick={(e) => getFired(nft.id)}>
                    Get Fired
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </Card.Group>
        ))
      )}

      {/* This is modal for hire a job
       */}

      <Modal
        onClose={() => setIsModalOpen(false)}
        onOpen={() => setIsModalOpen(true)}
        open={isModalOpen}
      >
        <Modal.Header>{modalEmployeeHeader}</Modal.Header>
        <Modal.Content image>
          <Image
            size="small"
            src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
            wrapped
          />
          <Modal.Description>
            <Header>{modalEmployeeName}</Header>
            <p>{modalEmployeeTitle}</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Content>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Company Id</Table.HeaderCell>
                <Table.HeaderCell>Company Name</Table.HeaderCell>
                <Table.HeaderCell>Base Salary</Table.HeaderCell>
                <Table.HeaderCell>Employment</Table.HeaderCell>
                <Table.HeaderCell textAlign="right">Notes</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {companies.length > 0
                ? companies.map((company, _index) => (
                    <Table.Row key={_index}>
                      <Table.Cell>{Number(company?.companyIndex)}</Table.Cell>
                      <Table.Cell>{company?.name}</Table.Cell>
                      <Table.Cell>{Number(company?.baseSalary)}</Table.Cell>
                      <Table.Cell>
                        {Number(company?.activeEmployee)} /
                        {Number(company?.maxEmployment)}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          color="purple"
                          floated="right"
                          onClick={(e) =>
                            getEmployeeToJob(
                              modalEmployeeId,
                              company?.companyIndex
                            )
                          }
                        >
                          Hire a Job
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))
                : null}
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button color="violet" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Profile;
