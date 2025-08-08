import { Box, useMediaQuery, useTheme } from "@mui/material";
import DashboardBox from "../components/DashboardBox";
import { useGetKpisQuery } from "../state/api";

type Props = {};

const Dashboard = (props: Props) => {
    const {data} = useGetKpisQuery();
    console.log(data);
    
  const gridTemplateLargeScreens = `
    "a b c"
    "a b c"
    "a b c"
    "a b f"
    "d e f"
    "d e f"
    "d h i"
    "g h i"
    "g h j"
    "g h j"
    `;

  const gridTemplateSmallScreens = `
    "a"
    "a"
    "a"
    "a"
    "b"
    "b"
    "b"
    "b"
    "c"
    "c"
    "c"
    "d"
    "d"
    "d"
    "e"
    "e"
    "f"
    "f"
    "f"
    "g"
    "g"
    "g"
    "h"
    "h"
    "h"
    "h"
    "i"
    "i"
    "j"
    "j"
    `;
  const isSmallScreens =  useMediaQuery("(min-width:1200px)");
  return (
    <Box
      height={"100%"}
      width={"100%"}
      display={"grid"}
      sx={
        isSmallScreens
          ? {
              gridTemplateAreas: gridTemplateLargeScreens,
              gridTemplateColumns: "repeat(3,minmax(370px,1fr))",
              gridTemplateRows: "repeat(10,.minmax(60px,1fr))",
            }
          : {
              gridTemplateAreas: gridTemplateSmallScreens,
              gridAutoColumns: "1fr",
              gridAutoRows: "80px",
            }
      }
      gap={"1.2rem"}
    >
      <DashboardBox gridArea={"a"}></DashboardBox>
      <DashboardBox gridArea={"b"}></DashboardBox>
      <DashboardBox gridArea={"c"}></DashboardBox>
      <DashboardBox gridArea={"d"}></DashboardBox>
      <DashboardBox gridArea={"e"}></DashboardBox>
      <DashboardBox gridArea={"f"}></DashboardBox>
      <DashboardBox gridArea={"g"}></DashboardBox>
      <DashboardBox gridArea={"h"}></DashboardBox>
      <DashboardBox gridArea={"i"}></DashboardBox>
      <DashboardBox gridArea={"j"}></DashboardBox>
    </Box>
  );
};

export default Dashboard;
