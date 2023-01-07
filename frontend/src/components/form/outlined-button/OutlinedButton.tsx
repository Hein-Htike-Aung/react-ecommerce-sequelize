import React from "react";
import "./outlined-button.scss";
import AddIcon from "@mui/icons-material/Add";

const OutlinedButton: React.FC<{
  btnText: string;
  btnClick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ btnText, btnClick }) => {
  return (
    <div>
      <button className="outlinedButton" onClick={btnClick}>
        <AddIcon />
        {btnText}
      </button>
    </div>
  );
};

export default OutlinedButton;
