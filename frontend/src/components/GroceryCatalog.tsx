// src/components/GroceryCatalog.tsx
import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
} from "@mui/material";

// Define types for a grocery price and a grocery item.
// Note: price can be a number, a string, or null.
export type GroceryPrice = {
  date: string; // expected format: "YYYY-MM-DD"
  price: number | string | null;
};

export type Grocery = {
  id: number;
  name: string;
  prices: GroceryPrice[];
};

interface GroceryCatalogProps {
  groceries: Grocery[];
  onAddToCart: (grocery: Grocery) => void;
  cartItems: Grocery[]; // used to disable the "Add" button if already in the cart
}

const GroceryCatalog: React.FC<GroceryCatalogProps> = ({
  groceries,
  onAddToCart,
  cartItems,
}) => {
  console.log("Groceries received:", groceries);

  // Filter out any grocery items that don't have a valid name.
  const validGroceries = groceries.filter((grocery) => Boolean(grocery.name));

  // Helper function: get the most recent valid price.
  const getMostRecentPrice = (prices: GroceryPrice[]): number | null => {
    if (!prices || prices.length === 0) return null;
    // Map each price entry to include a parsed price and a numeric timestamp.
    const validPrices = prices
      .map((p) => {
        const time = new Date(p.date).getTime();
        const parsedPrice = Number(p.price);
        return { ...p, time, parsedPrice };
      })
      // Filter out entries with invalid dates or where price cannot be parsed.
      .filter((p) => !isNaN(p.time) && !isNaN(p.parsedPrice));

    if (validPrices.length === 0) return null;
    // Sort the valid prices by date (oldest to newest).
    validPrices.sort((a, b) => a.time - b.time);
    // Return the parsed price from the most recent entry.
    return validPrices[validPrices.length - 1].parsedPrice;
  };

  if (validGroceries.length === 0) {
    return <div>No groceries available.</div>;
  }

  return (
    <List dense>
      {validGroceries.map((grocery) => {
        const recentPrice = getMostRecentPrice(grocery.prices);
        const isInCart = cartItems.some((item) => item.id === grocery.id);
        return (
          <React.Fragment key={grocery.id}>
            <ListItem dense sx={{ py: 1 }}>
              <ListItemText
                primary={grocery.name}
                secondary={
                  recentPrice !== null
                    ? `$${recentPrice.toFixed(2)}`
                    : "No Price"
                }
              />
              <ListItemSecondaryAction>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onAddToCart(grocery)}
                  disabled={isInCart}
                  size="small"
                >
                  {isInCart ? "Added" : "Add"}
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default GroceryCatalog;
