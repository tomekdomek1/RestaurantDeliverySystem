import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableHead, TableRow, Typography, Box, Button, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, CircularProgress 
} from '@mui/material';
import { useGetDishes } from '../hooks/restaurant/useGetDishes';

export default function AdminMenuPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  
  const { dishes, isLoading, error, refreshDishes } = useGetDishes(restaurantId);

  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      setFormError('Nazwa oraz cena są wymagane.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      const response = await fetch('/api/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          restaurantId 
        })
      });

      if (!response.ok) throw new Error('Nie udało się zapisać dania.');

      setName('');
      setDescription('');
      setPrice('');
      setOpenModal(false);
      refreshDishes(); 
    } catch (err) {
      setFormError('Wystąpił błąd podczas komunikacji z serwerem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

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
          onClick={() => setOpenModal(true)}
          sx={{ bgcolor: '#0b1437', '&:hover': { bgcolor: '#1b254b' }, borderRadius: '12px', px: 4 }}
        >
          + Nowe Danie
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>Nie udało się załadować listy dań.</Alert>}

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
          {dishes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'text.secondary', py: 3 }}>
                Brak dań w menu. Dodaj swoje pierwsze danie!
              </TableCell>
            </TableRow>
          ) : (
            dishes.map((dish) => (
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
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={openModal} onClose={() => !isSubmitting && setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#0b1437' }}>Dodaj nowe danie</DialogTitle>
        <form onSubmit={handleCreateDish}>
          <DialogContent dividers>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <TextField
              margin="normal"
              label="Nazwa dania"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              margin="normal"
              label="Opis dania"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              margin="normal"
              label="Cena (zł)"
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              fullWidth
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isSubmitting}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenModal(false)} color="inherit" disabled={isSubmitting}>
              Anuluj
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting}
              sx={{ bgcolor: '#0b1437', '&:hover': { bgcolor: '#1b254b' } }}
            >
              {isSubmitting ? 'Zapisywanie...' : 'Dodaj danie'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}