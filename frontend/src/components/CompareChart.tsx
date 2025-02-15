// src/components/CompareChart.tsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Grocery } from "./GroceryCatalog";

interface CompareChartProps {
  cartItems: Grocery[];
}

const CompareChart: React.FC<CompareChartProps> = ({ cartItems }) => {
  // Combine price data from all items into a chart data object keyed by date.
  const dataMap: { [date: string]: any } = {};

  cartItems.forEach((item) => {
    item.prices.forEach((entry) => {
      const { date, price } = entry;
      if (!dataMap[date]) {
        dataMap[date] = { date };
      }
      dataMap[date][item.name] = price;
    });
  });

  // Convert dataMap into an array and sort by date.
  const chartData = Object.values(dataMap).sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Define some colors for the lines.
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ff7300",
    "#ff0000",
    "#00ff00",
    "#0000ff",
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => new Date(date).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        {cartItems.map((item, index) => (
          <Line
            key={item.id}
            type="monotone"
            dataKey={item.name}
            stroke={colors[index % colors.length]}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CompareChart;
