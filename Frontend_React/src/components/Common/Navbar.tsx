import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Box, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../features/cart/context/CartContext';
import { useAuth } from '../../features/auth/hooks/useAuth';

export default function Navbar() {
  const navigate = useNavigate();
  const { state } = useCart();
  const { isLoggedIn, logout } = useAuth();
  
  const cartItemsCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#ffffff', color: '#000000', boxShadow: '0px 2px 10px rgba(0,0,0,0.08)', mb: 4 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        <Typography
          variant="h5"
          component={Link}
          to="/restaurants"
          sx={{ textDecoration: 'none', color: '#06C167', fontWeight: 800, letterSpacing: '-0.5px' }}
        >
          UberEats<span style={{ color: '#000000', fontWeight: 600 }}>Clone</span>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          
          <Button component={Link} to="/restaurants" color="inherit" sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}>
            Restauracje
          </Button>

          {isLoggedIn ? (
            <>
              <IconButton component={Link} to="/cart" color="inherit" sx={{ mr: 1 }}>
                <Badge badgeContent={cartItemsCount} color="success">
                  <ShoppingCartIcon sx={{ color: '#000000' }} />
                </Badge>
              </IconButton>

              <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: '#06C167', width: 40, height: 40 }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 4,
                  sx: { mt: 1.5, minWidth: 200, borderRadius: 2 }
                }}
              >
                <MenuItem component={Link} to="/orders" onClick={handleMenuClose} sx={{ fontWeight: 600, py: 1.5 }}>
                   🧾 Moje Zamówienia
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ fontWeight: 600, color: 'error.main', py: 1.5 }}>
                   🚪 Wyloguj się
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                component={Link} 
                to="/login" 
                variant="text" 
                sx={{ color: '#000000', fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}
              >
                Zaloguj
              </Button>
              
              <Button 
                component={Link} 
                to="/register" 
                variant="contained" 
                sx={{ 
                  bgcolor: '#000000', 
                  color: '#ffffff', 
                  '&:hover': { bgcolor: '#333333' }, 
                  borderRadius: 5,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3
                }}
              >
                Zarejestruj się
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}