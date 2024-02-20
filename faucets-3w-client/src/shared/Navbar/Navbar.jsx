import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./navbar.css";
import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { RxAvatar } from "react-icons/rx";

const Navbar = () => {
  const [walletName, setWalletName] = useState("Arbitrum Rinkeby");
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
              <span className="wallet-button">Connect Wallet</span>
            </Nav.Link>
            <Dropdown>
              <Dropdown.Toggle className="dropdown-auth" id="dropdown-basic">
                <RxAvatar className="avatar" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Log In</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Sign Up</Dropdown.Item>
                <Dropdown.Item href="#/action-3">FAQ</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
