import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/productsSlice';

export default function Products() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const loading = useAppSelector((state) => state.products.loading);
  
  const [selectedType, setSelectedType] = useState<string>('All');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div style={{ padding: '20px', color: '#666' }}>Loading products...</div>;

  // Безпечна перевірка: якщо продуктів немає взагалі
  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', color: '#666', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>No products found</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>The products list is currently empty.</p>
      </div>
    );
  }

  // Тепер .map() ніколи не зламає додаток
  const productTypes = ['All', ...new Set(products.map((p) => p.type))];

  const filteredProducts = selectedType === 'All' 
    ? products 
    : products.filter((p) => p.type === selectedType);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#333', margin: 0 }}>Products / {filteredProducts.length}</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>Filter by type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {productTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredProducts.map((product) => {
          const uahPrice = product.price?.find((p) => p.symbol === 'UAH')?.value;
          const usdPrice = product.price?.find((p) => p.symbol === 'USD')?.value;

          return (
            <div
              key={product.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px 20px',
                backgroundColor: '#fff',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 2 }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#e5e4e7',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#6b6375',
                  fontWeight: 'bold'
                }}>
                  Photo
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>{product.title}</div>
                  <div style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>
                    SN: {product.serialNumber} | <span style={{ color: '#689f38', fontWeight: '500' }}>{product.type}</span>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, textAlign: 'center', fontSize: '14px', color: product.isNew ? '#689f38' : '#666' }}>
                {product.isNew ? 'New' : 'Used'}
              </div>

              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#999' }}>{usdPrice} $</div>
                <div style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>{uahPrice} UAH</div>
              </div>

              <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: '#888' }}>
                Order Ref: {product.order}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}