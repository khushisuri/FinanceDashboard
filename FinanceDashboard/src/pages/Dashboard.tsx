import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import DashboardBox from "../components/DashboardBox";
import { useGetKpisQuery } from "../state/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  Legend,
  LineChart,
  BarChart,
  Bar,
  Rectangle,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { useMemo } from "react";
import BoxHeader from "../components/BoxHeader";
import FlexBetween from "../components/FlexBetween";

const Dashboard = () => {
  const { data } = useGetKpisQuery();
  const { palette } = useTheme();
  const revenue = useMemo(
    () =>
      data &&
      data[0].monthlyData.map((it) => ({
        month: it.month.substring(0, 3),
        revenue: it.revenue,
      })),
    [data]
  );

  const revenueExpenses = useMemo(
    () =>
      data &&
      data[0].monthlyData.map((it) => ({
        month: it.month.substring(0, 3),
        expenses: it.expenses,
        revenue: it.revenue,
      })),
    [data]
  );
  const revenueProfit = useMemo(
    () =>
      data &&
      data[0].monthlyData.map((it) => ({
        month: it.month.substring(0, 3),
        revenue: it.revenue,
        profit: (it.revenue - it.expenses).toFixed(2),
      })),
    [data]
  );
  const operationalNonOperational = useMemo(
    () =>
      data &&
      data[0].monthlyData.map((it) => ({
        month: it.month.substring(0, 3),
        operationalExpenses: it.operationalExpenses,
        nonOperationalExpenses: it.nonOperationalExpenses,
      })),
    [data]
  );

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
  const isSmallScreens = useMediaQuery("(min-width:1200px)");
  const pieData = [
    { name: "Group A", value: 600 },
    { name: "Group B", value: 400 },
  ];

  const pieColors = [palette.primary[800], palette.primary[300]];
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
              gridTemplateRows: "repeat(10,.minmax(80px,1fr))",
            }
          : {
              gridTemplateAreas: gridTemplateSmallScreens,
              gridAutoColumns: "1fr",
              gridAutoRows: "80px",
            }
      }
      gap={"1.2rem"}
    >
      <DashboardBox gridArea={"a"}>
        <BoxHeader
          title="Revenue and Expenses"
          subtitle="top line represents revenue, bottom line represents expenses"
          sidetext="+4%"
        ></BoxHeader>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={revenueExpenses}
            margin={{
              top: 15,
              right: 25,
              left: -10,
              bottom: 60,
            }}
          >
            <defs>
              <linearGradient x1="0" y1="0" x2="0" y2="1" id="colorRevenue">
                <stop
                  offset={"5%"}
                  stopColor={palette.primary[300]}
                  stopOpacity={0.5}
                />
                <stop
                  offset={"95%"}
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient x1="0" y1="0" x2="0" y2="1" id="colorRxpenses">
                <stop
                  offset={"5%"}
                  stopColor={palette.primary[300]}
                  stopOpacity={0.5}
                />
                <stop
                  offset={"95%"}
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              tickLine={false}
              style={{ fontSize: "10px" }}
              domain={[8000, 23000]}
              axisLine={{ strokeWidth: "0" }}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={palette.primary.main}
              fill="url(#colorRevenue)"
              dot={true}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={palette.primary.main}
              fill="url(#colorExpenses)"
              dot={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea={"b"}>
        <BoxHeader
          title="Profit and Revenue"
          subtitle="top line represents revenue, bottom line represents profit"
          sidetext="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={revenueProfit}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              style={{ fontSize: "10px" }}
              axisLine={{ strokeWidth: "0" }}
            />
            <YAxis
              yAxisId="right"
              tickLine={false}
              style={{ fontSize: "10px" }}
              orientation="right"
              axisLine={{ strokeWidth: "0" }}
            />
            <Legend />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="profit"
              stroke={palette.tertiary[500]}
              dot={true}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke={palette.primary.main}
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea={"c"}>
        <BoxHeader
          title="Revenue Month by Month"
          subtitle="graph representing the revenue month by month"
          sidetext="4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={revenue}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              tickLine={false}
              style={{ fontSize: "10px" }}
              axisLine={{ strokeWidth: "0" }}
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Tooltip />
            <Bar dataKey="revenue" fill="url(#colorRevenue)" />
          </BarChart>
          <CartesianGrid vertical={false} stroke={palette.grey[800]} />
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea={"d"}>
        <BoxHeader
          title="Operational vs Non-Operational Expenses"
          sidetext="4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={operationalNonOperational}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              style={{ fontSize: "10px" }}
              axisLine={{ strokeWidth: "0" }}
            />
            <YAxis
              yAxisId="right"
              tickLine={false}
              style={{ fontSize: "10px" }}
              orientation="right"
              axisLine={{ strokeWidth: "0" }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="operationalExpenses"
              stroke={palette.tertiary[500]}
              dot={true}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="nonOperationalExpenses"
              stroke={palette.primary.main}
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea={"e"}>
        <BoxHeader title="Campaigns and Targets" sidetext="4%"/>
        <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
          <PieChart
            width={110}
            height={100}
            margin={{
              top: 0,
              right: -10,
              left: 10,
              bottom: 0,
            }}
          >
            <Pie
              stroke="none"
              data={pieData}
              innerRadius={18}
              outerRadius={38}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
          <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
            <Typography variant="h5">Target Sales</Typography>
            <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}>
              83
            </Typography>
            <Typography variant="h6">
              Finance goals of the campaign that is desired
            </Typography>
          </Box>
          <Box flexBasis="40%">
            <Typography variant="h5">Losses in Revenue</Typography>
            <Typography variant="h6">Losses are down 25%</Typography>
            <Typography mt="0.4rem" variant="h5">
              Profit Margins
            </Typography>
            <Typography variant="h6">
              Margins are up by 30% from last month.
            </Typography>
          </Box>
        </FlexBetween>
      </DashboardBox>
      <DashboardBox gridArea={"f"}></DashboardBox>
      <DashboardBox gridArea={"g"}></DashboardBox>
      <DashboardBox gridArea={"h"}></DashboardBox>
      <DashboardBox gridArea={"i"}></DashboardBox>
      <DashboardBox gridArea={"j"}></DashboardBox>
    </Box>
  );
};

export default Dashboard;
