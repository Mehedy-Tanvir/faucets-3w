import { useContext } from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";

const PrivateRoutes = ({ children }) => {
  const location = useLocation();
  // Getting the states using context API
  const { user, loading } = useContext(AuthContext);

  // If loading, show spinner
  if (loading) {
    return (
      <div className="flex items-start justify-center h-screen">
        <span className="block loading loading-spinner loading-lg text-[#6C2C70]"></span>
      </div>
    );
  } else {
    // If user is logged in and has the role of "admin", allow access
    if (user && user.role === "admin") {
      return children;
    } else {
      // Otherwise, redirect user to the home page
      return <Navigate state={location.pathname} to="/" />;
    }
  }
};

// Prop types validation
PrivateRoutes.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoutes;
