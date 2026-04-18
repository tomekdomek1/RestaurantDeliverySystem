import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, CircularProgress, Button, IconButton, Divider } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useSnackbar } from "notistack";
import { useGetRestaurant } from "../hooks/restaurant/useGetRestaurant";
import { useGetDishes } from "../hooks/restaurant/useGetDishes";
import { useCart } from "../context/CartContext";
import RestaurantInfoHeader from "./RestaurantInfoHeader";

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { dispatch } = useCart();

  const { restaurant, isLoading: isRestLoading } = useGetRestaurant(id);
  const { dishes, isLoading: isDishesLoading } = useGetDishes(id);

  if (isRestLoading || isDishesLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  if (!restaurant) {
    return <Typography color="error" align="center" mt={5}>Nie znaleziono restauracji.</Typography>;
  }

  const handleAddToCart = (dish: any) => {
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { id: dish.id, name: dish.name, price: dish.price, quantity: 1 } 
    });
    enqueueSnackbar(`Dodano ${dish.name} do koszyka!`, { variant: "success" });
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/restaurants')}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Wróć do listy
      </Button>

      <RestaurantInfoHeader restaurant={restaurant} />

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Menu</Typography>
      <Divider sx={{ mb: 3 }} />

      {dishes.length === 0 ? (
        <Typography color="text.secondary">Ta restauracja nie ma jeszcze dań w menu.</Typography>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
          gap: 3 
        }}>
          {dishes.map((dish) => (
            <Card key={dish.id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, boxShadow: 1 }}>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{dish.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2, minHeight: 40 }}>
                  {dish.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                  {dish.price.toFixed(2)} zł
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
                <IconButton 
                  color="primary" 
                  size="large" 
                  onClick={() => handleAddToCart(dish)}
                  sx={{ bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' } }}
                >
                  <AddShoppingCartIcon />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}