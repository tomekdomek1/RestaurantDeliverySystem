import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./features/cart/context/CartContext";
import { AuthProvider } from "./features/auth/context/AuthContext";
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
                            <Route path="/admin" element={<RestaurantPanelLayout />}>
                                <Route index element={<Navigate to="/admin/menu" />} />
                                <Route path="menu" element={<AdminMenuPage />} />
                            </Route>
                        </Routes>
                    </Box>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;