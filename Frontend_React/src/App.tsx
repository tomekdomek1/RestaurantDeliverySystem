import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Box, CssBaseline, Button } from '@mui/material';

import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import ShoppingCartUI from "./components/ShoppingCartUI";
import RestaurantsPage from "./components/RestaurantsPage";
import RestaurantMenuPage from "./components/RestaurantMenuPage";
import CheckoutPage from "./components/CheckoutPage";
import OrdersHistoryPage from "./components/OrdersHistoryPage";
import RestaurantPanelLayout from "./components/RestaurantPanelLayout";
import AdminMenuPage from "./components/AdminMenuPage";

const ClientLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, mt: 2, textAlign: 'right' }}>
      <Button variant="outlined" size="small" href="/admin/menu">Panel CRM (Dev)</Button>
    </Box>
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, pb: 6 }}>
      {children}
    </Box>
  </>
);

export default function App() {
  return (
    <Router>
      <CartProvider>
        <CssBaseline /> 
        <Routes>
          <Route path="/" element={<Navigate to="/restaurants" />} />
          <Route path="/login" element={<ClientLayout><LoginForm /></ClientLayout>} />
          <Route path="/register" element={<ClientLayout><RegistrationForm /></ClientLayout>} />
          <Route path="/restaurants" element={<ClientLayout><RestaurantsPage /></ClientLayout>} />
          <Route path="/restaurants/:id" element={<ClientLayout><RestaurantMenuPage /></ClientLayout>} />
          <Route path="/cart" element={<ClientLayout><ShoppingCartUI /></ClientLayout>} />
          <Route path="/checkout" element={<ClientLayout><CheckoutPage /></ClientLayout>} />
          <Route path="/orders" element={<ClientLayout><OrdersHistoryPage /></ClientLayout>} />

          <Route path="/admin" element={<RestaurantPanelLayout />}>
            <Route index element={<Navigate to="/admin/menu" />} />
            <Route path="menu" element={<AdminMenuPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </Router>
  );
}