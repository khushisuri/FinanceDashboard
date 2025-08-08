import React, { useState } from "react";
import FlexBetween from "../components/FlexBetween";
import { Box, Link, Typography, useTheme } from "@mui/material";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { Link as RouterLink } from "react-router-dom";
type Props = {};

const Navbar = (props: Props) => {
  const [selected, setSelected] = useState("dashboard");
  const { palette } = useTheme();
  return (
    <FlexBetween p={"0.5rem 0rem"} mb={"0.25rem"} color={palette.grey[200]}>
      <FlexBetween gap={"0.6rem"}>
        <PixOutlinedIcon></PixOutlinedIcon>
        <Typography>Finanseer</Typography>
      </FlexBetween>
      <FlexBetween gap={"0.6rem"} color={palette.grey[200]}>
        <Box
          sx={{ "&:hover": { color: palette.primary[100] }, cursor: "pointer" }}
          onClick={() => setSelected("dashboard")}
        >
          <Link
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: "none",
              "& a": {
                color: selected === "dashboard" ? "inherit" : palette.grey[700],
              },
            }}
          >
            dashboard
          </Link>
        </Box>
        <Box
          sx={{ "&:hover": { color: palette.primary[100] }, cursor: "pointer" }}
          onClick={() => setSelected("predictions")}
        >
          <Link
            component={RouterLink}
            to="/predictions"
            sx={{
              color: selected === "predictions" ? "inherit" : palette.grey[700],
              textDecoration: "none",
            }}
          >
            predictions
          </Link>
        </Box>
      </FlexBetween>
    </FlexBetween>
  );
};

export default Navbar;
