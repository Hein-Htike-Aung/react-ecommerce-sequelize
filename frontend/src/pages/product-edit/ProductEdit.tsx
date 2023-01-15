import React, { useState } from "react";
import "./product-edit.scss";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../../models/product.model";
import { useForm } from "react-hook-form";

type FormValues = {
  categoryId: number;
  productName: string;
  product_code: string;
  product_sku: string;
  regular_price: number;
  tags: string;
  sizes: string;
  quantity: number;
  color: string;
  gender: string;
  isFeatured: boolean;
  status: boolean;
  description: string;
  productImages: string[];
};

const ProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product>();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    setError,
  } = useForm<FormValues>();
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  return (
    <div className="productEdit">
      <ContentTitle title={`Product | ${productId ? "Edit" : "Add"}`} />

      <div className="productEditWrapper">
        <form className="productEditForm">
          <div className="left card">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className={`${errors.productName && "inputError"}`}
                {...register("productName", {
                  required: "Prduct name is required",
                })}
              />
              {errors.productName && (
                <p className="errorMsg">{errors.productName.message}</p>
              )}
            </div>
            <div className="form-group">
              <label>Description</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
              />
            </div>
          </div>
          <div className="right">
            <div className="card">
              <div className="rightWrapper">
                <div className="form-group">
                  <label>Product Code</label>
                  <input
                    type="text"
                    className={`${errors.productName && "inputError"}`}
                    {...register("product_code", {
                      required: "Product code is required",
                    })}
                  />
                  {errors.product_code && (
                    <p className="errorMsg">{errors.product_code.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
