import { describe, it, expect } from 'vitest';
import reducer, { removeProductServer, type Product } from './productsSlice';
import { removeOrderServer } from './ordersSlice';

const baseState = {
  items: [] as Product[],
  loading: false,
  error: null as string | null,
  page: 1,
  limit: 30,
  total: 0,
  totalPages: 1,
  types: [] as string[],
};

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  serialNumber: 12345,
  isNew: 1,
  photo: '',
  title: 'Test product',
  type: 'Monitors',
  specification: 'Standard',
  supplier: null,
  guarantee: { start: '2024-01-01', end: '2026-01-01' },
  price: [],
  order: 1,
  date: '2024-03-05',
  ...overrides,
});

describe('productsSlice', () => {
  it('removes the deleted product on removeProductServer.fulfilled', () => {
    const state = reducer(
      { ...baseState, items: [makeProduct({ id: 1 }), makeProduct({ id: 2 })] },
      removeProductServer.fulfilled(1, 'requestId', 1)
    );
    expect(state.items.map((p) => p.id)).toEqual([2]);
  });

  it('drops products belonging to a deleted order on removeOrderServer.fulfilled', () => {
    // This is the exact action Orders.tsx actually dispatches to delete an order —
    // products must be cleaned up from here, not from a separate unused action.
    const state = reducer(
      {
        ...baseState,
        items: [
          makeProduct({ id: 1, order: 10 }),
          makeProduct({ id: 2, order: 20 }),
          makeProduct({ id: 3, order: 10 }),
        ],
      },
      removeOrderServer.fulfilled(10, 'requestId', 10)
    );
    expect(state.items.map((p) => p.id)).toEqual([2]);
  });
});
