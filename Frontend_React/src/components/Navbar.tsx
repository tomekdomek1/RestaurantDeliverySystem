import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const { state } = useCart();
  const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AppBar position="sticky" color="primary" sx={{ mb: 4 }}>
      <Toolbar>
        <RestaurantMenuIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component={Link} to="/restaurants" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
          UberEats Clone
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} to="/restaurants">
            Restauracje
          </Button>
          <Button color="inherit" component={Link} to="/orders">
            Moje Zamówienia
          </Button>
          <Button color="inherit" component={Link} to="/categories-test" size="small" sx={{ opacity: 0.7 }}>
            Panel Admina
          </Button>

          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={totalItems} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;