import React from "react";
import "./content-title.scss";

const ContentTitle: React.FC<{ title: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="contentTitle">
      <div className="left">Admin | {title}</div>
      <div className="right">{children}</div>
    </div>
  );
};

export default ContentTitle;
