import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton, Menu, MenuItem } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../features/cart/context/CartContext';
import { useAuth } from '../../features/auth/hooks/useAuth';

const Navbar: React.FC = () => {
  const { state } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const totalItems = state.items.reduce((acc: number, item: any) => acc + item.quantity, 0);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

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

          {isLoggedIn ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  {user?.email}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;