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
import OutlinedButton from "../../components/form/outlined-button/OutlinedButton";
import ContainedButton from "../../components/form/contained-button/ContainedButton";
import { toast } from "react-toastify";
import uploadImg from "../../utils/uploadImg";

const sizes = ["XS", "SM", "LG", "XL", "XXL", "Free"];
const tags = ["New", "Sale", "Featured", "Top", "Best"];
const colors = [
  "aqua",
  "black",
  "blue",
  "brown",
  "gold",
  "gray",
  "green",
  "white",
  "yellow",
];

type FormValues = {
  categoryId: number;
  productName: string;
  product_code: string;
  product_sku: string;
  regular_price: number;
  sale_price: number;
  quantity: number;
  gender: string;
  isFeatured: boolean;
  status: boolean;
};

const ProductEdit = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<any>([]);

  const [parentCategories, setParentCategories] = useState<ParentCategory[]>();

  const [sizesValue, setSizesValue] = useState<string[]>(["XS"]);
  const [tagsValue, setTagsValue] = useState<string[]>(["New"]);
  const [colorsValue, setColorsValue] = useState<string[]>(["aqua"]);

  useEffect(() => {
    const fetchParentCategories = async () => {
      const res = await axiosInstance.get("/categories/parent_category_list");
      setParentCategories(res.data.data);
    };

    fetchParentCategories();
  }, []);

  const handleSizeChange = (event: SelectChangeEvent<typeof sizesValue>) => {
    const {
      target: { value },
    } = event;
    setSizesValue(typeof value === "string" ? value.split(",") : value);
  };

  const handleTagChange = (event: SelectChangeEvent<typeof tagsValue>) => {
    const {
      target: { value },
    } = event;
    setTagsValue(typeof value === "string" ? value.split(",") : value);
  };

  const handleColorChange = (color: string) => {
    setColorsValue((prev) =>
      prev.find((c) => color === c)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );

    if (colorsValue.length) {
      setFormErrors((prev) => ({ ...prev, colors: false }));
    }
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
  const [categoryId, setCategoryId] = useState();
  const [isFeatured, setIsFeatured] = useState(true);
  const [gender, setGender] = useState("Others");

  const [formErrors, setFormErrors] = useState({
    description: false,
    images: false,
    colors: false,
    categoryId: false,
  });

  const [loading, setLoading] = useState(false);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles((prev: any) => [...prev, e.dataTransfer.files[0]]);
      setFormErrors((prev) => ({ ...prev, images: false }));
    }
  };

  const handleChange = (e: any) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFiles((prev: any) => [...prev, e.target.files[0]]);
      setFormErrors((prev) => ({ ...prev, images: false }));
    }
  };

  const submitHandler = async (formValues: FormValues) => {
    // check validations
    if (!description) {
      setFormErrors((prev) => ({ ...prev, description: true }));
      return;
    } else setFormErrors((prev) => ({ ...prev, description: false }));
    if (!files.length) {
      setFormErrors((prev) => ({ ...prev, images: true }));
      return;
    } else setFormErrors((prev) => ({ ...prev, images: false }));
    if (!colorsValue.length) {
      setFormErrors((prev) => ({ ...prev, colors: true }));
      return;
    } else setFormErrors((prev) => ({ ...prev, colors: false }));
    if (!categoryId) {
      setFormErrors((prev) => ({ ...prev, categoryId: true }));
      return;
    } else setFormErrors((prev) => ({ ...prev, categoryId: false }));

    setLoading(true);
    const productImages: string[] = [];

    files.forEach((file: any, idx: number) =>
      uploadImg(file, async (downloadURL) => {
        productImages.push(downloadURL);
        console.log({ idx, length: files.length - 1 });
        // All Images are complete uploading
        if (idx === files.length - 1) {
          try {
            console.log(productImages);

            const res = await axiosInstance.post(`/products/create`, {
              ...formValues,
              regular_price: Number(formValues.regular_price),
              sale_price: Number(formValues.sale_price),
              quantity: Number(formValues.quantity),
              categoryId: Number(categoryId),
              description,
              isFeatured,
              gender,
              tags: tagsValue.join(),
              sizes: sizesValue.join(),
              colors: colorsValue.join(),
              productImages,
            });

            res.status === 201 && navigate("/product-list");
            setLoading(false);
          } catch (error: any) {
            console.log(error);
            setLoading(false);
            toast.error(error.response.data.message);
          }
        }
      })
    );
  };

  const removeImage = (fileIdx: number) => {
    setFiles((prev: any) =>
      prev.filter((_: any, idx: number) => idx !== fileIdx)
    );
  };

  const removeAllImages = () => {
    setFiles([]);
  };

  return (
    <div className="productEdit">
      <ContentTitle title={`Product | ${productId ? "Edit" : "Add"}`} />

      <div className="productEditWrapper">
        <form
          className="productEditForm"
          onSubmit={handleSubmit(submitHandler)}
          onDragEnter={handleDrag}
        >
          <div className="left card">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className={`${errors.productName && "inputError"}`}
                {...register("productName", {
                  required: "Product name is required",
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
              {formErrors.description && (
                <p style={{ marginTop: 40 }} className="errorMsg">
                  Description is required
                </p>
              )}
            </div>
            <div
              style={{ marginTop: `${formErrors.description ? -20 : 40}px` }}
              className="form-group-row"
            >
              <div className="form-group">
                <label>Sizes</label>
                <MultiChipSelect
                  handleSizeChange={handleSizeChange}
                  value={sizesValue}
                  values={sizes}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <GroupingSelect
                  onChange={(e: any) => {
                    setCategoryId(e.target.value);
                    setFormErrors((prev) => ({ ...prev, categoryId: false }));
                  }}
                >
                  <option value={""}>Select</option>
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
                {formErrors.categoryId && (
                  <p className="errorMsg">Category is required</p>
                )}
              </div>
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label>Status</label>
                <select
                  {...register("status", {
                    required: "Status is required",
                  })}
                  className="select"
                >
                  <option value="">Select</option>
                  <option value="Sale">Sale</option>
                  <option value="New">New</option>
                  <option value="Regular">Regular</option>
                  <option value="Disable">Disable</option>
                </select>
                {errors.status && (
                  <p className="errorMsg">{errors.status.message}</p>
                )}
              </div>
              <div className="form-group">
                <label>Tags</label>
                <MultiChipSelect
                  handleSizeChange={handleTagChange}
                  value={tagsValue}
                  values={tags}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Product Images</label>
              <div className="multiImagesUploadCard">
                <label htmlFor="file">
                  <div className={`imgCard`}>
                    <h3>Drop or Select Image</h3>
                    <div className="imgCover"></div>
                  </div>
                </label>
                {formErrors.images && (
                  <p className="errorMsg">Product image is required</p>
                )}
                <input
                  id="file"
                  type="file"
                  hidden={true}
                  accept="image/*"
                  onChange={handleChange}
                  onDragEnter={handleDrop}
                />
                {files.length ? (
                  <div className="productImagesContainer">
                    {files.map((file: any, idx: number) => (
                      <div key={idx} className="productImgWrapper">
                        <img
                          className="productImg"
                          src={URL.createObjectURL(file)}
                          alt=""
                        />
                        <div
                          className="deleteIconWrapper"
                          onClick={() => removeImage(idx)}
                        >
                          <span className="deleteIcon">-</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <></>
                )}
                {files.length ? (
                  <div className="flex-end">
                    <OutlinedButton btnClick={removeAllImages}>
                      Remove All
                    </OutlinedButton>
                  </div>
                ) : (
                  <></>
                )}
                {dragActive && (
                  <div
                    id="drag-file-element" // must provide
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  ></div>
                )}
              </div>
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
                    onChange={(e: any) => setGender(e.target.value)}
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
                    {colors.map((color) => (
                      <div
                        key={color}
                        className="colorRadio"
                        onClick={() => handleColorChange(color)}
                      >
                        <div className="colorBlockWrapper">
                          <div
                            className={`colorBlock ${color} ${
                              colorsValue.includes(color) ? "active" : ""
                            }`}
                          />
                        </div>
                        <span>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {formErrors.colors && (
                    <p className="errorMsg">Color is required</p>
                  )}
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
                    control={
                      <Switch
                        onChange={(e: any) => setIsFeatured(e.target.checked)}
                        defaultChecked
                      />
                    }
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
