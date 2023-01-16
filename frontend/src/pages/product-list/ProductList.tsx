import React from "react";
import { useNavigate } from "react-router-dom";
import OutlinedButton from "../../components/form/outlined-button/OutlinedButton";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import "./product-list.scss";

const ProductList = () => {
  const navigate = useNavigate();

  const searchProduct = (value: string) => {};

  return (
    <div className="productList">
      <ContentTitle title="Products">
        <OutlinedButton btnClick={() => navigate("/products/edit/0")}>
          <AddIcon /> Add Product
        </OutlinedButton>
      </ContentTitle>

      <div className="productListWrapper">
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            onChange={(e) => searchProduct(e.target.value)}
            placeholder="Search"
            className="searchInput"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
