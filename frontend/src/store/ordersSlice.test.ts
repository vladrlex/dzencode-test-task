import { describe, it, expect } from 'vitest';
import reducer, { fetchOrders, removeOrderServer, addOrderServer, type Order } from './ordersSlice';

const baseState = {
  items: [] as Order[],
  loading: false,
  error: null as string | null,
  page: 1,
  limit: 30,
  total: 0,
  totalPages: 1,
};

const makeOrder = (overrides: Partial<Order> = {}): Order => ({
  id: 1,
  title: 'Test order',
  date: '2024-03-05',
  description: 'desc',
  productsCount: 2,
  totalUsd: 100,
  totalUah: 4000,
  ...overrides,
});

describe('ordersSlice', () => {
  it('sets loading to true on fetchOrders.pending', () => {
    const state = reducer(baseState, fetchOrders.pending('requestId', {}));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('populates items and pagination fields on fetchOrders.fulfilled', () => {
    const payload = {
      items: [makeOrder()],
      page: 2,
      limit: 10,
      total: 25,
      totalPages: 3,
    };
    const state = reducer(
      { ...baseState, loading: true },
      fetchOrders.fulfilled(payload, 'requestId', {})
    );

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(payload.items);
    expect(state.page).toBe(2);
    expect(state.limit).toBe(10);
    expect(state.total).toBe(25);
    expect(state.totalPages).toBe(3);
  });

  it('records the error message on fetchOrders.rejected', () => {
    const action = fetchOrders.rejected(new Error('Network error'), 'requestId', {});
    const state = reducer({ ...baseState, loading: true }, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('optimistically removes the order on removeOrderServer.pending', () => {
    const state = reducer(
      { ...baseState, items: [makeOrder({ id: 1 }), makeOrder({ id: 2 })] },
      removeOrderServer.pending('requestId', 1)
    );
    expect(state.items.map((o) => o.id)).toEqual([2]);
  });

  it('appends the created order on addOrderServer.fulfilled', () => {
    const newOrder = makeOrder({ id: 99, title: 'New order' });
    const state = reducer(
      baseState,
      addOrderServer.fulfilled(newOrder, 'requestId', { title: 'New order', description: 'desc' })
    );
    expect(state.items).toContainEqual(newOrder);
  });
});
