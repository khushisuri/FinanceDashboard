import React from "react";
import FlexBetween from "./FlexBetween";
import { Box, Typography, useTheme } from "@mui/material";

type Props = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  sidetext: string;
}

const BoxHeader = ({ title, subtitle, icon, sidetext }: Props) => {
  const { palette } = useTheme();
  return (
    <FlexBetween>
      <Box>
        {icon}
        <Typography variant="h3" color={palette.grey[100]}>
          {title}
        </Typography>
        <Typography variant="h5" color={palette.grey[600]} fontWeight={600}>
          {subtitle}
        </Typography>
      </Box>
      <Typography color={palette.secondary[400]} fontWeight={600}>
        {sidetext}
      </Typography>
    </FlexBetween>
  );
};

export default BoxHeader;
