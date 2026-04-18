import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Link } from "react-router-dom";
import type { GetRestaurantResponseDto } from "../types/restaurantDtos";

interface Props {
  restaurant: GetRestaurantResponseDto;
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <Card 
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
  );
}