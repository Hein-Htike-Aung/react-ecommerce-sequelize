import { AxiosInstance } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import useJWT from "../../hooks/useJWT";
import { User } from "../../models/user.model";
import "./single-customer.scss";

const SingleCustomer = () => {
  const { id: customerId } = useParams();
  const [user, setUser] = useState<User>();

  const axiosJWT = useJWT();

  const jwtReq = useRef<AxiosInstance>(axiosJWT);

  useEffect(() => {
    if (customerId) {
      fetchOrderDetailsByUserId(+customerId);
    }
  }, [customerId]);

  const fetchOrderDetailsByUserId = async (customerId: number) => {
    const res = await jwtReq.current.get(
      `orders/details_for_customer/${customerId}`
    );

    setUser(res.data.data);
  };

  console.log(user);

  return (
    <div className="singleCustomer">
      <ContentTitle title="Customers | Details"></ContentTitle>

      <div className="singleCustomerWrapper">
        {user ? (
          <></>
        ) : (
          <div className="no_data_wrapper">
            <img src={"../no_data.png"} className="no_data" alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleCustomer;
