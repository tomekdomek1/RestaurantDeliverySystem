import React from 'react';
import { useCart } from '../cart/context/CartContext';
import type { CartItem } from '../cart/types/cart';
import { Card, CardContent, Typography, Button} from '@mui/material';

interface ProductProps {
  id: number;
  name: string;
  price: number;
}

const TestProduct: React.FC<ProductProps> = ({ id, name, price }): React.ReactElement => {
  const { dispatch } = useCart();
  
  const handleAddToCart = function() {
    const item: CartItem = { id, name, price, quantity: 1 };
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: item
    });
  };

  return (
    <Card sx={{ width: 250, m: 1, display: 'inline-block' }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" component="div">
          {name}
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ my: 1 }}>
          {price.toFixed(2)} zł
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAddToCart} 
          fullWidth
        >
          Dodaj do koszyka
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestProduct;