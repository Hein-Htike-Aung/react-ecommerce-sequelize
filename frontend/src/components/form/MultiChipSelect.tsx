import React from "react";

import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(value: string, values: readonly string[], theme: Theme) {
  return {
    fontWeight:
      values.indexOf(value) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MultiChipSelect: React.FC<{
  value: string[];
  values: string[];
  handleSizeChange: (event: SelectChangeEvent<string[]>) => void;
}> = ({ value, values, handleSizeChange }) => {
  const theme = useTheme();

  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        size="small"
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={value}
        onChange={handleSizeChange}
        input={<OutlinedInput id="select-multiple-chip" />}
        sx={{
          "& .MuiSelect-select": {
            padding: "6px 14px",
          },
        }}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {values.map((value) => (
          <MenuItem
            key={value}
            value={value}
            style={getStyles(value, values, theme)}
          >
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiChipSelect;
