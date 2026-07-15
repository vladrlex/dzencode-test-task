import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { deleteOrder } from './ordersSlice';

export interface Price {
  value: number;
  symbol: string;
  isDefault: number;
}

export interface Guarantee {
  start: string;
  end: string;
}

export interface Product {
  id: number;
  serialNumber: number;
  isNew: number;
  photo: string;
  title: string;
  type: string;
  specification: string;
  guarantee: Guarantee;
  price: Price[];
  order: number;
  date: string;
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get('http://localhost:5000/api/products');
  return response.data;
});

export const addProductServer = createAsyncThunk(
  'products/addProductServer',
  async (product: Omit<Product, 'id'>) => {
    const response = await axios.post('http://localhost:5000/api/products', product);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(addProductServer.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteOrder, (state, action) => {
        state.items = state.items.filter((product) => product.order !== action.payload);
      });
  },
});

export default productsSlice.reducer;