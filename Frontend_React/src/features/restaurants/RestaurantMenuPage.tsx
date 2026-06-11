import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardActions, Button, Box, CircularProgress, Divider, Paper, Alert } from '@mui/material';
import { API_BASE_URL } from '../../config/api';
import { useCart } from '../cart/context/CartContext';
import { useAuth } from '../auth/hooks/useAuth';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
}

interface Restaurant {
  id: string;
  name: string;
  phoneNumber: string;
  descrition: string;
  addressId: string;
  averageRating: number;
  totalReviews: number;
}

interface Review {
  id: string;
  rating: number;
  description: string;
  createdAt: string;
  authorUserId: string;
}

const RestaurantMenuPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cartContext: any = useCart();
  const {isLoggedIn} = useAuth();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = (dish: Dish) => {
    if (cartContext && typeof cartContext.dispatch === 'function') {
      cartContext.dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          restaurantId: id
        }
      });
      console.log(`Dodano danie: ${dish.name} do koszyka.`);
    } else {
      console.error("Nie znaleziono mechanizmu dispatch w CartContext!");
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = currentCart.find((item: any) => item.id === dish.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        currentCart.push({ id: dish.id, name: dish.name, price: dish.price, quantity: 1, restaurantId: id });
      }
      localStorage.setItem('cart', JSON.stringify(currentCart));
      window.dispatchEvent(new Event('storage'));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const restRes = await fetch(`${API_BASE_URL}/api/restaurants/${id}`);
        if (!restRes.ok) throw new Error('Nie znaleziono restauracji');
        const restData = await restRes.json();
        setRestaurant(restData);

        try {
          const dishRes = await fetch(`${API_BASE_URL}/api/restaurants/${id}/dishes`);
          if (dishRes.ok) {
            const dishData = await dishRes.json();
            setDishes(Array.isArray(dishData) ? dishData : (dishData.items || []));
          }
        } catch (e) {
          console.warn('Błąd pobierania menu:', e);
        }

        try {
          const reviewsRes = await fetch(`${API_BASE_URL}/api/restaurants/${id}/reviews?pageNumber=1&pageSize=50`);
          if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json();
            setReviews(Array.isArray(reviewsData) ? reviewsData : (reviewsData.items || []));
          }
        } catch (e) {
          console.warn('Błąd pobierania opinii:', e);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !restaurant) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Wystąpił błąd podczas ładowania restauracji.'}</Alert>
        <Button variant="outlined" onClick={() => navigate('/restaurants')} sx={{ mt: 2 }}>Powrót do listy</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          {restaurant.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {restaurant.descrition || 'Brak opisu restauracji.'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Kontakt: {restaurant.phoneNumber || 'Brak telefonu'} | Ocena: {restaurant.averageRating > 0 ? `${restaurant.averageRating.toFixed(1)} ⭐ (${restaurant.totalReviews} opinii)` : 'Brak ocen'}
        </Typography>
      </Paper>

      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Menu</Typography>
      {dishes.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>Ta restauracja nie ma jeszcze dodanych dań lub nie udało się ich załadować.</Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {dishes.map((dish) => (
            <Card key={dish.id} elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, backgroundColor: 'background.paper' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold">{dish.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                  {dish.description}
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {dish.price.toFixed(2)} PLN
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                {isLoggedIn ? (
                  <Button variant="contained" color="primary" fullWidth onClick={() => handleAddToCart(dish)}>
                    Dodaj do koszyka
                  </Button>
                ) : (
                  <Button variant="outlined" color="primary" fullWidth onClick={() => navigate('/login')}>
                    Zaloguj się, aby zamówić
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      <Divider sx={{ my: 6, borderColor: 'primary.dark' }} />

      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Opinie klientów</Typography>
      {reviews.length === 0 ? (
        <Typography variant="body1" color="text.secondary">Jeszcze nikt nie ocenił tej restauracji.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {reviews.map((review) => (
            <Paper key={review.id} elevation={2} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', height: '100%' }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mr: 2 }}>
                  {review.rating} ⭐
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              {review.description && (
                <Typography variant="body1" sx={{ mt: 1 }}>{review.description}</Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default RestaurantMenuPage;