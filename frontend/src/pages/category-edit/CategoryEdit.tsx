import React from "react";
import ContainedButton from "../../components/form/contained-button/ContainedButton";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import "./category-edit.scss";

const CategoryEdit = () => {
  return (
    <div className="categoryEdit">
      <ContentTitle title="Categories | Add" />
      <div className="categoryEditWrapper">
        <div className="left">
          <form className="card">
            <div className="form-group">
              <label>Name</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" />
            </div>
          </form>
        </div>
        <div className="right">
          <div className="card">
            <select name="" id=""></select>
          </div>
          <ContainedButton
            title="Create Category"
            height={2.5}
            width={22.8}
            btnClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryEdit;
