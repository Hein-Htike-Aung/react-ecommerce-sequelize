import React, { useEffect, useState } from "react";
import ContainedButton from "../../components/form/contained-button/ContainedButton";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import { ParentCategory } from "../../models/parentCategory.model";
import { axiosInstance } from "../../utils/axioInstance";
import { useForm } from "react-hook-form";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import "./category-edit.scss";
import app from "../../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import ImageUploadCard from "../../components/widgets/image-upload-card/ImageUploadCard";
import { toast } from "react-toastify";

type FormValues = {
  categoryName: string;
  description: string;
  parentCategoryId: number;
  img: string;
};

const CategoryEdit = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    setError,
  } = useForm<FormValues>();
  const [file, setFile] = useState<any>(null);
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>(
    []
  );

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (parentCategories.length)
      setValue("parentCategoryId", parentCategories[0].id);
  }, [parentCategories, setValue]);

  useEffect(() => {
    const fetchParentCategories = async () => {
      const res = await axiosInstance.get("/categories/parent_category_list");

      setParentCategories(res.data.data);
    };

    fetchParentCategories();
  }, []);

  const submitHandler = (formValues: FormValues) => {
    if (file) {
      setLoading(true);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
            default:
              break;
          }
        },
        (error) => console.error(error),
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const res = await axiosInstance.post(`/categories/create`, {
              ...formValues,
              parentCategoryId: Number(formValues.parentCategoryId),
              img: downloadURL,
            });

            setLoading(false);
            res.data && navigate("/categories", { replace: true });
          } catch (error: any) {
            setLoading(false);
            toast.error(error.response.data.message);
          }
        }
      );
    } else setError("img", { message: "Cover photo is required" });
  };

  const [dragActive, setDragActive] = React.useState(false);

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
      <ContentTitle title="Categories | Add" />
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
                className={`${errors.categoryName && "inputError"}`}
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
                className={`${errors.description && "inputError"}`}
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
                  />
                  {errors.img && (
                    <p className="errorMsg">{errors.img.message}</p>
                  )}
                </div>
              </div>
            </div>
            <ContainedButton
              title="Create Category"
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
