// Frontend_React/src/App.tsx

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; 
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm"; // Używamy RegistrationForm zamiast RegisterForm z poprzedniej iteracji
import ShoppingCartUI from "./components/ShoppingCartUI"; 
import TestProduct from "./components/TestProduct"; 
import CategoryTestPage from "./components/CategoryTestPage"; // Import nowego komponentu
import AddressTestPage from "./components/AddressTestPage"; // Import nowego komponentu
import { Button, Box } from '@mui/material'; // Do stylizacji linków

function App() {
  return (
    <Router>
      <CartProvider>
        <Box sx={{ textAlign: "center", mt: 3, mb: 3 }}>
          <Button component={Link} to="/login" variant="outlined" sx={{ mr: 1 }}>Login</Button>
          <Button component={Link} to="/register" variant="outlined" sx={{ mr: 1 }}>Register</Button>
          <Button component={Link} to="/products" variant="outlined" sx={{ mr: 1 }}>Produkty</Button>
          <Button component={Link} to="/categories-test" variant="contained" color="primary" sx={{ mr: 1 }}>Test Kategorii</Button>
          <Button component={Link} to="/addresses-test" variant="contained" color="success" sx={{ mr: 1 }}>Test Adresów</Button>
          <Button component={Link} to="/cart" variant="contained" color="secondary">Koszyk</Button>
        </Box>

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/categories-test" element={<CategoryTestPage />} />
          <Route path="/addresses-test" element={<AddressTestPage />} />
          
          <Route path="/cart" element={<ShoppingCartUI />} /> 
          
          <Route path="/products" element={
            <Box sx={{ textAlign: 'center', mt: 3 }}>
                <TestProduct id={1} name="Burger Klasyczny" price={25.99} />
                <TestProduct id={2} name="Frytki Duże" price={9.50} />
                <TestProduct id={3} name="Cola Zero 1L" price={7.00} />
            </Box>
          } />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;