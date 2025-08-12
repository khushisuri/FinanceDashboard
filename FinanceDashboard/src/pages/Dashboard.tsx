import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import DashboardBox from "../components/DashboardBox";
import {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
} from "../state/api";
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
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import BoxHeader from "../components/BoxHeader";
import FlexBetween from "../components/FlexBetween";
import { DataGrid, type GridCellParams } from "@mui/x-data-grid";

const httpStatus = (err: unknown) =>
  err && typeof err === "object" && "status" in err
    ? (err as any).status
    : null;

const Dashboard = () => {
  // polling timers (ms). 0 means no polling.
  const [kpiPollMs, setKpiPollMs] = useState(0);
  const [prodPollMs, setProdPollMs] = useState(0);
  const [txnPollMs, setTxnPollMs] = useState(0);

  // ONE call per endpoint, pass polling options
  const {
    data,
    error: kpiErr,
    isFetching: kpiFetching,
  } = useGetKpisQuery(undefined, {
    pollingInterval: kpiPollMs,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: productsData,
    error: prodErr,
    isFetching: prodFetching,
  } = useGetProductsQuery(undefined, {
    pollingInterval: prodPollMs,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: transactionsData,
    error: txnErr,
    isFetching: txnFetching,
  } = useGetTransactionsQuery(undefined, {
    pollingInterval: txnPollMs,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
  });

  // turn polling on while server says 202 “loading”; turn off when real data arrives
  useEffect(() => {
    setKpiPollMs(!data && httpStatus(kpiErr) === 202 ? 1500 : 0);
  }, [kpiErr, data]);

  useEffect(() => {
    setProdPollMs(!productsData && httpStatus(prodErr) === 202 ? 1500 : 0);
  }, [prodErr, productsData]);

  useEffect(() => {
    setTxnPollMs(!transactionsData && httpStatus(txnErr) === 202 ? 1500 : 0);
  }, [txnErr, transactionsData]);

  // OPTIONAL: quick placeholders while backend warms up
  const kpiWarming = !data && httpStatus(kpiErr) === 202;
  const prodWarming = !productsData && httpStatus(prodErr) === 202;
  const txnWarming = !transactionsData && httpStatus(txnErr) === 202;

  const priceExpense = useMemo(
    () =>
      productsData &&
      productsData.map((it) => ({
        id: it._id,
        price: it.price,
        expense: it.expense,
      })),
    [productsData]
  );
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

  const buyerAmount = useMemo(
    () =>
      transactionsData &&
      transactionsData.map((it) => ({
        id: it._id,
        buyer: it.buyer,
        amount: it.amount,
        productIds: it.productIds,
      })),
    [transactionsData]
  );

  const pieChartData = useMemo(() => {
    const totalExpenses = data && data[0].totalExpenses;
    return (
      data &&
      totalExpenses &&
      Object.entries(data[0].expensesByCategory).map(([key, value]) => {
        if (value !== null) {
          return [
            { name: key, value: value },
            {
              name: `${key} of Total`,
              value: totalExpenses - value,
            },
          ];
        }
      })
    );
  }, [data]);

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

  const productColumns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
  ];

  const transactionColumns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "buyer",
      headerName: "Buyer",
      flex: 0.5,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "productIds",
      headerName: "Count",
      flex: 0.1,
      renderCell: (params: GridCellParams) =>
        (params.value as Array<string>).length,
    },
  ];

  return (
    <>
      {kpiWarming || prodWarming || txnWarming ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box
          height={"100%"}
          width={"100%"}
          display={"grid"}
          justifyContent={"center"}
          sx={
            isSmallScreens
              ? {
                  gridTemplateAreas: gridTemplateLargeScreens,
                  gridTemplateColumns: "repeat(3,minmax(370px,1fr))",
                  gridTemplateRows: "repeat(10,minmax(80px,1fr))",
                }
              : {
                  gridTemplateAreas: gridTemplateSmallScreens,
                  gridAutoColumns: "1fr",
                  gridAutoRows: "80px",
                  overflowX: "clip",
                }
          }
          gap={"1.2rem"}
        >
          <DashboardBox gridArea={"a"} minHeight={"250px"}>
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
                  bottom: 10,
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
                  <linearGradient
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                    id="colorRxpenses"
                  >
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
                  bottom: 10,
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
                <CartesianGrid vertical={false} stroke={palette.grey[800]} />
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
                  bottom: 10,
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
          <DashboardBox gridArea={"e"} pb={"2rem"}>
            <BoxHeader title="Campaigns and Targets" sidetext="4%" />
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
                <Typography
                  m="0.3rem 0"
                  variant="h3"
                  color={palette.primary[300]}
                >
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
          <DashboardBox gridArea={"f"}>
            <BoxHeader
              title="Product Prices vs Expenses"
              sidetext="4%"
            ></BoxHeader>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 0,
                  right: 20,
                  bottom: 20,
                  left: -20,
                }}
              >
                <CartesianGrid stroke={palette.grey[800]} />
                <XAxis
                  type="number"
                  dataKey="price"
                  axisLine={false}
                  tickLine={false}
                  style={{ fontSize: "10px" }}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  type="number"
                  dataKey="expense"
                  axisLine={false}
                  tickLine={false}
                  style={{ fontSize: "10px" }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip formatter={(v) => `$${v}`} />
                <Scatter
                  name="Product Expense Ratio"
                  data={priceExpense}
                  fill={palette.tertiary[500]}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </DashboardBox>
          <DashboardBox gridArea={"g"}>
            <BoxHeader
              title="List of Products"
              sidetext={`${priceExpense?.length} products`}
            />
            <Box
              mt="0.5rem"
              p="0 0.5rem"
              height="75%"
              sx={{
                "& .MuiDataGrid-root": {
                  color: palette.grey[300],
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: `1px solid ${palette.grey[800]} !important`,
                },
                "& .MuiDataGrid-columnHeaders": {
                  borderBottom: `1px solid ${palette.grey[800]} !important`,
                },
                "& .MuiDataGrid-columnSeparator": {
                  visibility: "hidden",
                },
                "& .MuiButtonBase-root": {
                  color: "white",
                },
                "&. Mui-checked": {
                  color: palette.primary[500],
                },
                "&. MuiTablePagination-toolbar": {
                  color: "white",
                },
              }}
            >
              <DataGrid
                rows={priceExpense}
                columns={productColumns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </DashboardBox>
          <DashboardBox gridArea={"h"}>
            <BoxHeader
              title="Recent Orders"
              sidetext={`${transactionsData?.length} latest transactions`}
            />
            <Box
              mt="0.5rem"
              p="0 0.5rem"
              height="75%"
              sx={{
                "& .MuiDataGrid-root": {
                  color: palette.grey[300],
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: `1px solid ${palette.grey[800]} !important`,
                },
                "& .MuiDataGrid-columnHeaders": {
                  borderBottom: `1px solid ${palette.grey[800]} !important`,
                },
                "& .MuiDataGrid-columnSeparator": {
                  visibility: "hidden",
                },
                "& .MuiButtonBase-root": {
                  color: "white",
                },
                "&. Mui-checked": {
                  color: palette.primary[500],
                },
                "&. MuiTablePagination-toolbar": {
                  color: "white",
                },
              }}
            >
              <DataGrid
                rows={buyerAmount}
                columns={transactionColumns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </DashboardBox>
          <DashboardBox gridArea={"i"} gap="0rem !important">
            <BoxHeader title="Expense Breakdown By Category" sidetext="+4%" />
            <FlexBetween mt="0.5rem" textAlign="center">
              {pieChartData &&
                pieChartData.map(
                  (pie, i) =>
                    pie && (
                      <Box>
                        <PieChart
                          width={110}
                          height={100}
                          key={`${pie[0].name}-${i}`}
                        >
                          <Pie
                            data={pie}
                            innerRadius={18}
                            outerRadius={35}
                            paddingAngle={2}
                            fill="#8884d8"
                            dataKey="value"
                            stroke="none"
                          >
                            {pie.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={pieColors[index]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                        <Typography variant="h5">{pie[0].name}</Typography>
                      </Box>
                    )
                )}
            </FlexBetween>
          </DashboardBox>
          <DashboardBox gridArea={"j"}>
            <BoxHeader title="Expense Breakdown By Category" sidetext="+4%" />
            <Box>
              <Box
                sx={{
                  width: "100%",
                  borderRadius: "1rem",
                  bgcolor: "primary.dark",
                  height: "1rem",
                }}
              >
                <Box
                  sx={{
                    width: "40%",
                    borderRadius: "1rem",
                    bgcolor: "primary.light",
                    height: "1rem",
                  }}
                ></Box>
              </Box>
              <Typography my="1rem" color={palette.primary[100]}>
                An overview of key segments, showing how each category
                contributes to the total for informed decision-making.
              </Typography>
            </Box>
          </DashboardBox>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
