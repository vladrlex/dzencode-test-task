import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOrders, removeOrderServer, addOrderServer } from '../../store/ordersSlice';
import { fetchProducts } from '../../store/productsSlice';
import { formatDateNumeric, formatDateFull } from '../../utils/dateFormatter';

import OrderForm from '../../components/OrderForm/OrderForm';
import OrderDetail from '../../components/OrderDetail/OrderDetail';
import DeleteOrderModal from '../../components/DeleteOrderModal/DeleteOrderModal';
import './Orders.css';

export default function Orders() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.items);
  const products = useAppSelector((state) => state.products.items);
  const loading = useAppSelector((state) => state.orders.loading || state.products.loading);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddOrder = async (title: string, description: string) => {
    try {
      await dispatch(addOrderServer({ title, description })).unwrap();
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      try {
        await dispatch(removeOrderServer(deleteTargetId)).unwrap();
      } catch (error) {
        console.error(error);
      } finally {
        if (selectedOrderId === deleteTargetId) {
          setSelectedOrderId(null);
        }
        setDeleteTargetId(null);
      }
    }
  };

  if (loading) return <div className="orders__loading">Loading data...</div>;

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const selectedOrderProducts = products.filter((p) => p.order === selectedOrderId);

  return (
    <div className="orders">
      <div className="orders__header">
        <h2 className="orders__title">Orders / {orders.length}</h2>
        <button
          className="orders__add-btn"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? 'Cancel' : '+ Add Order'}
        </button>
      </div>

      {isFormOpen && <OrderForm onSubmit={handleAddOrder} />}

      {orders.length === 0 ? (
        <div className="orders__empty">
          <h3 className="orders__empty-title">No orders found</h3>
          <p className="orders__empty-text">The server returned an empty list or is currently offline.</p>
        </div>
      ) : (
        <div className="orders__content">
          <div className={`orders__list ${selectedOrderId ? 'orders__list--shrink' : ''}`}>
            {orders.map((order) => {
              const orderProducts = products.filter((p) => p.order === order.id);
              const orderProductsCount = orderProducts.length;
              const totalUSD = orderProducts.reduce((sum, p) => sum + (p.price.find((pr) => pr.symbol === 'USD')?.value || 0), 0);
              const totalUAH = orderProducts.reduce((sum, p) => sum + (p.price.find((pr) => pr.symbol === 'UAH')?.value || 0), 0);

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`order-card ${selectedOrderId === order.id ? 'order-card--active' : ''}`}
                >
                  <div className="order-card__main">
                    <div className="order-card__title">{order.title}</div>
                  </div>
                  
                  <div className="order-card__products">
                    <span className="order-card__products-icon">📋</span>
                    <div>
                      <div className="order-card__products-count">{orderProductsCount}</div>
                      <div className="order-card__products-label">Products</div>
                    </div>
                  </div>

                  <div className="order-card__date">
                    <div className="order-card__date-numeric">{formatDateNumeric(order.date)}</div>
                    <div className="order-card__date-full">{formatDateFull(order.date)}</div>
                  </div>

                  <div className="order-card__price">
                    <div className="order-card__price-usd">{totalUSD} $</div>
                    <div className="order-card__price-uah">{totalUAH} UAH</div>
                  </div>

                  {selectedOrderId === order.id && <div className="order-card__arrow" />}

                  <button
                    className="order-card__delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTargetId(order.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>

          {selectedOrderId && selectedOrder && (
            <OrderDetail
              orderTitle={selectedOrder.title}
              products={selectedOrderProducts}
              onClose={() => setSelectedOrderId(null)}
            />
          )}
        </div>
      )}

      {deleteTargetId && (
        <DeleteOrderModal
          onClose={() => setDeleteTargetId(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}