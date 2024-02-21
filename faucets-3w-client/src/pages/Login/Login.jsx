import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { FaGoogle } from "react-icons/fa";
import { useContext } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { AuthContext } from "../../Provider/AuthProvider";
import toast from "react-hot-toast";
const Login = () => {
  const authInfo = useContext(AuthContext);

  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    console.log(authInfo);
    authInfo?.setLoading(true);
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    const userInfo = {
      password,
      email,
    };
    axiosPublic
      .post("/jwt", userInfo)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        authInfo?.setUser(res.data.user);
        authInfo?.setLoading(false);

        toast.success("User logged in successfully");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        authInfo?.setUser(null);
        authInfo?.setLoading(false);
        toast.error("User was not logged in");
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
