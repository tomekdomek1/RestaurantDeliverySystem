import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress, Chip, Divider, Button } from "@mui/material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useGetOrders } from "../restaurants/hooks/useGetOrders";

const STATUS_LABELS: Record<string, string> = {
  'waitingforconfirmation': 'Oczekuje',
  'accepted': 'W przygotowaniu',
  'indelivery': 'W drodze',
  'delivered': 'Dostarczone',
  'rejected': 'Odrzucone'
};

export default function OrdersHistoryPage() {
  const navigate = useNavigate();
  const { orders, isLoading, error } = useGetOrders();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'waitingforconfirmation': // Zaktualizowane pod słownik
        return 'warning';
      case 'accepted':
        return 'info';
      case 'delivered':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'primary';
    }
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={5}>Wystąpił błąd podczas ładowania historii.</Typography>;

  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Box sx={{ pt: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ReceiptLongIcon fontSize="large" color="primary" /> Moje Zamówienia
      </Typography>

      {sortedOrders.length === 0 ? (
        <Typography color="text.secondary">Nie masz jeszcze żadnych zamówień.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {sortedOrders.map((order) => (
            <Box key={order.id}>
              <Card sx={{ boxShadow: 2, borderLeft: `6px solid ${
                order.status.toLowerCase() === 'delivered' ? '#2e7d32' : 
                order.status.toLowerCase() === 'rejected' ? '#d32f2f' : '#1976d2'
              }` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Data zamówienia: {new Date(order.date).toLocaleString('pl-PL')}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                        Razem: {order.totalAmount.toFixed(2)} zł
                      </Typography>
                    </Box>
                    <Chip 
                      // Używamy tłumaczenia z obiektu STATUS_LABELS
                      label={STATUS_LABELS[order.status.toLowerCase()] || order.status} 
                      color={getStatusColor(order.status) as any} 
                      sx={{ fontWeight: 'bold', minWidth: 100 }} 
                    />
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Pozycje w zamówieniu:</Typography>
                  {order.items.map((item: any) => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#f9f9f9', p: 1, mb: 0.5, borderRadius: 1 }}>
                      <Typography variant="body2">{item.quantity}x {item.name}</Typography>
                      <Typography variant="body2">{(item.price * item.quantity).toFixed(2)} zł</Typography>
                    </Box>
                  ))}

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Zobacz szczegóły
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}