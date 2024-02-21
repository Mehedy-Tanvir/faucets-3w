import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAxiosSecure from "../Hooks/useAxiosSecure";
export const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axiosSecure
      .get("/verifyAuth")
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setUser(null);
        setLoading(false);
      });
  }, [axiosSecure]);
  const authInfo = { user, loading, setUser, setLoading };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
