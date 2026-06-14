import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress, Chip, Divider, Button, Alert } from "@mui/material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useGetOrders } from "../restaurants/hooks/useGetOrders";
import type { GetMyOrdersResultDto, OrderItemResultDto } from "../../api/types/order";
import { getStatusLabel, getStatusColor } from "../../constants/OrderStatuses";

export default function OrdersHistoryPage() {
  const navigate = useNavigate();
  const { orders, isLoading, error } = useGetOrders();

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  
  if (error) {
    return (
      <Box sx={{ pt: 4, maxWidth: 900, mx: 'auto' }}>
         <Alert severity="error">Błąd pobierania zamówień z bazy: {error.message || "Brak połączenia z API"}</Alert>
      </Box>
    );
  }

  const realOrders = orders || [];

  const sortedOrders: GetMyOrdersResultDto[] = [...realOrders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getBorderColor = (statusColor: string) => {
    switch (statusColor) {
      case 'success': return '#2e7d32';
      case 'warning': return '#ed6c02';
      case 'info': return '#0288d1';
      case 'error': return '#d32f2f';
      default: return '#1976d2';
    }
  };

  return (
    <Box sx={{ pt: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ReceiptLongIcon fontSize="large" color="primary" /> Moje Zamówienia
      </Typography>

      {sortedOrders.length === 0 ? (
        <Typography color="text.secondary" variant="h6">
          Nie masz jeszcze żadnych zamówień w naszej bazie. Czas coś zjeść!
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {sortedOrders.map((order) => {
            const statusColor = getStatusColor(order.status);
            
            return (
              <Box key={order.id}>
                <Card sx={{ boxShadow: 2, borderLeft: `6px solid ${getBorderColor(statusColor)}` }}>
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
                        label={getStatusLabel(order.status)} 
                        color={statusColor as any} 
                        sx={{ fontWeight: 'bold', minWidth: 100 }} 
                      />
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Pozycje w zamówieniu:</Typography>
                    {order.items.map((item: OrderItemResultDto) => (
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
            );
          })}
        </Box>
      )}
    </Box>
  );
}