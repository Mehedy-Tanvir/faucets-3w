import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import PropTypes from "prop-types";
import { AuthContext } from "../../Provider/AuthProvider";

const AuthPrivateRoutes = ({ children }) => {
  const location = useLocation();
  // getting the states using context api
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    // if loading than show spinner
    return (
      <div className="flex items-start justify-center h-screen">
        <span className="block loading loading-spinner loading-lg text-[#6C2C70]"></span>
      </div>
    );
  } else {
    // if user information available redirect it to homepage else let user pass
    if (user) {
      return <Navigate state={location.pathname} to="/"></Navigate>;
    } else {
      return children;
    }
  }
};
// prop type validation
AuthPrivateRoutes.propTypes = {
  children: PropTypes.node,
};
export default AuthPrivateRoutes;
