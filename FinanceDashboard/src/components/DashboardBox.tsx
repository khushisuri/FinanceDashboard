import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const DashboardBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.light,
  borderRadius: "1rem",
  boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0,0,0,0.8)",
  padding: "1rem 0.8rem 1rem 0.8rem",
  display: "flex",
  gap: "1rem",
  flexDirection: "column",
  justifyContent: "center",
  width: "100%",
  minWidth: 0,
  overflow: "hidden",
}));

export default DashboardBox;
