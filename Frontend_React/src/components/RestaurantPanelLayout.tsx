import { Box, Drawer, List, Typography, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

export default function RestaurantPanelLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/reports' },
    { text: 'Moje Menu', icon: <RestaurantMenuIcon />, path: '/admin/menu' },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f7fe', minHeight: '100vh' }}>
      <Drawer variant="permanent" sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#0b1437', color: 'white', border: 'none' } }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="900">UBER<span style={{ color: '#ff5252' }}>CRM</span></Typography>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 3 }} />
        </Box>
        
        <List sx={{ px: 2, flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                component={Link} to={item.path}
                selected={location.pathname === item.path}
                sx={{ borderRadius: '12px', '&.Mui-selected': { bgcolor: '#ff5252', '&:hover': { bgcolor: '#e04545' } } }}
              >
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 3 }}>
          <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, textAlign: 'center', mb: 2 }}>
            <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: '#ff5252' }}>A</Avatar>
            <Typography variant="body2" fontWeight="bold">Admin Restauracji</Typography>
          </Paper>
          <ListItemButton onClick={() => navigate('/restaurants')} sx={{ borderRadius: '12px', color: '#ff8a80' }}>
            <ListItemIcon><LogoutIcon sx={{ color: '#ff8a80' }} /></ListItemIcon>
            <ListItemText primary="Wróć do sklepu" />
          </ListItemButton>
        </Box>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', minHeight: '85vh', boxShadow: '0px 20px 40px rgba(0,0,0,0.02)' }}>
          <Outlet />
        </Paper>
      </Box>
    </Box>
  );
}