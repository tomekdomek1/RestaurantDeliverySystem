import { Box, Typography, Card, CardContent, CircularProgress, Chip, Divider } from "@mui/material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import { useGetOrders } from "../restaurants/hooks/useGetOrders";
import type { GetMyOrdersResultDto, OrderItemResultDto } from "../../api/types/order";

export default function OrdersHistoryPage() {
  const { orders, isLoading, error } = useGetOrders();

  // DANE TESTOWE (MOCK)
  const mockOrders: GetMyOrdersResultDto[] = [
    {
      id: "mock-1",
      date: new Date().toISOString(),
      totalAmount: 85.50,
      status: "Delivered",
      items: [
        { id: "m1", name: "Sushi California Roll", price: 27.99, quantity: 2, dishId: "" },
        { id: "m2", name: "Zupa Miso", price: 14.50, quantity: 2, dishId: "" }
      ],
      restaurantId: "",
      deliveryTime: "",
      address: {
        city: "Warszawa",
        street: "Marszałkowska 1"
      } as any // Ominięcie błędów typowania dla testu
    }
  ];

  // Jeśli nie ma danych z backendu, używamy danych testowych
  const displayOrders = (orders && orders.length > 0) ? orders : mockOrders;

  const getStatusColor = (status: string): "warning" | "info" | "success" | "error" | "primary" => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'accepted': return 'info';
      case 'delivered': return 'success';
      case 'rejected': return 'error';
      default: return 'primary';
    }
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) {
    console.error("Błąd ładowania z API, używam danych testowych:", error);
  }

  const sortedOrders: GetMyOrdersResultDto[] = [...displayOrders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
                      label={order.status.toUpperCase()} 
                      color={getStatusColor(order.status)} 
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
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}