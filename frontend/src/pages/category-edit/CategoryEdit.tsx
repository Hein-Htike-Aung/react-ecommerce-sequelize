import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ContainedButton from "../../components/form/contained-button/ContainedButton";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import ImageUploadCard from "../../components/widgets/image-upload-card/ImageUploadCard";
import { Category } from "../../models/category.model";
import { ParentCategory } from "../../models/parentCategory.model";
import { axiosInstance } from "../../utils/axiosInstance";
import uploadImg from "../../utils/uploadImg";
import "./category-edit.scss";

type FormValues = {
  categoryName: string;
  description: string;
  parentCategoryId: number;
  img: string;
};

const CategoryEdit = () => {
  let { id: categoryId } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category>();
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>(
    []
  );
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    setError,
  } = useForm<FormValues>();

  // functions
  const fetchCategory = async (id: number) => {
    const res = await axiosInstance.get(`/categories/by_id/${id}`);

    setCategory(res.data.data);
  };

  // useEffect
  useEffect(() => {
    if (categoryId !== "0") fetchCategory(Number(categoryId));
  }, [categoryId]);

  useEffect(() => {
    if (parentCategories.length)
      setValue("parentCategoryId", parentCategories[0].id);
  }, [parentCategories, setValue]);

  useEffect(() => {
    if (category) {
      setValue("categoryName", category.categoryName);
      setValue("description", category.description);
      setValue("parentCategoryId", category.parentCategoryId);
      setValue("img", category.img);
    }
  }, [category, setValue]);

  useEffect(() => {
    const fetchParentCategories = async () => {
      const res = await axiosInstance.get("/categories/parent_category_list");

      setParentCategories(res.data.data);
    };

    fetchParentCategories();
  }, []);

  // form submit
  const submitHandler = async (formValues: FormValues) => {
    if (categoryId !== "0") {
      // edit
      if (file) {
        setLoading(true);
        uploadImg(file, async (downloadURL) => {
          try {
            const res = await axiosInstance.patch(
              `/categories/update/${categoryId}`,
              {
                ...formValues,
                parentCategoryId: Number(formValues.parentCategoryId),
                img: downloadURL,
              }
            );

            setLoading(false);
            res.data && navigate("/categories", { replace: true });
          } catch (error: any) {
            setLoading(false);
            toast.error(error.response.data.message);
          }
        });
      } else {
        try {
          setLoading(true);
          const res = await axiosInstance.patch(
            `/categories/update/${categoryId}`,
            {
              ...formValues,
              parentCategoryId: Number(formValues.parentCategoryId),
              img: category?.img,
            }
          );
          setLoading(false);
          res.data && navigate("/categories", { replace: true });
        } catch (error: any) {
          setLoading(false);
          toast.error(error.response.data.message);
        }
      }
    } else {
      // add new
      if (file) {
        setLoading(true);

        uploadImg(file, async (downloadURL) => {
          try {
            const res = await axiosInstance.post(`/categories/create`, {
              ...formValues,
              parentCategoryId: Number(formValues.parentCategoryId),
              img: downloadURL,
            });

            setLoading(false);
            res.status === 200 && navigate("/categories", { replace: true });
          } catch (error: any) {
            setLoading(false);
            toast.error(error.response.data.message);
          }
        });
      } else setError("img", { message: "Cover photo is required" });
    }
  };

  // handle change
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
    <div className="categoryEdit">
      <ContentTitle title={`Categories | ${categoryId ? "Edit" : "Add"}`} />
      <div className="categoryEditWrapper">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="categoryEditForm"
          onDragEnter={handleDrag}
        >
          <div className="left card">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className={`input ${errors.categoryName && "inputError"}`}
                {...register("categoryName", {
                  required: "Category name is required",
                })}
              />
              {errors.categoryName && (
                <p className="errorMsg">{errors.categoryName.message}</p>
              )}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className={`textarea ${errors.description && "inputError"}`}
                rows={4}
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="errorMsg">{errors.description.message}</p>
              )}
            </div>
          </div>
          <div className="right">
            <div className="card">
              <div className="rightWrapper">
                <select
                  {...register("parentCategoryId", {
                    required: true,
                  })}
                  className="select"
                >
                  {parentCategories?.map((pc) => (
                    <option key={pc.id} value={pc.id}>
                      {pc.parentCategoryName}
                    </option>
                  ))}
                </select>

                <div className="form-group">
                  <label>Cover</label>
                  <ImageUploadCard
                    attrName="img"
                    dragActive={dragActive}
                    errors={errors}
                    file={file}
                    handleDrag={handleDrag}
                    register={register}
                    setDragActive={setDragActive}
                    setFile={setFile}
                    img={category?.img}
                  />
                  {errors.img && (
                    <p className="errorMsg">{errors.img.message}</p>
                  )}
                </div>
              </div>
            </div>

            <ContainedButton
              title={`${
                categoryId !== "0" ? "Edit Category" : "Create Category"
              }`}
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

export default CategoryEdit;
