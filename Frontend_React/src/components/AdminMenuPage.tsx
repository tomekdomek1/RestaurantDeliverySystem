import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Button, TextField, 
  List, ListItem, ListItemText, ListItemButton, Divider, 
  CircularProgress, Alert, MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { API_BASE_URL } from '../config/api'; 

export default function AdminMenuPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
  
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRestaurants();
    fetchCategories();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurants`);
      if (!response.ok) throw new Error('Nie udało się pobrać restauracji.');
      const data = await response.json();
      
      const token = localStorage.getItem('auth_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userEmail = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email || "";
        
        const myRestaurants = data.filter((rest: any) => 
          rest.descrition && rest.descrition.includes(`[OWNER:${userEmail}]`)
        );
        
        const cleanedRestaurants = myRestaurants.map((rest: any) => ({
          ...rest,
          descrition: rest.descrition.replace(/\[OWNER:.*?\]/g, '').trim()
        }));

        setRestaurants(cleanedRestaurants);
      } else {
        setRestaurants([]);
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (!response.ok) throw new Error('Nie udało się pobrać kategorii.');
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSelectRestaurant = async (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurant.id}/dishes`);
      if (!response.ok) throw new Error('Nie udało się pobrać menu.');
      const data = await response.json();
      setDishes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurant) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurants/${selectedRestaurant.id}/dishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          name: newDish.name,
          description: newDish.description,
          price: parseFloat(newDish.price),
          categoryId: newDish.categoryId 
        })
      });

      if (!response.ok) {
        const errData = await response.text();
        throw new Error(errData || 'Błąd podczas dodawania dania.');
      }

      const addedDish = await response.json();
      setDishes([...dishes, addedDish]);
      setNewDish({ name: '', description: '', price: '', categoryId: '' });
      alert('Danie zostało pomyślnie dodane!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && restaurants.length === 0) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Panel Restauratora 👨‍🍳
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!selectedRestaurant ? (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Wybierz restaurację do zarządzania:</Typography>
          <List>
            {restaurants.map((rest) => (
              <React.Fragment key={rest.id}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleSelectRestaurant(rest)}>
                    <ListItemText 
                      primary={rest.name} 
                      secondary={`Ocena: ${rest.averageRating} | Recenzji: ${rest.totalReviews}`} 
                    />
                    <Button variant="outlined" size="small">Zarządzaj Menu</Button>
                  </ListItemButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Box>
          <Button startIcon={<ArrowBackIcon />} onClick={() => setSelectedRestaurant(null)} sx={{ mb: 2 }}>
            Wróć do listy restauracji
          </Button>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Dodaj nowe danie
                </Typography>
                <Box component="form" onSubmit={handleAddDish} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <TextField 
                    label="Nazwa dania" 
                    required 
                    value={newDish.name}
                    onChange={e => setNewDish({...newDish, name: e.target.value})}
                  />
                  <TextField 
                    label="Opis" 
                    multiline rows={3} 
                    required 
                    value={newDish.description}
                    onChange={e => setNewDish({...newDish, description: e.target.value})}
                  />
                  <TextField 
                    label="Cena (zł)" 
                    type="number" 
                    inputProps={{ step: "0.01" }} 
                    required 
                    value={newDish.price}
                    onChange={e => setNewDish({...newDish, price: e.target.value})}
                  />
                  
                  <TextField 
                    select
                    label="Kategoria" 
                    required 
                    value={newDish.categoryId}
                    onChange={e => setNewDish({...newDish, categoryId: e.target.value})}
                  >
                    {categories.length === 0 ? (
                      <MenuItem disabled value="">Brak kategorii w bazie</MenuItem>
                    ) : (
                      categories.map((cat: any) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))
                    )}
                  </TextField>

                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="warning" 
                    disabled={submitting}
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    {submitting ? 'Dodawanie...' : 'Dodaj do menu'}
                  </Button>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Aktualne menu: {selectedRestaurant.name}
                </Typography>
                {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 3 }} /> : (
                  <List>
                    {dishes.length === 0 ? (
                      <Typography color="text.secondary" sx={{ mt: 2 }}>To menu jest jeszcze puste.</Typography>
                    ) : (
                      dishes.map(dish => (
                        <React.Fragment key={dish.id}>
                          <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">{dish.name}</Typography>
                              <Typography variant="body2" color="text.secondary">{dish.description}</Typography>
                            </Box>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              {dish.price.toFixed(2)} zł
                            </Typography>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))
                    )}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}