import { InputAdornment, MenuItem, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import ContainedButton from "../../form/contained-button/ContainedButton";
import "./add_user.scss";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import KeyIcon from "@mui/icons-material/Key";
import TransgenderIcon from "@mui/icons-material/Transgender";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import { axiosInstance } from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  role: string;
};

const AddUser = () => {
  const [loading, setLoading] = useState(false);

  const formSchema = yup.object().shape({
    fullName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup
      .string()
      .required()
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        "Password must be strong password."
      ),
    phone: yup.string().required(),
    gender: yup.string().required(),
    role: yup.string().required(),
  });

  const resolver = useYupValidationResolver(formSchema);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver,
  });

  // useEffect
  useEffect(() => {
    setValue("gender", "Male");
    setValue("role", "Admin");
  }, [setValue]);

  // form submit
  const submitHandler = async (formValues: FormValues) => {
    try {
      const res = await axiosInstance.post(`/users/create`, { ...formValues });

      if (res.status === 201) {
        toast.success("Successfully added");
        reset();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="addUser">
      <div className="card">
        <h1 className="title">Add Role</h1>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label>Full Name</label>
            <TextField
              {...register("fullName", {
                required: "name is required",
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              error={errors.fullName ? true : false}
            />
            {errors.fullName && (
              <p className="errorMsg">{errors.fullName.message}</p>
            )}
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label>Gender</label>
              <Select
                {...register("gender", {
                  required: "gender is required",
                })}
                startAdornment={
                  <InputAdornment position="start">
                    <TransgenderIcon />
                  </InputAdornment>
                }
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
            <div className="form-group">
              <label>Role</label>
              <Select
                startAdornment={
                  <InputAdornment position="start">
                    <VerifiedUserIcon />
                  </InputAdornment>
                }
                error={errors.role ? true : false}
                {...register("role", {
                  required: "role is required",
                })}
                defaultValue={"Admin"}
              >
                <MenuItem value="Admin">
                  <em>Admin</em>
                </MenuItem>
                <MenuItem value="Manager">
                  <em>Manager</em>
                </MenuItem>
                <MenuItem value="Editor">
                  <em>Editor</em>
                </MenuItem>
              </Select>
              {errors.role && <p className="errorMsg">{errors.role.message}</p>}
            </div>
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label>Phone No</label>
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalPhoneIcon />
                    </InputAdornment>
                  ),
                }}
                error={errors.role ? true : false}
                {...register("phone", {
                  required: "phone is required",
                })}
              />
              {errors.phone && (
                <p className="errorMsg">{errors.phone.message}</p>
              )}
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
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
          <div className="form-group">
            <label>Password</label>
            <TextField
              type={"password"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
              }}
              error={errors.password ? true : false}
              {...register("password", {
                required: "password is required",
              })}
            />
            {errors.password && (
              <p className="errorMsg">{errors.password.message}</p>
            )}
          </div>
          <div style={{ marginTop: 30 }}>
            <ContainedButton
              title="Save"
              btnClick={() => {}}
              height={2.5}
              width={22.8}
              loading={false}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
