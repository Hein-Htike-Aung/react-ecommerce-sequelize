import React from "react";
import "./outlined-button.scss";

const OutlinedButton: React.FC<{
  children: React.ReactNode;
  btnClick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ children, btnClick }) => {
  return (
    <div>
      <button className="outlinedButton" onClick={btnClick}>
        {children}
      </button>
    </div>
  );
};

export default OutlinedButton;
