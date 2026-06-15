import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  TextField, Alert, InputAdornment, Select, MenuItem, FormControl, Chip, CircularProgress, 
  Snackbar, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Divider
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { API_BASE_URL } from '../config/api';
import { ORDER_STATUSES, getStatusColor } from '../constants/OrderStatuses'; 

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState({ type: 'success', message: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  useEffect(() => {
    fetchOwnerOrders();
  }, []);

  const fetchOwnerOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error("Brak uprawnień.");
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userEmail = payload.sub || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email || "";

      // 1. Pobieramy restauracje i zachowujemy całe obiekty (żeby mieć ich nazwy!)
      const restRes = await fetch(`${API_BASE_URL}/api/restaurants`);
      if (!restRes.ok) throw new Error('Błąd pobierania restauracji.');
      const allRestaurants = await restRes.json();
      const myRestaurants = allRestaurants.filter((r: any) => r.descrition?.includes(`[OWNER:${userEmail}]`));

      let allOrders: any[] = [];
      for (const rest of myRestaurants) {
        const res = await fetch(`${API_BASE_URL}/api/orders/restaurant/${rest.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          allOrders = [...allOrders, ...data];
        }
      }
      const mappedOrders = allOrders.map(o => {
        const statusObj = ORDER_STATUSES.find(s => s.backendName === o.status);
        const restaurantObj = myRestaurants.find((r: any) => r.id === o.restaurantId);
        
        return {
          ...o,
          orderStatus: statusObj ? statusObj.value : 0,
          restaurantName: restaurantObj ? restaurantObj.name : 'Nieznana restauracja'
        };
      });

      const sortedOrders = mappedOrders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(sortedOrders);
    } catch (err: any) {
      console.error("Błąd w fetchOwnerOrders:", err);
      setStatus({ type: 'error', message: err.message });
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: number) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Nie udało się zmienić statusu.');

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      
      setStatus({ type: 'success', message: 'Pomyślnie zaktualizowano status!' });
      setSnackbarOpen(true);
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Wystąpił błąd' });
      setSnackbarOpen(true);
    } finally {
      setIsUpdating(false);
    }
  };

  // Wyszukiwarka szuka teraz też po nazwie restauracji!
  const filteredOrders = orders.filter(o => 
    (o.address?.city || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.address?.street || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.restaurantName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ReceiptLongIcon fontSize="large" color="primary" /> Zarządzanie Zamówieniami
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, mt: 3, gap: 2 }}>
        <TextField 
          placeholder="Szukaj po restauracji, mieście lub ulicy..." 
          size="small" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          sx={{ minWidth: 350, bgcolor: 'white' }} 
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>}} 
        />
      </Box>

      {loading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><b>Data</b></TableCell>
                <TableCell><b>Restauracja</b></TableCell>
                <TableCell><b>Adres dostawy</b></TableCell>
                <TableCell><b>Wartość</b></TableCell>
                <TableCell align="center"><b>Szczegóły</b></TableCell>
                <TableCell align="right" sx={{ width: '250px' }}><b>Zmień status</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center">Brak zamówień spełniających kryteria</TableCell></TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const currentStatusValue = order.orderStatus ?? 0;
                  const statusColor = getStatusColor(currentStatusValue);

                  return (
                    <TableRow key={order.id} hover sx={{ opacity: isUpdating ? 0.6 : 1 }}>
                      <TableCell>{new Date(order.date).toLocaleString('pl-PL')}</TableCell>
                      
                      {/* NOWA KOLUMNA: NAZWA RESTAURACJI */}
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {order.restaurantName}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight="500">{order.address?.city}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ul. {order.address?.street} {order.address?.buildingNumber}
                          {order.address?.appartmentNumber ? `/${order.address.appartmentNumber}` : ''}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{order.totalAmount?.toFixed(2)} zł</TableCell>
                      
                      <TableCell align="center">
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="primary"
                          startIcon={<FormatListBulletedIcon />}
                          onClick={() => setSelectedOrderDetails(order)}
                        >
                          Zawartość
                        </Button>
                      </TableCell>

                      <TableCell align="right">
                        <FormControl fullWidth size="small">
                          <Select
                            value={currentStatusValue}
                            onChange={(e) => handleStatusChange(order.id, Number(e.target.value))}
                            disabled={isUpdating}
                            sx={{ bgcolor: statusColor === 'success' ? '#e8f5e9' : 'white', textAlign: 'left' }}
                          >
                            {ORDER_STATUSES.map((status) => (
                              <MenuItem key={status.value} value={status.value}>
                                <Chip label={status.label} size="small" color={status.color} sx={{ mr: 1, height: 20, fontSize: '0.7rem' }} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* --- OKIENKO (MODAL) ZE SZCZEGÓŁAMI ZAMÓWIENIA --- */}
      <Dialog 
        open={!!selectedOrderDetails} 
        onClose={() => setSelectedOrderDetails(null)} 
        maxWidth="sm" 
        fullWidth
      >
        {selectedOrderDetails && (
          <>
            <DialogTitle sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
              <StorefrontIcon color="primary" /> {selectedOrderDetails.restaurantName}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box>
                {/* Sekcja Adresowa */}
                <Box mb={3}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                    ADRES DOSTAWY:
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    ul. {selectedOrderDetails.address?.street} {selectedOrderDetails.address?.buildingNumber}
                    {selectedOrderDetails.address?.appartmentNumber ? `/${selectedOrderDetails.address.appartmentNumber}` : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrderDetails.address?.city}
                  </Typography>
                </Box>

                {/* Sekcja Notatek */}
                {selectedOrderDetails.notes && (
                  <Box mb={3} p={1.5} sx={{ bgcolor: '#fff3e0', borderLeft: '4px solid #ff9800', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="warning.dark" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                      NOTATKA OD KLIENTA:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      "{selectedOrderDetails.notes}"
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ mb: 2 }} />

                {/* Sekcja Jedzenia */}
                <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                  DO PRZYGOTOWANIA:
                </Typography>
                <List disablePadding>
                  {selectedOrderDetails.items?.map((item: any) => (
                    <ListItem key={item.id} sx={{ px: 0, py: 0.5 }}>
                      <ListItemText 
                        primary={
                          <Typography variant="body1">
                            <strong style={{ color: '#d32f2f' }}>{item.quantity}x</strong> {item.name}
                          </Typography>
                        }
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {(item.price * item.quantity).toFixed(2)} zł
                      </Typography>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />
                
                {/* Podsumowanie */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Do zapłaty:</Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    {selectedOrderDetails.totalAmount?.toFixed(2)} zł
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
              <Button variant="contained" onClick={() => setSelectedOrderDetails(null)}>Zamknij szczegóły</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={status.type as any} sx={{ width: '100%' }}>
          {status.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}