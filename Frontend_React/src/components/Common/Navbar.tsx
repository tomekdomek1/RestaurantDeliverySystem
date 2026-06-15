import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Box, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../features/cart/context/CartContext';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useRestaurantId } from '../../features/auth/hooks/useRestaurantId';
import { useRestaurantNotifications } from '../../features/orders/hooks/useRestaurantNotifications';
import NotificationBell from '../../features/orders/components/NotificationBell';

export default function Navbar() {
  const navigate = useNavigate();
  const { state } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const { restaurantId, isLoading: isLoadingRestaurantId } = useRestaurantId();
  
  const cartItemsCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const token = localStorage.getItem('auth_token');
  let isAdmin = false;
  let isOwner = false;
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
      isAdmin = role === 'Admin';
      isOwner = role === 'RestaurantOwner';
    } catch (e) { 
      console.error("Błąd odczytu roli z tokena", e);
    }
  }

  // ZAWSZE wywoływaj hook - nigdy warunkowa!
  const notificationsData = useRestaurantNotifications(restaurantId || '');
  
  // Tylko restaurator z restaurantId widzi dzwonek
  const showNotificationBell = isOwner && restaurantId && !isLoadingRestaurantId;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#ffffff', color: '#000000', boxShadow: '0px 2px 10px rgba(0,0,0,0.08)', mb: 4 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        <Typography variant="h5" component={Link} to="/restaurants" sx={{ textDecoration: 'none', color: '#06C167', fontWeight: 800 }}>
          UberEats<span style={{ color: '#000000', fontWeight: 600 }}>Clone</span>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          
          <Button component={Link} to="/about" color="inherit" startIcon={<InfoIcon />} sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem', color: '#666', '&:hover': { color: '#000' } }}>
            O projekcie
          </Button>

          <Button component={Link} to="/restaurants" color="inherit" sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}>
            Restauracje
          </Button>

          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Button component={Link} to="/admin/owners" variant="contained" color="error" startIcon={<SupervisorAccountIcon />} sx={{ fontWeight: 'bold', borderRadius: 2, textTransform: 'none' }}>
                  Panel Administratora
                </Button>
              )}

              {isOwner && (
                <>
                  {showNotificationBell && (
                    <NotificationBell 
                      notifications={notificationsData.notifications}
                      unreadCount={notificationsData.unreadCount}
                      onMarkAsRead={notificationsData.markAsRead}
                      restaurantId={restaurantId}
                    />
                  )}
                  <Button component={Link} to="/admin/menu" variant="contained" color="warning" startIcon={<StorefrontIcon />} sx={{ fontWeight: 'bold', borderRadius: 2, textTransform: 'none' }}>
                    Panel Restauratora
                  </Button>
                </>
              )}

              {!isAdmin && !isOwner && (
                <IconButton component={Link} to="/cart" color="inherit" sx={{ mr: 1 }}>
                  <Badge badgeContent={cartItemsCount} color="success">
                    <ShoppingCartIcon sx={{ color: '#000000' }} />
                  </Badge>
                </IconButton>
              )}

              <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0, ml: 1 }}>
                <Avatar sx={{ bgcolor: isAdmin ? '#d32f2f' : (isOwner ? '#ed6c02' : '#06C167'), width: 40, height: 40 }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} PaperProps={{ elevation: 4, sx: { mt: 1.5, minWidth: 200, borderRadius: 2 }}}>
                {!isAdmin && !isOwner && (
                  <MenuItem component={Link} to="/orders" onClick={handleMenuClose} sx={{ fontWeight: 600, py: 1.5 }}>🧾 Moje Zamówienia</MenuItem>
                )}
                {isAdmin && (
                  <MenuItem component={Link} to="/admin/owners" onClick={handleMenuClose} sx={{ fontWeight: 600, py: 1.5 }}>Panel Administratora</MenuItem>
                )}
                {isOwner && (
                  <MenuItem component={Link} to="/admin/menu" onClick={handleMenuClose} sx={{ fontWeight: 600, py: 1.5 }}>Panel Restauratora</MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ fontWeight: 600, color: 'error.main', py: 1.5 }}>Wyloguj się</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" variant="text" sx={{ color: '#000000', fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}>Zaloguj</Button>
              <Button component={Link} to="/register" variant="contained" sx={{ bgcolor: '#000000', color: '#ffffff', '&:hover': { bgcolor: '#333333' }, borderRadius: 5, textTransform: 'none', fontWeight: 600, px: 3 }}>Zarejestruj się</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}