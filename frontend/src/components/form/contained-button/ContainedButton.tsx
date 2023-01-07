import React from "react";
import "./contained-button.scss";

const ContainedButton: React.FC<{
  title: string;
  btnClick: React.MouseEventHandler<HTMLButtonElement>;
  width?: number;
  height?: number;
}> = ({ title, btnClick, width, height }) => {
  return (
    <div>
      <button
        style={{ width: `${width}rem`, height: `${height}rem` }}
        className="containedButton"
        onClick={btnClick}
      >
        {title}
      </button>
    </div>
  );
};

export default ContainedButton;
