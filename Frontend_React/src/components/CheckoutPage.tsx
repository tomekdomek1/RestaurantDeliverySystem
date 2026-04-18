import { useState } from "react";
import { Box, Typography, Card, CardContent, CircularProgress, Button, Radio, RadioGroup, FormControlLabel, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useCart } from "../context/CartContext";
import { useGetAddresses } from "../hooks/address/useGetAddresses"; 

export default function CheckoutPage() {
  const { state, totalPrice, dispatch } = useCart();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const { addresses, isLoading, error } = useGetAddresses();
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isOrdering, setIsOrdering] = useState(false);

  if (state.items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h5" gutterBottom>Twój koszyk jest pusty!</Typography>
        <Button variant="contained" onClick={() => navigate('/restaurants')}>Wróć do zamawiania</Button>
      </Box>
    );
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      enqueueSnackbar("Proszę wybrać adres dostawy!", { variant: "error" });
      return;
    }

    setIsOrdering(true);
    
    // Budujemy obiekt zamówienia tak, jakbyśmy wysyłali go do .NET
    const newOrder = {
      id: crypto.randomUUID(), // Generujemy losowe ID
      date: new Date().toISOString(),
      status: "W trakcie przygotowania",
      totalAmount: totalPrice,
      addressId: selectedAddress,
      items: state.items
    };

    try {
      // Zapisujemy zamówienie w naszym json-server!
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      dispatch({ type: 'CLEAR_CART' });
      enqueueSnackbar("Zamówienie zostało złożone pomyślnie!", { variant: "success" });
      navigate('/orders'); // Kierujemy użytkownika od razu do jego historii zamówień!
    } catch (err) {
      enqueueSnackbar("Błąd podczas składania zamówienia.", { variant: "error" });
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <Box sx={{ pt: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <DeliveryDiningIcon fontSize="large" color="primary" /> Kasa i Dostawa
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' }, gap: 4 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Wybierz adres dostawy</Typography>
          {isLoading ? <CircularProgress /> : error ? <Typography color="error">Błąd adresów</Typography> : (
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <RadioGroup value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
                  {addresses.map((addr) => (
                    <Box key={addr.id} sx={{ mb: 1, p: 1, border: '1px solid #eee', borderRadius: 2, '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <FormControlLabel 
                        value={addr.id} 
                        control={<Radio />} 
                        label={<Box><Typography sx={{ fontWeight: 600 }}>{addr.street} {addr.buildingNumber}</Typography><Typography variant="body2">{addr.city}</Typography></Box>} 
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Box>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}
        </Box>

        <Box>
          <Card sx={{ bgcolor: '#fafafa', border: '1px solid #e0e0e0', boxShadow: 0 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Podsumowanie</Typography>
              {state.items.map(item => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{item.quantity}x {item.name}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{(item.price * item.quantity).toFixed(2)} zł</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Do zapłaty:</Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>{totalPrice.toFixed(2)} zł</Typography>
              </Box>
              <Button 
                variant="contained" color="success" fullWidth size="large" onClick={handlePlaceOrder} disabled={isOrdering}
                startIcon={isOrdering ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlineIcon />}
              >
                {isOrdering ? "Przetwarzanie..." : "Zamawiam i płacę"}
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}