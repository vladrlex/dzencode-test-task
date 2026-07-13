import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders } from '../store/ordersSlice';

export default function Orders() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <div style={{ padding: '20px' }}>Loading orders...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Orders ({items.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {items.map((order) => (
          <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>{order.title}</div>
              <div style={{ color: '#777', fontSize: '14px', marginTop: '5px' }}>{order.description}</div>
            </div>
            <div style={{ color: '#689f38', fontWeight: 'bold' }}>
              {new Date(order.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}