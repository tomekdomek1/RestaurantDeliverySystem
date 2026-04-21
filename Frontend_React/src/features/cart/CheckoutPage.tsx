import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';

import { useCart } from "./context/CartContext";
import { useGetAddresses } from "../address/hooks/useGetAddresses"; 
import CheckoutAddressSelection from "./CheckoutAddressSelection";
import CheckoutOrderSummary from "./CheckoutOrderSummary";

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
    
    const newOrder = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      status: "W trakcie przygotowania",
      totalAmount: totalPrice,
      addressId: selectedAddress,
      items: state.items
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      dispatch({ type: 'CLEAR_CART' });
      enqueueSnackbar("Zamówienie zostało złożone pomyślnie!", { variant: "success" });
      navigate('/orders');
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
        <CheckoutAddressSelection 
          addresses={addresses} 
          isLoading={isLoading} 
          error={error} 
          selectedAddress={selectedAddress} 
          setSelectedAddress={setSelectedAddress} 
        />
        <CheckoutOrderSummary 
          items={state.items} 
          totalPrice={totalPrice} 
          handlePlaceOrder={handlePlaceOrder} 
          isOrdering={isOrdering} 
        />
      </Box>
    </Box>
  );
}