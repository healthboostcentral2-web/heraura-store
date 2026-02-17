import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { WishlistProvider } from "./context/WishlistContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CartProvider>
        <UserProvider>
          <WishlistProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </WishlistProvider>
        </UserProvider>
      </CartProvider>
    </ErrorBoundary>
  </React.StrictMode>
);