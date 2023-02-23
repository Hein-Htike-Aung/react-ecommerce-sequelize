import { AxiosInstance } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ContainedButton from "../../components/form/contained-button/ContainedButton";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import useJWT from "../../hooks/useJWT";
import { NewLetter } from "../../models/newLetter.model";
import { paginateRecords, paginationCount } from "../../utils/pagination";
import "./newLetter-list.scss";

type FormValues = {
  title: string;
  description: string;
  link: string;
};

const NewLetterList = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newLetters, setNewLetters] = useState<NewLetter[]>([]);
  const [newLettersCount, setNewLettersCount] = useState(0);

  const axiosJWT = useJWT();
  const jwtReq = useRef<AxiosInstance>(axiosJWT);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    setError,
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    fetchAllNewLetters(currentPage);
  }, [currentPage]);

  const fetchAllNewLetters = async (currentPage: number) => {
    const res = await jwtReq.current.get(`/newLetters/list`);

    if (res.data.data) {
      setNewLetters(paginateRecords(currentPage, res.data.data));
      setNewLettersCount(paginationCount(res.data.data));
    }
  };

  console.log(newLetters);

  const submitHandler = async (formValues: FormValues) => {
    const res = await jwtReq.current.post(`/newLetters/create`, {
      ...formValues,
    });

    if (res.data) {
      toast.success("Successfully created");
      reset();
    }
  };

  return (
    <div className="newLetterList">
      <ContentTitle title="NewsLetter" />
      <div className="newLetterListWrapper">
        <div className="left card">
          <form
            className="newLetterEditForm"
            onSubmit={handleSubmit(submitHandler)}
          >
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className={`input ${errors.title && "inputError"}`}
                {...register("title", {
                  required: "Title is required",
                })}
              />
              {errors.title && (
                <p className="errorMsg">{errors.title.message}</p>
              )}
            </div>
            <div className="form-group">
              <label>Link</label>
              <input
                type="text"
                className={`input ${errors.link && "inputError"}`}
                {...register("link", {
                  required: "Link is required",
                })}
              />
              {errors.link && <p className="errorMsg">{errors.link.message}</p>}
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
            <div style={{ marginTop: "20px" }}>
              <ContainedButton
                title={`${"Create NewLetter"}`}
                height={2.5}
                width={15}
                btnClick={() => {}}
                loading={loading}
              />
            </div>
          </form>
        </div>
        <div className="right"></div>
      </div>
    </div>
  );
};

export default NewLetterList;
