import React from "react";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const GroupingSelect: React.FC<{
  children: React.ReactNode;
  onChange: (e: any) => void;
  value: string;
}> = ({ children, onChange, value }) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        native
        size="small"
        onChange={onChange}
        value={value}
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
