import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { FaGoogle } from "react-icons/fa";
import { useContext } from "react";

import toast from "react-hot-toast";
import { AuthContext } from "../../Provider/AuthProvider";
const Login = () => {
  const { setUser, setLoading } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email, password);
    // sending post request to server for login
    fetch("http://localhost:3000/jwt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        // expiresInMins: 60, // optional
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // saving the token to local storage
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setLoading(false);
        toast.success("User logged in...");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Unable to log in...");
      });
  };

  return (
    <div className="container-fluid">
      <div className="">
        <form onSubmit={handleSubmit} className="login-container-inside">
          <h1 className="title">Login</h1>
          <div className="inputs-container">
            <input
              placeholder="User Email"
              type="text"
              name="email"
              className="form-control"
              required
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              className="form-control"
              required
            />
          </div>
          <div className="button-container">
            <button className="btn btn-primary login-button">Login</button>
          </div>
          <p className="already-account">
            Do not have an account?{" "}
            <Link className="login-link" to="/register">
              Register
            </Link>
          </p>
          <p className="already-account">OR</p>
          <p className="already-account">
            Register with{" "}
            <button className="button-google">
              <FaGoogle />
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
