import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Box, Button, Chip } from '@mui/material';
import type { Dish } from '../types/dish';

export default function AdminMenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);

  useEffect(() => {
    fetch('/api/dishes')
      .then(res => res.json())
      .then(data => setDishes(data))
      .catch(() => console.error('Failed to fetch dishes. Ensure json-server is running.'));
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="800" color="#0b1437">
            Zarządzanie Menu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Zarządzaj ofertą swojej restauracji w czasie rzeczywistym.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ bgcolor: '#0b1437', borderRadius: '12px', px: 4 }}
        >
          + Nowe Danie
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f4f7fe' }}>
            <TableCell sx={{ fontWeight: 'bold', borderRadius: '12px 0 0 12px' }}>Danie</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Opis</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Cena</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', borderRadius: '0 12px 12px 0' }}>Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dishes.map((dish) => (
            <TableRow key={dish.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
              <TableCell sx={{ fontWeight: 'bold' }}>{dish.name}</TableCell>
              <TableCell sx={{ color: 'text.secondary', maxWidth: 400 }}>{dish.description}</TableCell>
              <TableCell>
                <Chip 
                  label={`${dish.price.toFixed(2)} zł`} 
                  sx={{ fontWeight: 'bold', bgcolor: '#e8f5e9', color: '#2e7d32' }} 
                />
              </TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <Button size="small" variant="text" sx={{ mr: 1 }}>Edytuj</Button>
                <Button size="small" variant="text" color="error">Usuń</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}