import {
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import "./login.scss";
import ContainedButton from "../../components/form/contained-button/ContainedButton";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { AuthContext } from "../../context/authContext";

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>();

  const submitHandler = async (formValues: FormValues) => {
    try {
      await login(formValues);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="login">
      <div className="login-bg">
        <div className="bg-text">
          <h4>Welcome to the</h4>
          <h1>COMMERCEHOPE</h1>
          <h5>Reactjs Ecommerce script you need</h5>
        </div>
      </div>
      <div className="login-card">
        <div className="login-card-wrapper">
          <div className="card-title">
            <h3>Login</h3>
            <p>Login to your account to continue</p>
          </div>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="form-group">
              <TextField
                placeholder="Email"
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
            </div>
            <div className="form-group">
              <TextField
                type={"password"}
                placeholder="Password"
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
            </div>
            <div className="remember-me">
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Remember me"
              />
              <Link className="link login-link" to={""}>
                Forgot Password
              </Link>
            </div>
            <div className="login-card-footer">
              <ContainedButton
                title={"Login"}
                height={2.5}
                width={100}
                btnClick={() => {}}
                loading={loading}
              />
              <p>
                Don't have an account?
                <Link className="link login-link" to={""}>
                  Get Started
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
