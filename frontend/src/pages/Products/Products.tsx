import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts } from '../../store/productsSlice';
import { fetchOrders } from '../../store/ordersSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';

export default function Products() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const orders = useAppSelector((state) => state.orders.items);
  const loading = useAppSelector((state) => state.products.loading || state.orders.loading);

  const [selectedType, setSelectedType] = useState<string>('All');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="lazy-fallback-container">
        <div className="lazy-spinner"></div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="products__empty">
        <h3 className="products__empty-title">No products found</h3>
        <p className="products__empty-text">The products list is currently empty.</p>
      </div>
    );
  }

  const productTypes = ['All', ...new Set(products.map((p) => p.type))];

  const filteredProducts = selectedType === 'All'
    ? products
    : products.filter((p) => p.type === selectedType);

  return (
    <div className="products">
      <div className="products__header">
        <h2 className="products__title">Products / {filteredProducts.length}</h2>

        <div className="products__filter">
          <span className="products__filter-label">Filter by type:</span>
          <select
            className="products__filter-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {productTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="products__list">
        {filteredProducts.map((product) => {
          const parentOrder = orders.find((o) => o.id === product.order);
          const orderTitle = parentOrder ? parentOrder.title : 'Unknown Order';

          return (
            <ProductCard
              key={product.id}
              product={product}
              orderTitle={orderTitle}
            />
          );
        })}
      </div>
    </div>
  );
}