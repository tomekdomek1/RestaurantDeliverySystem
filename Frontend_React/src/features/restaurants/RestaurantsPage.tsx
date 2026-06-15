import { useState } from 'react';
import { Box, Typography, CircularProgress, Chip } from "@mui/material";
import { useGetRestaurants } from "./hooks/useGetRestaurants";
import RestaurantCard from "./RestaurantCard";
import type { RestaurantCategory } from "./types/restaurantDtos";

// Lista dostępnych kategorii do wyświetlenia na przyciskach
const CATEGORIES: { id: RestaurantCategory | '', label: string }[] = [
  { id: '', label: 'Wszystkie' },
  { id: 'Pizza', label: 'Pizza' },
  { id: 'Burgers', label: 'Burgery' },
  { id: 'Sushi', label: 'Sushi' },
  { id: 'Kebab', label: 'Kebab' },
  { id: 'Asian', label: 'Azjatyckie' },
  { id: 'Italian', label: 'Włoskie' },
  { id: 'Polish', label: 'Polskie' },
  { id: 'Vegan', label: 'Wegańskie' },
];

export default function RestaurantsPage() {
  const [selectedCategory, setSelectedCategory] = useState<RestaurantCategory | ''>('');
  const { restaurants, isLoading, error } = useGetRestaurants(selectedCategory);

  if (error) return <Typography color="error" align="center" mt={5}>Wystąpił błąd: {error.message}</Typography>;

  return (
    <Box sx={{ pt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#1976d2', mb: 1 }}>
        Wybierz restaurację
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Zamów ulubione jedzenie z dostawą pod same drzwi.
      </Typography>

      {/* Pasek Filtrów Kategorii */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1.5, 
        overflowX: 'auto', 
        pb: 2, 
        mb: 3,
        // Chowa pasek przewijania (scroll) dla elegancji na małych ekranach
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none'
      }}>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.label}
            clickable
            onClick={() => setSelectedCategory(cat.id)}
            color={selectedCategory === cat.id ? "primary" : "default"}
            variant={selectedCategory === cat.id ? "filled" : "outlined"}
            sx={{ 
                fontWeight: selectedCategory === cat.id ? 'bold' : 'normal',
                px: 1,
                py: 2.5,
                borderRadius: '16px',
                fontSize: '1rem'
            }}
          />
        ))}
      </Box>

      {/* Ładowanie i Lista Restauracji */}
      {isLoading ? (
         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, 
          gap: 4 
        }}>
          {restaurants.length === 0 ? (
            <Typography variant="h6" color="text.secondary" sx={{ gridColumn: '1 / -1', textAlign: 'center', mt: 4 }}>
              Brak restauracji w wybranej kategorii.
            </Typography>
          ) : (
            restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          )}
        </Box>
      )}
    </Box>
  );
}