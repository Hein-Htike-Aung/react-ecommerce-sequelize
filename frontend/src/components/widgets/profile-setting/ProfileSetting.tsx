import { MenuItem, Select, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/authContext";
import useJWT from "../../../hooks/useJWT";
import ContainedButton from "../../form/contained-button/ContainedButton";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import "./profile-setting.scss";
import uploadImg from "../../../utils/uploadImg";

type FormValues = {
  fullName: string;
  phone: string;
  gender: string;
  about: string;
  email: string;
};

const ProfileSetting = () => {
  const { currentUser, updateCurrentUser } = useContext(AuthContext);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const axiosJwt = useJWT();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    setValue("fullName", currentUser.fullName);
    setValue("email", currentUser.email);
    setValue("phone", currentUser.phone);
    setValue("gender", currentUser.gender);
    setValue("about", currentUser.about || "");
  }, [currentUser, setValue]);

  const submitHandler = async (formValues: FormValues) => {
    try {
      setLoading(true);
      if (file) {
        uploadImg(file, async (downloadURL) => {
          const targetFormValues = {
            ...formValues,
            img: downloadURL,
          };

          const res = await axiosJwt.patch("/users/update", targetFormValues);

          if (res.status === 200) {
            toast.success("Successfully updated");
            reset();
            await updateCurrentUser(targetFormValues);
            setFile(null);
            setLoading(false);
          }
        });
      } else {
        const targetFormValues = { ...formValues };

        const res = await axiosJwt.patch("/users/update", targetFormValues);

        if (res.status === 200) {
          toast.success("Successfully updated");
          reset();
          await updateCurrentUser(targetFormValues);
          setFile(null);
          setLoading(false);
        }
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
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

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: any) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="profileSetting">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="profileSettingForm"
        onDragEnter={handleDrag}
      >
        <div className="left card">
          <div className="profileImg">
            <div className="profileImgWrapper">
              <img
                src={`${
                  file
                    ? URL.createObjectURL(file)
                    : currentUser.img || `./user-profile.png`
                }`}
                className="profileImg"
                alt=""
              />
              <label htmlFor="file" className="opacityBlock">
                <AddAPhotoIcon className="addPhotoIcon" />
              </label>
              <input
                type="file"
                id="file"
                hidden={true}
                accept="image/*"
                onChange={handleFileChange}
                onDragEnter={handleDrop}
              />
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
            <div className="profileImgText">
              <p>Allowed *.jpeg, *.jpg, *.png, *.gif</p>
              <p>max size of 3145728</p>
            </div>
          </div>
        </div>
        <div className="right card">
          <div className="form-group-row">
            <div className="form-group">
              <TextField
                label="Full name"
                variant="outlined"
                error={errors.fullName ? true : false}
                {...register("fullName", {
                  required: "Full name is required",
                })}
              />
              {errors.fullName && (
                <p className="errorMsg">{errors.fullName.message}</p>
              )}
            </div>
            <div className="form-group">
              <TextField
                label="Email address"
                disabled
                error={errors.email ? true : false}
                {...register("email", {
                  required: "email is required",
                })}
              />
              {errors.email && (
                <p className="errorMsg">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <TextField
                label="Phone Number"
                error={errors.phone ? true : false}
                {...register("phone", {
                  required: "phone is required",
                })}
              />
              {errors.phone && (
                <p className="errorMsg">{errors.phone.message}</p>
              )}
            </div>
            <div className="form-group">
              <Select
                {...register("gender", {
                  required: "gender is required",
                })}
                error={errors.gender ? true : false}
                defaultValue={"Male"}
              >
                <MenuItem value="Male">
                  <em>Male</em>
                </MenuItem>
                <MenuItem value="Female">
                  <em>Female</em>
                </MenuItem>
              </Select>
              {errors.gender && (
                <p className="errorMsg">{errors.gender.message}</p>
              )}
            </div>
          </div>
          <div className="form-group">
            <textarea
              rows={4}
              placeholder="About"
              className={`textarea`}
              {...register("about")}
            />
          </div>
          <div style={{ marginTop: 30, float: "right" }}>
            <ContainedButton
              title="Save Changes"
              btnClick={() => {}}
              height={2.5}
              width={10.8}
              loading={loading}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetting;
