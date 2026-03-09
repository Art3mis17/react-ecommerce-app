import { createContext, useReducer, useContext } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../models/types';

// ---------- Action types ----------
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number }
  | { type: 'CLEAR_CART' };

// ---------- Reducer ----------
const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.payload);
    case 'INCREMENT':
      return state.map((item) =>
        item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
      );
    case 'DECREMENT':
      return state
        .map((item) =>
          item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

// ---------- Context type ----------
interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product: Product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeFromCart = (id: number) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const increment = (id: number) => dispatch({ type: 'INCREMENT', payload: id });
  const decrement = (id: number) => dispatch({ type: 'DECREMENT', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider
      value={{ cartItems, totalItems, totalPrice, addToCart, removeFromCart, increment, decrement, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for convenient access to cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartContextProvider');
  }
  return context;
};
