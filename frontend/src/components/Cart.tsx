// src/components/Cart.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Grocery } from "./GroceryCatalog";
import CompareChart from "./CompareChart";

interface CartProps {
  cartItems: Grocery[];
}

const Cart: React.FC<CartProps> = ({ cartItems }) => {
  const [showChart, setShowChart] = useState(false);

  // Helper: get the most recent price of a grocery
  // Now accepts price values that may be a number, string, or null.
  const getMostRecentPrice = (
    prices: { date: string; price: number | string | null }[]
  ): number => {
    if (!prices || prices.length === 0) return 0;
    const sorted = [...prices].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const mostRecent = sorted[sorted.length - 1];
    // Ensure the value is parsed as a number.
    return Number(mostRecent.price) || 0;
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + getMostRecentPrice(item.prices);
  }, 0);

  return (
    <Box mt={4}>
      <Typography variant="h6">Cart</Typography>
      <List>
        {cartItems.map((item) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={item.name}
              secondary={`Price: $${getMostRecentPrice(item.prices).toFixed(
                2
              )}`}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="subtitle1">
        Total: ${totalPrice.toFixed(2)}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setShowChart(!showChart)}
        sx={{ mt: 2 }}
      >
        {showChart ? "Hide Comparison" : "Compare"}
      </Button>
      {showChart && <CompareChart cartItems={cartItems} />}
    </Box>
  );
};

export default Cart;
