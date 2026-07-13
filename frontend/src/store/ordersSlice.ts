import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Order {
  id: number;
  title: string;
  date: string;
  description: string;
}

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await axios.get('http://localhost:5000/api/orders');
  return response.data;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    deleteOrder: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  },
});

export const { deleteOrder } = ordersSlice.actions;
export default ordersSlice.reducer;