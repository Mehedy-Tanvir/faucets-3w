import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
// creating and exporting context
export const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // getting the token from local storage
    const token = localStorage.getItem("token");
    // sending post request to server with token for getting user information
    if (token) {
      fetch("http://localhost:3000/verifyAuth", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // updating the states

          setUser(data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setUser(null);
          setLoading(false);
        });
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);
  //   saving states to an object
  const authInfo = { user, loading, setUser, setLoading };
  //   giving access to the object value
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};
// prop types validation
AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
