import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Paper, Typography, Box, CircularProgress, 
  Divider, Stepper, Step, StepLabel, Button, Alert 
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotesIcon from '@mui/icons-material/Notes';
import { API_BASE_URL } from '../../config/api'; 

const ORDER_STATUSES = [
  { backendName: 'WaitingForConfirmation', label: 'Oczekuje na akceptację' },
  { backendName: 'Accepted', label: 'W przygotowaniu' },
  { backendName: 'InDelivery', label: 'W drodze' },
  { backendName: 'Delivered', label: 'Dostarczone' }
];

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (!response.ok) throw new Error('Nie udało się pobrać szczegółów zamówienia.');
        
        const data = await response.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrderDetails();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!order) return null;

  let activeStep = ORDER_STATUSES.findIndex(s => s.backendName === order.orderStatus);
  if (activeStep === -1) activeStep = 0;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')} sx={{ mb: 2 }}>
        Wróć do listy zamówień
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptLongIcon color="primary" /> Szczegóły zamówienia
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {new Date(order.date).toLocaleDateString()} o {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ width: '100%', mb: 6 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {ORDER_STATUSES.map((status) => (
              <Step key={status.label}>
                <StepLabel>{status.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Dane dostawy</Typography>
            <Paper variant="outlined" sx={{ p: 3, bgcolor: '#fafafa', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              
              {/* Sekcja Adresu */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <HomeIcon color="primary" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Adres dostawy</Typography>
                  <Typography variant="body1" fontWeight="500">
                    ul. {order.address?.street} {order.address?.buildingNumber}
                    {order.address?.appartmentNumber ? `/${order.address.appartmentNumber}` : ''}
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {order.address?.city}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Sekcja Czasu Dostawy */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AccessTimeIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">Oczekiwany czas</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {order.deliveryTime}
                  </Typography>
                </Box>
              </Box>

              {/* Sekcja Notatki */}
              {order.notes && (
                <>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <NotesIcon color="primary" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Notatka dla kuriera</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                        "{order.notes}"
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
              
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Twoje jedzenie</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {order.items?.map((item: any) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', pb: 1 }}>
                  <Typography variant="body1">
                    <strong>{item.quantity}x</strong> {item.dishNameAtPurchase}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {(item.priceAtPurchase * item.quantity).toFixed(2)} zł
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '2px solid #eee' }}>
              <Typography variant="h6" fontWeight="bold">Suma całkowita:</Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">{order.totalAmount.toFixed(2)} zł</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}