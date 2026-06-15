import React, { useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link as RouterLink } from 'react-router-dom';
import type { NotificationRecord } from '../services/NotificationService';

interface NotificationBellProps {
  notifications: NotificationRecord[];
  unreadCount: number;
  onMarkAsRead: (orderId: string) => void;
  restaurantId: string;
}

export default function NotificationBell({ 
  notifications, 
  unreadCount, 
  onMarkAsRead,
  restaurantId 
}: NotificationBellProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const unreadNotifications = notifications.filter(n => !n.read).slice(0, 5);

  return (
    <>
      <IconButton 
        onClick={handleOpen}
        size="small"
        sx={{ mr: 2, p: 0 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ fontSize: 24, color: '#000000' }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            minWidth: 350,
            maxWidth: 400,
            maxHeight: 500,
            borderRadius: 2,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Powiadomienia ({unreadCount} nowych)
          </Typography>
        </Box>
        <Divider />

        {unreadNotifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Brak nowych powiadomień
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
            {unreadNotifications.map((notification) => (
              <MenuItem
                key={notification.orderId}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  p: 1.5,
                  gap: 0.5,
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    #{notification.order.id.slice(0, 8).toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                    {notification.order.totalAmount.toFixed(2)} zł
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {notification.order.items.length} dania
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={(e) => {
                    e.preventDefault();
                    onMarkAsRead(notification.orderId);
                  }}
                  sx={{ p: 0, fontSize: '0.75rem' }}
                >
                  Oznacz jako przeczytane
                </Button>
              </MenuItem>
            ))}
          </Box>
        )}

        <Divider />
        <Box sx={{ p: 1 }}>
          <Button
            component={RouterLink}
            to={`/admin/notifications/${restaurantId}`}
            fullWidth
            variant="contained"
            size="small"
            sx={{ fontWeight: 600 }}
          >
            Wszystkie powiadomienia
          </Button>
        </Box>
      </Menu>
    </>
  );
}
