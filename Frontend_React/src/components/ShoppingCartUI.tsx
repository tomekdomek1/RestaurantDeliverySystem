import React from 'react';
import { useCart } from '../context/CartContext'; 
import { 
    Container, 
    Typography, 
    Button, 
    Box, 
    Grid, 
    IconButton, 
    TextField,
    Divider
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const COL_WIDTHS = {
    PRODUCT: '35%',
    PRICE: '120px',
    QUANTITY: '180px',
    SUM: '120px',
    REMOVE: '50px'
};
const CELL_PADDING = 1.5; 
const ShoppingCartUI: React.FC = () => {
  const { state, dispatch, totalPrice } = useCart();
  const { items } = state;

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) {
        dispatch({ type: 'REMOVE_ITEM', payload: { id } });
        return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="h4" gutterBottom>Twój koszyk jest pusty 🛒</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>Dodaj produkty, aby rozpocząć zakupy!</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, p: 3, border: "1px solid #ccc", borderRadius: "8px" }}>
      <Typography variant="h4" gutterBottom>Twój koszyk</Typography>

      <Grid container sx={{ fontWeight: 'bold', pb: 1, borderBottom: '1px solid #eee' }}>
        <Box sx={{ width: COL_WIDTHS.PRODUCT, px: CELL_PADDING }}><Typography variant="subtitle1" fontWeight="bold">Produkt</Typography></Box> 
        <Box sx={{ width: COL_WIDTHS.PRICE, px: CELL_PADDING, textAlign: 'right' }}><Typography variant="subtitle1" fontWeight="bold">Cena</Typography></Box> 
        <Box sx={{ width: COL_WIDTHS.QUANTITY, px: CELL_PADDING, textAlign: 'center' }}><Typography variant="subtitle1" fontWeight="bold">Ilość</Typography></Box> 
        <Box sx={{ width: COL_WIDTHS.SUM, px: CELL_PADDING, textAlign: 'right' }}><Typography variant="subtitle1" fontWeight="bold">Suma</Typography></Box> 
        <Box sx={{ width: COL_WIDTHS.REMOVE, px: CELL_PADDING }}></Box> 
      </Grid>

      {items.map((item) => (
        <Grid 
          container 
          key={item.id} 
          alignItems="center" 
          sx={{ py: 1.5, borderBottom: '1px dotted #ddd' }}
        >
          <Box sx={{ width: COL_WIDTHS.PRODUCT, px: CELL_PADDING }}><Typography variant="body1">{item.name}</Typography></Box> 

          <Box sx={{ width: COL_WIDTHS.PRICE, px: CELL_PADDING, textAlign: 'right' }}><Typography variant="body1">{item.price.toFixed(2)} zł</Typography></Box> 

          <Box sx={{ width: COL_WIDTHS.QUANTITY, px: CELL_PADDING, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <IconButton 
              size="small"
              onClick={() => handleQuantityChange(item.id, item.quantity - 1)} 
            >
                <RemoveIcon fontSize="small" />
            </IconButton>
            <TextField
                variant="outlined"
                size="small"
                type="number" 
                value={item.quantity} 
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                inputProps={{ min: "1", style: { textAlign: 'center', padding: 8 } }}
                sx={{ width: '85px', mx: 1 }} 
            />
            <IconButton 
              size="small"
              onClick={() => handleQuantityChange(item.id, item.quantity + 1)} 
            >
                <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ width: COL_WIDTHS.SUM, px: CELL_PADDING, textAlign: 'right' }}> 
            <Typography variant="body1" fontWeight="bold">
              {(item.price * item.quantity).toFixed(2)} zł
            </Typography>
          </Box>

          <Box sx={{ width: COL_WIDTHS.REMOVE, px: CELL_PADDING, textAlign: 'right' }}>
            <IconButton 
                color="error"
                size="small"
                onClick={() => handleRemoveItem(item.id)} 
            >
                <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Grid>
      ))}

      <Divider sx={{ mt: 3 }} />
      <Box sx={{ mt: 2, textAlign: 'right', pt: 2 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>Suma całkowita: {totalPrice.toFixed(2)} zł</Typography>
        <Button 
          variant="contained" 
          color="success"
          size="large"
        >
          Przejdź do kasy
        </Button>
      </Box>
    </Container>
  );
};

export default ShoppingCartUI;