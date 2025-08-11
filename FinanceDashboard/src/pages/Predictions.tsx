import DashboardBox from "../components/DashboardBox";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  Legend,
  LineChart,
  CartesianGrid,
  Label,
} from "recharts";
import { Box, useTheme, Typography, Button } from "@mui/material";
import { useState, useMemo } from "react";
import FlexBetween from "../components/FlexBetween";
import { useGetKpisQuery } from "../state/api";
import regression, { type DataPoint } from "regression";
type Props = {};

const Predictions = (props: Props) => {
  const { palette } = useTheme();
  const [isPredictions, setIsPredictions] = useState<boolean>();
  const { data } = useGetKpisQuery();
  const formattedData = useMemo(() => {
    if(!data) return;
    const monthData = data && data[0].monthlyData;
    const formatted: Array<DataPoint> = monthData?.map((it, i) => [
      i,
      it.revenue,
    ]);
    const regressionLine = regression.linear(formatted);

    return monthData?.map(({ month, revenue }, i: number) => {
      return {
        name: month,
        "Actual Revenue": revenue,
        "Regression Line": regressionLine.points[i][1],
        "Predicted Revenue": regressionLine.predict(i + 12)[1],
      };
    });
  }, [data]);
  return (
    <DashboardBox height="100%" width="100%">
      <FlexBetween>
        <Box>
          <Typography variant="h3">Revenue and Predictions</Typography>
          <Typography variant="h6">
            charted revenue and predicted revenue based on a simple linear
            regression model
          </Typography>
        </Box>
        <Button
          sx={{
            color: palette.grey[900],
            backgroundColor: palette.grey[700],
            boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,.4)",
          }}
          onClick={() => setIsPredictions(!isPredictions)}
        >
          Show Predicted Revenue for Next Year
        </Button>
      </FlexBetween>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={400}
          data={formattedData || []}
          margin={{
            top: 20,
            right: 75,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={palette.grey[600]}
          ></CartesianGrid>
          <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }}>
            <Label value="Month" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis tickLine={false} style={{ fontSize: "10px" }} axisLine={false} 
            domain={[12000, 26000]}>
            <Label
              value="Revenue in USD"
              angle={-90}
              offset={-5}
              position="insideLeft"
            />
          </YAxis>
          <Legend verticalAlign="top" />
          <Tooltip />
          <Line
            dataKey="Actual Revenue"
            stroke={palette.primary.main}
            strokeWidth={0}
            dot={{ strokeWidth: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Regression Line"
            stroke="#8884d8"
            dot={false}
          />
          {isPredictions && (
            <Line
              strokeDasharray="5 5"
              dataKey="Predicted Revenue"
              stroke={palette.secondary[500]}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </DashboardBox>
  );
};

export default Predictions;
