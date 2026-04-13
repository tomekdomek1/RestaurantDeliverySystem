// Frontend_React/src/context/CartContext.tsx
import React, { createContext, useReducer, useContext } from 'react';
import type { CartAction, CartState } from '../types/cart';
import type { PropsWithChildren } from 'react';

const initialState: CartState = {
  items: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, newItem],
        };
      }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
          .filter(item => item.quantity > 0),
      };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined) as React.Context<CartContextType>;
export const CartProvider: React.FC<PropsWithChildren<{}>> = ({ children }): React.ReactElement => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const totalPrice = state.items.reduce(function(acc, item) {
    return acc + item.price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};