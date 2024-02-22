import { useContext } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import { AuthContext } from "../../Provider/AuthProvider";
import RequestFom from "../../components/RequestForm/RequestFom";
const Home = () => {
  const { walletName } = useContext(AuthContext);
  return (
    <div>
      <div className="notice-container">
        <h1 className="notice-text">Notice Here</h1>
      </div>
      <div className="request-container">
        <div>
          <h1 className="request-title">Request testnet LINK</h1>
          <p className="request-description">
            Get testnet LINK for an account on one of the supported blockchain
            testnets so you can create and test your own oracle and Chainlinked
            smart contract
          </p>
        </div>
        <h4 className="wallet-text">
          Your wallet is connected to <strong>{walletName}</strong>, so you are
          requesting <strong>{walletName}</strong> Link/ETH.
        </h4>
        <RequestFom></RequestFom>
      </div>
    </div>
  );
};

export default Home;
