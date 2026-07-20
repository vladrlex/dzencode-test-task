import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config/config';

export interface Order {
  id: number;
  title: string;
  date: string;
  description: string;
  productsCount: number;
  totalUsd: number;
  totalUah: number;
}

export interface OrdersQuery {
  search?: string;
  page?: number;
  limit?: number;
}

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  limit: 30,
  total: 0,
  totalPages: 1,
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (query: OrdersQuery = {}) => {
  const response = await axios.get(`${API_URL}/api/orders`, {
    params: {
      ...(query.search ? { search: query.search } : {}),
      page: query.page ?? 1,
      limit: query.limit ?? 30,
    },
  });
  return response.data;
});

export const removeOrderServer = createAsyncThunk('orders/removeOrderServer', async (id: number) => {
  await axios.delete(`${API_URL}/api/orders/${id}`);
  return id;
});

export const addOrderServer = createAsyncThunk(
  'orders/addOrderServer',
  async (payload: { title: string; description: string }) => {
    const response = await axios.post(`${API_URL}/api/orders`, payload);
    return response.data;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(removeOrderServer.pending, (state, action) => {
        const deletedId = action.meta.arg;
        state.items = state.items.filter((item) => item.id !== deletedId);
      })
      .addCase(removeOrderServer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeOrderServer.rejected, (state, action) => {
        state.loading = false;
        console.error('Server failed to delete:', action.error.message);
      })
      .addCase(addOrderServer.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default ordersSlice.reducer;