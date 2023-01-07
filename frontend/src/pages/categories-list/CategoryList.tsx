import React from "react";
import { useNavigate } from "react-router-dom";
import OutlinedButton from "../../components/form/outlined-button/OutlinedButton";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import "./category-list.scss";

const CategoryList = () => {
  const navigate = useNavigate();

  return (
    <div className="categoryList">
      <ContentTitle title="Categories">
        <OutlinedButton
          btnText="Add Category"
          btnClick={() => navigate("/categories/edit/0")}
        />
      </ContentTitle>
      <div className="categoryListWrapper"></div>
    </div>
  );
};

export default CategoryList;
