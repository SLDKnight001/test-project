import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slices/authSlice';
import productsSlice from '../slices/productsSlice';
import cartSlice from '../slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productsSlice,
    cart: cartSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;