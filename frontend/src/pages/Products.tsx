import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/productsSlice';

export default function Products() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div style={{ padding: '20px' }}>Loading products...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Products ({items.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {items.map((product) => {
          const defaultPrice = product.price.find((p) => p.isDefault === 1) || product.price[0];
          
          return (
            <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#e0e0e0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#777', fontSize: '12px' }}>
                  Photo
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>{product.title}</div>
                  <div style={{ color: '#777', fontSize: '14px', marginTop: '4px' }}>SN: {product.serialNumber} | Type: {product.type}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>{defaultPrice.value} {defaultPrice.symbol}</div>
                <div style={{ color: '#777', fontSize: '12px', marginTop: '4px' }}>Order Ref: {product.order}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}