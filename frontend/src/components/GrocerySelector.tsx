// src/components/GrocerySelector.tsx
import React, { useEffect, useState } from "react";
import { fetchGroceries } from "../API/api";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type GroceryPrice = {
  date: string; // Expecting format "YYYY-MM-DD"
  price: number | null;
};

type Grocery = {
  id: number;
  name: string;
  prices: GroceryPrice[];
};

const GrocerySelector: React.FC = () => {
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [selectedGroceries, setSelectedGroceries] = useState<Grocery[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch groceries when component mounts
  useEffect(() => {
    const loadGroceries = async () => {
      setLoading(true);
      try {
        const data = await fetchGroceries();
        setGroceries(data);
      } catch (error) {
        console.error("Error fetching groceries", error);
      } finally {
        setLoading(false);
      }
    };

    loadGroceries();
  }, []);

  // Combine price data from selected groceries into chart data
  const chartData = React.useMemo(() => {
    const dataMap: { [date: string]: any } = {};

    selectedGroceries.forEach((grocery) => {
      grocery.prices.forEach((priceEntry) => {
        const { date, price } = priceEntry;
        if (!dataMap[date]) {
          dataMap[date] = { date };
        }
        // Use grocery name as key for its price on this date
        dataMap[date][grocery.name] = price;
      });
    });

    // Convert the data map into a sorted array by date
    return Object.values(dataMap).sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [selectedGroceries]);

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <Autocomplete
          multiple
          options={groceries}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => setSelectedGroceries(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Groceries"
              variant="outlined"
            />
          )}
          style={{ marginBottom: "20px", width: 400 }}
        />
      )}

      {selectedGroceries.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedGroceries.map((grocery, index) => (
              <Line
                key={grocery.id}
                type="monotone"
                dataKey={grocery.name}
                // For demo purposes, generate a color based on the index
                stroke={["#8884d8", "#82ca9d", "#ff7300"][index % 3]}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GrocerySelector;
