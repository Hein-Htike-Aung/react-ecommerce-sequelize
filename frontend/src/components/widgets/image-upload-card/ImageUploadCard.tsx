import React from "react";
import "./image-upload-card.scss";

const ImageUploadCard: React.FC<{
  setFile: React.Dispatch<any>;
  file: any;
  setDragActive: React.Dispatch<React.SetStateAction<boolean>>;
  errors: any;
  dragActive: boolean;
  handleDrag: (e: any) => void;
  register: any;
  attrName: string;
  img?: string;
}> = ({
  register,
  setFile,
  file,
  handleDrag,
  dragActive,
  setDragActive,
  errors,
  attrName,
  img,
}) => {
  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: any) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <label htmlFor="file">
        <div className={`imgCard ${errors.img && "fileError"}`}>
          {img && !file ? (
            <>
              <img className="categoryImg" src={img} alt="" />
            </>
          ) : (
            <>
              {file ? (
                <>
                  <img
                    className="categoryImg"
                    src={URL.createObjectURL(file)}
                    alt=""
                  />
                </>
              ) : (
                <>
                  <h3 className={`${errors.img && "textError"}`}>
                    Drop or Select Image
                  </h3>
                  <div className="imgCover"></div>
                </>
              )}
            </>
          )}
        </div>
      </label>
      <input
        id="file"
        type="file"
        hidden={true}
        {...register(attrName)}
        accept="image/*"
        onChange={handleChange}
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
  );
};

export default ImageUploadCard;
