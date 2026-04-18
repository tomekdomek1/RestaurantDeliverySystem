import { Box, Typography, Card, CardContent, Button, Divider, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { CartItem } from "../types/cart";

interface Props {
  items: CartItem[];
  totalPrice: number;
  handlePlaceOrder: () => void;
  isOrdering: boolean;
}

export default function CheckoutOrderSummary({ items, totalPrice, handlePlaceOrder, isOrdering }: Props) {
  return (
    <Box>
      <Card sx={{ bgcolor: '#fafafa', border: '1px solid #e0e0e0', boxShadow: 0 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Podsumowanie</Typography>
          {items.map(item => (
            <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{item.quantity}x {item.name}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{(item.price * item.quantity).toFixed(2)} zł</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Do zapłaty:</Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>{totalPrice.toFixed(2)} zł</Typography>
          </Box>
          <Button 
            variant="contained" color="success" fullWidth size="large" onClick={handlePlaceOrder} disabled={isOrdering}
            startIcon={isOrdering ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlineIcon />}
          >
            {isOrdering ? "Przetwarzanie..." : "Zamawiam i płacę"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}