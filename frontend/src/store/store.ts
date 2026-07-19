import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import ordersReducer from './ordersSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;