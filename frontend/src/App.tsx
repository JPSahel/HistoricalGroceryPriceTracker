// src/App.tsx
import React, { useEffect, useState } from "react";
import { Container, createTheme, Typography } from "@mui/material";
import GroceryCatalog, { Grocery } from "./components/GroceryCatalog";
import Cart from "./components/Cart";
import axios from "axios";
import ErrorBoundary from "./components/ErrorBoundary";
const App: React.FC = () => {
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [cartItems, setCartItems] = useState<Grocery[]>([]);

  // Fetch groceries from the Django API.
  useEffect(() => {
    const fetchGroceries = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8001/api/groceries/"
        );
        console.log("Fetched groceries:", response.data);
        setGroceries(response.data); // Ensure this is an array
      } catch (error) {
        console.error("Error fetching groceries:", error);
      }
    };
    fetchGroceries();
  }, []);

  const handleAddToCart = (grocery: Grocery) => {
    if (!cartItems.some((item) => item.id === grocery.id)) {
      setCartItems((prev) => [...prev, grocery]);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Grocery Catalogue
      </Typography>
      <ErrorBoundary>
        <GroceryCatalog
          groceries={groceries}
          onAddToCart={handleAddToCart}
          cartItems={cartItems}
        />
      </ErrorBoundary>
      <Cart cartItems={cartItems} />
    </Container>
  );
};

export default App;
