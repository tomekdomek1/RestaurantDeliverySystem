import { Box, Typography, CircularProgress } from "@mui/material";
import { useGetRestaurants } from "../hooks/restaurant/useGetRestaurants";
import RestaurantCard from "./RestaurantCard";

export default function RestaurantsPage() {
  const { restaurants, isLoading, error } = useGetRestaurants();

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={5}>Wystąpił błąd: {error.message}</Typography>;

  return (
    <Box sx={{ pt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#1976d2', mb: 1 }}>
        Wybierz restaurację
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Zamów ulubione jedzenie z dostawą pod same drzwi.
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, 
        gap: 4 
      }}>
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </Box>
    </Box>
  );
}