import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/productsSlice';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const loading = useAppSelector((state) => state.products.loading);
  
  const [selectedType, setSelectedType] = useState<string>('All');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div style={{ padding: '20px', color: '#666' }}>Loading products...</div>;

  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', color: '#666', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>No products found</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>The products list is currently empty.</p>
      </div>
    );
  }

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
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}