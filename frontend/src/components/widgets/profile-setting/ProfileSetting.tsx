import { InputAdornment, MenuItem, Select, TextField } from "@mui/material";
import React from "react";
import ContainedButton from "../../form/contained-button/ContainedButton";
import "./profile-setting.scss";

const ProfileSetting = () => {
  return (
    <div className="profileSetting">
      <div className="left card">
        <div className="profileImg">
          <div className="profileImgWrapper">
            <img
              src="https://images.pexels.com/photos/15523827/pexels-photo-15523827.png?auto=compress&cs=tinysrgb&w=1200&lazy=load"
              alt=""
              className=""
            />
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
              label="Name"
              // error={errors.role ? true : false}
              // {...register("phone", {
              //   required: "phone is required",
              // })}
            />
            {/* {errors.phone && (
                <p className="errorMsg">{errors.phone.message}</p>
              )} */}
          </div>
          <div className="form-group">
            <TextField
              label="Email address"
              // error={errors.role ? true : false}
              // {...register("phone", {
              //   required: "phone is required",
              // })}
            />
            {/* {errors.phone && (
                <p className="errorMsg">{errors.phone.message}</p>
              )} */}
          </div>
        </div>
        <div className="form-group-row">
          <div className="form-group">
            <TextField
              label="Phone Number"
              // error={errors.role ? true : false}
              // {...register("phone", {
              //   required: "phone is required",
              // })}
            />
            {/* {errors.phone && (
                <p className="errorMsg">{errors.phone.message}</p>
              )} */}
          </div>
          <div className="form-group">
            <Select
              // {...register("gender", {
              //   required: "gender is required",
              // })}
              // error={errors.gender ? true : false}
              defaultValue={"Male"}
            >
              <MenuItem value="Male">
                <em>Male</em>
              </MenuItem>
              <MenuItem value="Female">
                <em>Female</em>
              </MenuItem>
            </Select>
            {/* {errors.gender && (
              <p className="errorMsg">{errors.gender.message}</p>
            )} */}
          </div>
        </div>
        <div className="form-group">
          <textarea
            rows={4}
            placeholder="About"
            // className={`${errors.description && "inputError"}`}
            // {...register("description", {
            //   required: "Description is required",
            // })}
          />
          {/* {errors.description && (
            <p className="errorMsg">{errors.description.message}</p>
          )} */}
        </div>
        <div style={{ marginTop: 30, float: "right" }}>
          <ContainedButton
            title="Save Changes"
            btnClick={() => {}}
            height={2.5}
            width={10.8}
            loading={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
