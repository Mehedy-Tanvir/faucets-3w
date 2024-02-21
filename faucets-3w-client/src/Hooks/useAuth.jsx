import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useAuth = () => {
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
  return authInfo;
};

export default useAuth;
