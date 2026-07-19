import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config/config';
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
  supplier: string | null;
  guarantee: Guarantee;
  price: Price[];
  order: number;
  orderTitle?: string;
  date: string;
}

export interface ProductsQuery {
  search?: string;
  page?: number;
  limit?: number;
  order?: number;
  type?: string;
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  types: string[];
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  limit: 30,
  total: 0,
  totalPages: 1,
  types: [],
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (query: ProductsQuery = {}) => {
  const response = await axios.get(`${API_URL}/api/products`, {
    params: {
      ...(query.search ? { search: query.search } : {}),
      ...(query.order ? { order: query.order } : {}),
      ...(query.type && query.type !== 'All' ? { type: query.type } : {}),
      page: query.page ?? 1,
      limit: query.limit ?? 30,
    },
  });
  return response.data;
});

export const fetchProductTypes = createAsyncThunk('products/fetchProductTypes', async () => {
  const response = await axios.get(`${API_URL}/api/products/meta/types`);
  return response.data as string[];
});

export const addProductServer = createAsyncThunk(
  'products/addProductServer',
  async (product: Omit<Product, 'id'>) => {
    const response = await axios.post(`${API_URL}/api/products`, product);
    return response.data;
  }
);

export const removeProductServer = createAsyncThunk(
  'products/removeProductServer',
  async (id: number) => {
    await axios.delete(`${API_URL}/api/products/${id}`);
    return id;
  }
);

export const updateProductServer = createAsyncThunk(
  'products/updateProductServer',
  async (product: Product) => {
    const response = await axios.put(`${API_URL}/api/products/${product.id}`, product);
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
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(addProductServer.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeProductServer.fulfilled, (state, action) => {
        state.items = state.items.filter((product) => product.id !== action.payload);
      })
      .addCase(updateProductServer.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteOrder, (state, action) => {
        state.items = state.items.filter((product) => product.order !== action.payload);
      })
      .addCase(fetchProductTypes.fulfilled, (state, action) => {
        state.types = action.payload;
      });
  },
});

export default productsSlice.reducer;