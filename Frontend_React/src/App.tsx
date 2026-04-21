import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./features/cart/context/CartContext";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { Box, CssBaseline } from '@mui/material';

import Navbar from "./components/Common/Navbar";
import LoginForm from "./features/auth/LoginForm";
import RegistrationForm from "./features/auth/RegistrationForm";
import ShoppingCartUI from "./features/cart/ShoppingCartUI";
import CategoryTestPage from "./features/categories/CategoryTestPage";
import AddressTestPage from "./features/address/AddressTestPage";
import RestaurantsPage from "./features/restaurants/RestaurantsPage";
import RestaurantMenuPage from "./features/restaurants/RestaurantMenuPage";
import CheckoutPage from "./features/cart/CheckoutPage";
import OrdersHistoryPage from "./features/orders/OrdersHistoryPage";

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