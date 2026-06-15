import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"; // <-- Doda�am Outlet
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
import RestaurantPanelLayout from "./components/RestaurantPanelLayout";
import AdminMenuPage from "./components/AdminMenuPage";
import RequireRole from "./features/auth/components/RequireRole";
import { RestaurantReportPage } from './features/restaurants/RestaurantReportPage';
import { RestaurantNotificationsPage } from './features/orders/RestaurantNotificationsPage';
import OrderDetailsPage from "./features/orders/OrderDetailsPage";
import AdminOwnersPage from "./components/AdminOwnersPage";
import AdminRestaurantsPage from "./components/AdminRestaurantsPage";
import AdminCustomersPage from "./components/AdminCustomersPage";
import OwnerOrdersPage from './components/OwnerOrdersPage';
import AboutPage from "./features/about/AboutPage";

const StorefrontWrapper = () => (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, pb: 6 }}>
        <Outlet />
    </Box>
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
                            <Route path="/about" element={<AboutPage />} /> {/* <-- ROUTING STRONY */}
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<RegistrationForm />} />
                            <Route path="/orders/:id" element={<OrderDetailsPage />} />
                            <Route path="/restaurants" element={<RestaurantsPage />} />
                            <Route path="/restaurants/:id" element={<RestaurantMenuPage />} />
                            <Route path="/cart" element={<ShoppingCartUI />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/orders" element={<OrdersHistoryPage />} />
                            <Route path="/categories-test" element={<CategoryTestPage />} />
                            <Route path="/addresses-test" element={<AddressTestPage />} />
                            <Route
                                path="/admin"
                                element={
                                    <RequireRole allowedRoles={['Admin', 'RestaurantOwner']}>
                                        <RestaurantPanelLayout />
                                    </RequireRole>
                                }
                            >
                                <Route index element={<Navigate to="/admin/menu" />} />
                                <Route path="menu" element={<AdminMenuPage />} />
                                <Route path="reports" element={<RestaurantReportPage />} />
                                <Route path="notifications/:restaurantId" element={<RestaurantNotificationsPage />} />
                                <Route path="owners" element={<AdminOwnersPage />} />
                                <Route path="restaurants-list" element={<AdminRestaurantsPage />} />
                                <Route path="customers" element={<AdminCustomersPage />} />
                                <Route path="orders" element={<OwnerOrdersPage />} />
                            </Route>

                        </Routes>
                    </Box>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}