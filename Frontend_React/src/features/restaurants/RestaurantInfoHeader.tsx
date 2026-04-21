import { Box, Typography } from "@mui/material";
import type { GetRestaurantResponseDto } from "./types/restaurantDtos";

interface Props {
  restaurant: GetRestaurantResponseDto;
}

export default function RestaurantInfoHeader({ restaurant }: Props) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h3" sx={{ fontWeight: 800 }}>{restaurant.name}</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>{restaurant.descrition}</Typography>
      <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>📞 {restaurant.phoneNumber}</Typography>
    </Box>
  );
}