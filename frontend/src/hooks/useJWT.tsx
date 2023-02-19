import axios from "axios";
import jwt_decode from "jwt-decode";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const useJWT = () => {
  const { currentUser, logout } = useContext(AuthContext);

  const axiosJWT = axios.create({
    baseURL: "http://localhost:3001/api/v1/",
    headers: {
      authorization: "Bearer " + currentUser?.access_token,
    },
  });

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();

      const decodedToken: any = jwt_decode(currentUser?.access_token as string);

      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        await logout();
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosJWT;
};

export default useJWT;
