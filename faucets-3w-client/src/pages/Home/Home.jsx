import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RequestFom from "../../components/RequestForm/RequestFom";
import { AuthContext } from "../../Provider/AuthProvider";
import "./home.css";

const Home = () => {
  const location = useLocation();
  const { setUser, setLoading, walletName } = useContext(AuthContext);
  // parsing query to find token and user info
  useEffect(() => {
    setLoading(true);
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get("success");
    const googleToken = searchParams.get("token");
    const name = searchParams.get("name");
    const role = searchParams.get("role");
    const email = searchParams.get("email");

    if (success === "true" && googleToken) {
      // If success is true and token exists in query parameters, set the token in local storage
      localStorage.setItem("token", googleToken);
      setUser({ name, role, email });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [location.search, setLoading, setUser]);

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
