import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const DashboardBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.light,
  borderRadius: "1rem",
  boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0,0,0,0.8)",
  padding:"1rem 0.8rem 0rem 0.8rem",
  display:"flex",
  gap:"2rem",
  flexDirection:"column",
  justifyContent:"center"
}));

export default DashboardBox;
