import { useEffect, useState } from "react";
import "./product-edit.scss";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../../models/product.model";
import { useForm } from "react-hook-form";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  Switch,
} from "@mui/material";
import MultiChipSelect from "../../components/form/MultiChipSelect";
import GroupingSelect from "../../components/form/GroupingSelect";
import { axiosInstance } from "../../utils/axiosInstance";
import { ParentCategory } from "../../models/parentCategory.model";
import ImageUploadCard from "../../components/widgets/image-upload-card/ImageUploadCard";
import OutlinedButton from "../../components/form/outlined-button/OutlinedButton";
import ContainedButton from "../../components/form/contained-button/ContainedButton";

const sizes = ["XS", "SM", "LG", "XL", "XXL", "Free"];
const tags = ["New", "Sale", "Featured", "Top", "Best"];

type FormValues = {
  categoryId: number;
  productName: string;
  product_code: string;
  product_sku: string;
  regular_price: number;
  sale_price: number;
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
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<any>(null);

  const [parentCategories, setParentCategories] = useState<ParentCategory[]>();

  const [sizeValue, setSizeValue] = useState<string[]>(["XS"]);
  const [tagValue, setTagValue] = useState<string[]>(["New"]);

  const handleSizeChange = (event: SelectChangeEvent<typeof sizeValue>) => {
    const {
      target: { value },
    } = event;
    setSizeValue(typeof value === "string" ? value.split(",") : value);
  };

  const handleTagChange = (event: SelectChangeEvent<typeof tagValue>) => {
    const {
      target: { value },
    } = event;
    setTagValue(typeof value === "string" ? value.split(",") : value);
  };

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

  useEffect(() => {
    const fetchParentCategories = async () => {
      const res = await axiosInstance.get("/categories/parent_category_list");
      setParentCategories(res.data.data);
    };

    fetchParentCategories();
  }, []);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <div className="productEdit">
      <ContentTitle title={`Product | ${productId ? "Edit" : "Add"}`} />

      <div className="productEditWrapper">
        <form className="productEditForm" onDragEnter={handleDrag}>
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
                style={{ height: 200 }}
              />
            </div>
            <div style={{ marginTop: 40 }} className="form-group-row">
              <div className="form-group">
                <label>Sizes</label>
                <MultiChipSelect
                  handleSizeChange={handleSizeChange}
                  value={sizeValue}
                  values={sizes}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <GroupingSelect>
                  {parentCategories?.map((pc) => (
                    <optgroup key={pc.id} label={pc.parentCategoryName}>
                      {pc.categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.categoryName}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </GroupingSelect>
              </div>
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label>Status</label>
                <select name="" id="" className="select">
                  <option value="">Sale</option>
                  <option value="">New</option>
                  <option value="">Regular</option>
                  <option value="">Disable</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tags</label>
                <MultiChipSelect
                  handleSizeChange={handleTagChange}
                  value={tagValue}
                  values={tags}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Product Images</label>
              <ImageUploadCard
                attrName="img"
                dragActive={dragActive}
                errors={errors}
                file={file}
                handleDrag={handleDrag}
                register={register}
                setDragActive={setDragActive}
                setFile={setFile}
                img={""}
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
                <div className="form-group">
                  <label>Product SKU</label>
                  <input
                    type="text"
                    className={`${errors.product_sku && "inputError"}`}
                    {...register("product_sku", {
                      required: "Product SKU is required",
                    })}
                  />
                  {errors.product_sku && (
                    <p className="errorMsg">{errors.product_sku.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Others"
                    name="radio-buttons-group"
                    row={true}
                  >
                    <FormControlLabel
                      value="Men"
                      control={<Radio />}
                      label="Men"
                    />
                    <FormControlLabel
                      value="Women"
                      control={<Radio />}
                      label="Women"
                    />
                    <FormControlLabel
                      value="Kid"
                      control={<Radio />}
                      label="Kid"
                    />
                    <FormControlLabel
                      value="Others"
                      control={<Radio />}
                      label="Others"
                    />
                  </RadioGroup>
                </div>
                <div className="form-group">
                  <label>Available</label>
                  <input
                    type="number"
                    className={`${errors.quantity && "inputError"}`}
                    {...register("quantity", {
                      required: "Quantity is required",
                    })}
                  />
                  {errors.quantity && (
                    <p className="errorMsg">{errors.quantity.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Add Colors</label>
                  <div className="colors">
                    <div className="colorRadio">
                      <div className="colorBlock aqua" />
                      <span>Aqua</span>
                    </div>
                    <div className="colorRadio">
                      <div className="colorBlock black"></div>
                      <span>Black</span>
                    </div>
                    <div className="colorRadio">
                      <div className="colorBlock blue"></div>
                      <span>Blue</span>
                    </div>
                    <div className="colorRadio">
                      <div className="colorBlock brown"></div>
                      <span>Brown</span>
                    </div>
                    <div className="colorRadio">
                      <div className="colorBlock gold"></div>
                      <span>Gold</span>
                    </div>
                    <div className="colorRadio">
                      <div className="colorBlock gray"></div>
                      <span>Gray</span>
                    </div>
                    <div className="colorRadio">
                      <div className="colorBlock green"></div>
                      <span>Green</span>
                    </div>
                    <div className="colorRadio">
                      <div className="colorBlock white"></div>
                      <span>White</span>
                    </div>
                    <div className="colorRadio">
                      <div className="colorBlock yellow"></div>
                      <span>Yellow</span>
                    </div>
                  </div>
                </div>
                <div className="flex-end">
                  <OutlinedButton btnClick={() => {}}>Reset</OutlinedButton>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="rightWrapper">
                <div className="form-group">
                  <label>Regular Price</label>
                  <input
                    type="number"
                    placeholder="$ 0.00"
                    className={`${errors.regular_price && "inputError"}`}
                    {...register("regular_price", {
                      required: "Regular price is required",
                    })}
                  />
                  {errors.regular_price && (
                    <p className="errorMsg">{errors.regular_price.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Sale Price</label>
                  <input
                    type="number"
                    placeholder="$ 0.00"
                    className={`${errors.sale_price && "inputError"}`}
                    {...register("sale_price", {
                      required: "Sale price is required",
                    })}
                  />
                  {errors.sale_price && (
                    <p className="errorMsg">{errors.sale_price.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Featured Product"
                  />
                </div>
              </div>
            </div>
            <ContainedButton
              title={`${productId !== "0" ? "Edit Product" : "Create Product"}`}
              height={2.5}
              width={22.8}
              btnClick={() => {}}
              loading={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
