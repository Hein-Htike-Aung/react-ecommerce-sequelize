import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import { User } from "../../models/user.model";
import "./single-customer.scss";

const SingleCustomer = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User>();

  useEffect(() => {

  }, [])


  const fetchOrderDetailsByUserId = async () => {
    
  }

  return (
    <div className="singleCustomer">
      <ContentTitle title="Customers | Details"></ContentTitle>

      <div className="singleCustomerWrapper">
        <div className="singleCustomerBanner"></div>
      </div>
    </div>
  );
};

export default SingleCustomer;
