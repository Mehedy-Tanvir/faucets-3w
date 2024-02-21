import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { FaGoogle } from "react-icons/fa";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import toast from "react-hot-toast";
const Register = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    const userInfo = {
      name,
      password,
      email,
    };
    axiosPublic
      .post("/users", userInfo)
      .then((res) => {
        console.log(res.data);

        toast.success("User registered successfully");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        toast.error("User was not registered");
      });
  };
  return (
    <div className="container-fluid">
      <div className="">
        <form onSubmit={handleSubmit} className="login-container-inside">
          <h1 className="title">Register</h1>
          <div className="inputs-container">
            <input
              name="name"
              placeholder="Enter name"
              type="text"
              className="form-control"
              required
            />
            <input
              name="email"
              placeholder="Enter email"
              type="text"
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
            <button className="btn btn-primary login-button">Register</button>
          </div>
          <p className="already-account">
            Already have an account?{" "}
            <Link className="login-link" to="/login">
              Login
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

export default Register;
