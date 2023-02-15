import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ContainedButton from "../../form/contained-button/ContainedButton";
import * as yup from "yup";
import "./change-password.scss";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import { axiosInstance } from "../../../utils/axiosInstance";
import { AuthContext } from "../../../context/authContext";
import useJWT from "../../../hooks/useJWT";

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword = () => {
  const { logout } = useContext(AuthContext);

  const axiosJWT = useJWT();

  const formSchema = yup.object().shape({
    oldPassword: yup
      .string()
      .required()
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        "Password must be strong password."
      ),
    newPassword: yup
      .string()
      .required()
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        "Password must be strong password."
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords do not match")
      .required()
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        "Password must be strong password."
      ),
  });

  const resolver = useYupValidationResolver(formSchema);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver,
  });

  const submitHandler = async (formValues: FormValues) => {
    try {
      const res = await axiosJWT.post(`/auth/change_user_password`, {
        oldPassword: formValues.oldPassword,
        newPassword: formValues.newPassword,
      });

      if (res.status === 200) {
        toast.success("Successfully changed");
        await logout();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="change-password">
      <div className="card">
        <h1 className="title">Change Password</h1>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label>Old Password</label>
            <input
              type="password"
              className={`input ${errors.oldPassword && "inputError"}`}
              {...register("oldPassword", {
                required: "Old password is required",
              })}
            />
            {errors.oldPassword && (
              <p className="errorMsg">{errors.oldPassword.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className={`input ${errors.newPassword && "inputError"}`}
              {...register("newPassword", {
                required: "New password is required",
              })}
            />
            {errors.newPassword && (
              <p className="errorMsg">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              className={`input ${errors.confirmPassword && "inputError"}`}
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (val: string) => {
                  if (watch("newPassword") !== val) {
                    return "Your passwords do no match";
                  }
                },
              })}
            />
            {errors.confirmPassword && (
              <p className="errorMsg">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div style={{ marginTop: 30 }}>
            <ContainedButton
              title="Save Changes"
              btnClick={() => {}}
              height={2.5}
              width={10.8}
              loading={false}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
