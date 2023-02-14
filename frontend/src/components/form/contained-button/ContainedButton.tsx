import { CircularProgress } from "@mui/material";
import React from "react";
import "./contained-button.scss";

const ContainedButton: React.FC<{
  title: string;
  btnClick: React.MouseEventHandler<HTMLButtonElement>;
  width?: number;
  height?: number;
  loading: boolean;
}> = ({ title, btnClick, width, height, loading }) => {
  return (
    <div>
      <button
        style={{
          width: `${width === 100 ? width + "%" : width + " rem"}`,
          height: `${height}rem`,
        }}
        className="containedButton"
        onClick={btnClick}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={20} className="loadingIcon" />
        ) : (
          <>{title}</>
        )}
      </button>
    </div>
  );
};

export default ContainedButton;
