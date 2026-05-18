import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Button, Divider, Alert, CircularProgress } from '@mui/material';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  date: string;
  items: OrderItem[];
}

export default function IncomingOrdersPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/restaurant/${restaurantId}`);
      if (!response.ok) throw new Error('Błąd pobierania danych');
      const data: Order[] = await response.json();
      
      // Filtrujemy tylko aktywne zamówienia (wykluczamy odrzucone i dostarczone)
      const activeStatuses = ['pending', 'accepted', 'readyfordelivery', 'indelivery'];
      const activeOrders = data.filter((o: Order) => 
        activeStatuses.includes(o.status.toLowerCase())
      );
      
      setOrders(activeOrders);
      setError(null);
    } catch (err) {
      setError("Nie udało się załadować aktywnie przychodzących zamówień.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchActiveOrders();
    }
  }, [restaurantId]);

  const handleUpdateStatus = async (orderId: string, action: 'Accept' | 'Deny' | 'PassToDelivery') => {
    let newStatus = '';
    if (action === 'Accept') newStatus = 'Accepted';
    if (action === 'Deny') newStatus = 'Rejected';
    if (action === 'PassToDelivery') newStatus = 'ReadyForDelivery';

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Odświeżamy listę po udanym zapisie
        fetchActiveOrders();
      } else {
        setError("Wystąpił problem podczas aktualizacji statusu zamówienia.");
      }
    } catch (err) {
      setError("Błąd połączenia z serwerem.");
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0b1437', mb: 3 }}>
        Przychodzące Zamówienia
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {orders.length === 0 ? (
        <Typography color="text.secondary">Obecnie brak nowych lub oczekujących zamówień.</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order.id} sx={{ borderRadius: '16px', boxShadow: '0px 10px 30px rgba(0,0,0,0.02)', mb: 3, border: '1px solid #e0e0e0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Złożono: {new Date(order.date).toLocaleString('pl-PL')}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: order.status.toLowerCase() === 'pending' ? '#ff5252' : '#1976d2' }}>
                  {order.status.toUpperCase()}
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0b1437', mb: 2 }}>
                Suma: {order.totalAmount.toFixed(2)} zł
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#0b1437' }}>Pozycje:</Typography>
              {order.items?.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#f4f7fe', p: 1.5, borderRadius: '8px', mb: 1 }}>
                  <Typography variant="body2" fontWeight={500}>{item.name} x {item.quantity}</Typography>
                  <Typography variant="body2" fontWeight={600}>{(item.price * item.quantity).toFixed(2)} zł</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 2 }}>
                {order.status.toLowerCase() === 'pending' && (
                  <>
                    <Button variant="outlined" color="error" sx={{ borderRadius: '10px', fontWeight: 600 }} onClick={() => handleUpdateStatus(order.id, 'Deny')}>
                      Deny
                    </Button>
                    <Button variant="contained" sx={{ bgcolor: '#0b1437', '&:hover': { bgcolor: '#1b254b' }, borderRadius: '10px', fontWeight: 600 }} onClick={() => handleUpdateStatus(order.id, 'Accept')}>
                      Accept
                    </Button>
                  </>
                )}
                {order.status.toLowerCase() === 'accepted' && (
                  <Button variant="contained" color="success" sx={{ borderRadius: '10px', fontWeight: 600 }} onClick={() => handleUpdateStatus(order.id, 'PassToDelivery')}>
                    Pass to Delivery
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}