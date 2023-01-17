import React from "react";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const GroupingSelect: React.FC<{
  children: React.ReactNode;
  onChange: (e: any) => void;
}> = ({ children, onChange }) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        native
        size="small"
        onChange={onChange}
        defaultValue=""
        id="grouped-native-select"
        sx={{
          "& .MuiNativeSelect-select": {
            height: 22,
          },
        }}
      >
        {children}
      </Select>
    </FormControl>
  );
};

export default GroupingSelect;
