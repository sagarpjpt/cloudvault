"use client";

import { useState, useCallback, useRef } from "react";
import { TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";

const SearchBar = ({
  onSearch,
  onClear,
  placeholder = "Search files & folders...",
}) => {
  const [value, setValue] = useState("");
  const debounceTimer = useRef(null);

  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setValue(newValue);

      // Debounce search
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (newValue.trim().length === 0) {
        onClear?.();
      } else {
        debounceTimer.current = setTimeout(() => {
          onSearch?.(newValue);
        }, 300); // 300ms debounce
      }
    },
    [onSearch, onClear],
  );

  const handleClear = useCallback(() => {
    setValue("");
    onClear?.();
  }, [onClear]);

  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={handleClear}
              edge="end"
              sx={{ mr: -1 }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#f5f5f5",
        borderRadius: 1,
        "& .MuiOutlinedInput-root": {
          borderColor: "#e0e0e0",
        },
      }}
    />
  );
};

export default SearchBar;
