import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Box, CssBaseline } from '@mui/material';

import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import ShoppingCartUI from "./components/ShoppingCartUI";
import CategoryTestPage from "./components/CategoryTestPage";
import AddressTestPage from "./components/AddressTestPage";
import RestaurantsPage from "./components/RestaurantsPage";
import RestaurantMenuPage from "./components/RestaurantMenuPage";
import CheckoutPage from "./components/CheckoutPage";
import OrdersHistoryPage from "./components/OrdersHistoryPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <CssBaseline /> 
          <Navbar />

          <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, pb: 6 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/restaurants" />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegistrationForm />} />
              
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/restaurants/:id" element={<RestaurantMenuPage />} />
              
              <Route path="/cart" element={<ShoppingCartUI />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersHistoryPage />} />
              <Route path="/categories-test" element={<CategoryTestPage />} />
              <Route path="/addresses-test" element={<AddressTestPage />} />
            </Routes>
          </Box>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;