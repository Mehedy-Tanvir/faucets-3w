import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./navbar.css";
import { useContext, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { RxAvatar } from "react-icons/rx";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import toast from "react-hot-toast";

const Navbar = () => {
  const [walletName, setWalletName] = useState("Arbitrum Rinkeby");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //   logging out user
  const navigate = useNavigate();
  const { user, loading, setUser, setLoading } = useContext(AuthContext);
  console.log("from navbar", user);
  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("token"); // Remove token from localStorage
      setUser(null);
      setLoading(false);
      toast.success("User logged out");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      setUser(null);
      setLoading(false);
    }
  };
  return (
    <BootstrapNavbar
      collapseOnSelect
      expand="lg"
      className="bg-body-tertiary bg-white"
    >
      <Container>
        <BootstrapNavbar.Brand Link="/">
          <span className="brand-name">Faucets</span>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BootstrapNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <NavDropdown title={walletName} id="collapsible-nav-dropdown">
              <NavDropdown.Item
                onClick={() => setWalletName("Arbitrum Rinkeby")}
              >
                Arbitrum Rinkeby
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setWalletName("Avalanche Fuji")}>
                Avalanche Fuji
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => setWalletName("BNB Chain Testnet")}
              >
                BNB Chain Testnet
              </NavDropdown.Item>
              {/* <NavDropdown.Divider /> */}
              <NavDropdown.Item
                onClick={() => setWalletName("Ethereum Rinkeby")}
              >
                Ethereum Rinkeby
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setWalletName("Fantom Testnet")}>
                Fantom Testnet
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => setWalletName("Harmony Testnet")}
              >
                Harmony Testnet
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => setWalletName("POA Network Sokol")}
              >
                POA Network Sokol
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setWalletName("Polygon Mumbai")}>
                Polygon Mumbai
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#deets">
              <span onClick={handleShow} className="wallet-button">
                Connect Wallet
              </span>
            </Nav.Link>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {" "}
                  <strong>Connect your wallet</strong>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-container">
                  <div className="modal-item">
                    <img className="modal-item-img" src="/fox.png" alt="" />
                    <h4>MetaMask</h4>
                  </div>
                  <div className="modal-item">
                    <img className="modal-item-img" src="/wallet.svg" alt="" />
                    <h4>WalletConnect</h4>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            <Dropdown>
              <Dropdown.Toggle className="dropdown-auth" id="dropdown-basic">
                <RxAvatar className="avatar" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/">Home</Link>
                </Dropdown.Item>
                {user?.role == "admin" && !loading && (
                  <Dropdown.Item>
                    <Link to="/admin">Admin</Link>
                  </Dropdown.Item>
                )}
                {!user && !loading && (
                  <Dropdown.Item>
                    <Link to="/login">Log In</Link>
                  </Dropdown.Item>
                )}
                {!user && !loading && (
                  <Dropdown.Item>
                    <Link to="/register">Sign Up</Link>
                  </Dropdown.Item>
                )}

                {user && !loading && (
                  <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
