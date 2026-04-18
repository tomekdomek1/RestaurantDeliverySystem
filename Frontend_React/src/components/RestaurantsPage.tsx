import { Box, Typography, Card, CardContent, CircularProgress, Button } from "@mui/material";
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useGetRestaurants } from "../hooks/restaurant/useGetRestaurants";
import { Link } from "react-router-dom";

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
          <Card 
            key={restaurant.id}
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
            }}
          >
            <Box sx={{ bgcolor: '#e3f2fd', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StorefrontIcon sx={{ fontSize: 60, color: '#90caf9' }} />
            </Box>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {restaurant.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
                {restaurant.descrition}
              </Typography>
              <Button 
                component={Link} 
                to={`/restaurants/${restaurant.id}`} 
                variant="contained" 
                color="primary" 
                fullWidth
                disableElevation
              >
                Zobacz Menu
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}