import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper, TextField, Alert, Divider, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../auth/hooks/useAuth';
import { useCart } from './context/CartContext';
import { API_BASE_URL } from '../../config/api';

const CheckoutPage: React.FC = () => {
    const { state, dispatch } = useCart();
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notes, setNotes] = useState('');
    
    // Zmiana: Inicjujemy numery jako puste stringi zamiast zer
    const [address, setAddress] = useState({
        street: '',
        buildingNumber: '', 
        appartmentNumber: '', 
        city: ''
    });

    if (state.items.length === 0) {
        return (
            <Container>
                <Typography variant="h5" mt={4}>Twój koszyk jest pusty.</Typography>
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/restaurants')}>Wróć do menu</Button>
            </Container>
        );
    }

    if (!isLoggedIn) {
        return (
            <Container>
                <Typography variant="h5" color="error" mt={4}>Musisz być zalogowany, aby złożyć zamówienie!</Typography>
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/login')}>Zaloguj się</Button>
            </Container>
        );
    }

    const calculatedTotalPrice = state.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const orderRestaurantId = (state.items[0] as any).restaurantId || "00000000-0000-0000-0000-000000000000";

    const handleCheckout = async () => {
        setLoading(true);
        setError('');
        try {
            const payload = {
                restaurantId: orderRestaurantId,
                address: {
                    street: address.street,
                    // Zmiana: Rzutowanie na liczbę tuż przed wysłaniem. Jeśli puste, wysyła 0.
                    buildingNumber: Number(address.buildingNumber) || 0,
                    appartmentNumber: Number(address.appartmentNumber) || 0,
                    city: address.city
                },
                notes: notes,
                deliveryTime: new Date(new Date().getTime() + 45 * 60000).toISOString().split('T')[1].substring(0, 8),
                items: state.items.map((item: any) => ({
                    dishId: item.id,
                    dishNameAtPurchase: item.name,
                    priceAtPurchase: item.price,
                    quantity: item.quantity
                }))
            };

            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Wystąpił błąd podczas składania zamówienia.");
            }

            dispatch({ type: 'CLEAR_CART' });
            navigate('/orders'); 
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = (id: any) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id } } as any);
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>Kasa i płatność</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <Box mb={2}>
                    {state.items.map((item: any) => (
                        <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography>
                                <strong>{item.quantity}x</strong> {item.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ mr: 2, fontWeight: 600 }}>
                                    {(item.price * item.quantity).toFixed(2)} zł
                                </Typography>
                                <IconButton color="error" size="small" onClick={() => handleRemoveItem(item.id)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h5" color="primary">Razem do zapłaty: {calculatedTotalPrice.toFixed(2)} zł</Typography>
                
                <TextField
                    fullWidth
                    margin="normal"
                    label="Uwagi do zamówienia (opcjonalnie)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    multiline
                    rows={2}
                    sx={{ mt: 3 }}
                />
                
                <Box sx={{ my: 3 }}>
                    <TextField 
                        fullWidth 
                        label="Ulica" 
                        value={address.street} 
                        onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))} 
                        margin="normal" 
                    />
                    <TextField 
                        fullWidth 
                        label="Numer budynku" 
                        type="number" 
                        value={address.buildingNumber} 
                        // Zmiana: zapisuje to jako zwykły wpisywany tekst w stanie 
                        onChange={(e) => setAddress(prev => ({ ...prev, buildingNumber: e.target.value }))} 
                        margin="normal" 
                    />
                    <TextField 
                        fullWidth 
                        label="Numer mieszkania (opcjonalne)" 
                        type="number" 
                        value={address.appartmentNumber} 
                        // Zmiana: tak samo jak wyżej
                        onChange={(e) => setAddress(prev => ({ ...prev, appartmentNumber: e.target.value }))} 
                        margin="normal" 
                    />
                    <TextField 
                        fullWidth 
                        label="Miasto" 
                        value={address.city} 
                        onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))} 
                        margin="normal" 
                    />
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleCheckout}
                    disabled={loading}
                    sx={{ mt: 3, py: 1.5 }}
                >
                    {loading ? 'Przetwarzanie zamówienia...' : 'ZAMAWIAM I PŁACĘ'}
                </Button>
            </Paper>
        </Container>
    );
};

export default CheckoutPage;