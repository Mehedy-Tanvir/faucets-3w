import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  // Add a request interceptor to include token in headers
  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.log("track interceptor", error);
      if (error.response.status === 401 || error.response.status === 403) {
        console.log("before interception");
        localStorage.removeItem("token");
        navigate("/");
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        console.log("track interceptor", error);
        if (error.response.status === 401 || error.response.status === 403) {
          console.log("before interception");
          localStorage.removeItem("token");
          console.log("after interception");
          navigate("/");
        }
        return Promise.reject(error);
      }
    );
  }, [axiosSecure, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
