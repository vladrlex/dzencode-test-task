import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOrders, removeOrderServer, addOrderServer } from '../../store/ordersSlice';
import { fetchProducts, type Product } from '../../store/productsSlice';
import { formatDateNumeric, formatDateFull } from '../../utils/dateFormatter';
import OrderForm from '../../components/OrderForm/OrderForm';
import OrderDetail from '../../components/OrderDetail/OrderDetail';
import DeleteOrderModal from '../../components/DeleteOrderModal/DeleteOrderModal';
import Modal from '../../components/Modal/Modal';
import AddProductForm from '../../components/AddProductForm/AddProductForm';
import './Orders.css';

export default function Orders() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.items);
  const products = useAppSelector((state) => state.products.items);
  const loading = useAppSelector((state) => state.orders.loading || state.products.loading);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

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
        if (selectedOrderId === deleteTargetId) setSelectedOrderId(null);
        setDeleteTargetId(null);
      }
    }
  };

  const handleCloseProductModal = () => {
    setIsProductFormOpen(false);
    setProductToEdit(null);
  };

  if (loading) return <div className="orders__loading">Loading data...</div>;

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const selectedOrderProducts = products.filter((p) => p.order === selectedOrderId);

  return (
    <div className="orders">
      <div className="orders__header">
        <h2 className="orders__title">Orders / {orders.length}</h2>
        <button className="orders__add-btn" onClick={() => setIsFormOpen(!isFormOpen)}>
          {isFormOpen ? 'Cancel' : '+ Add Order'}
        </button>
      </div>

      {isFormOpen && (
        <Modal title="Add New Order" onClose={() => setIsFormOpen(false)}>
          <OrderForm onSubmit={handleAddOrder} />
        </Modal>
      )}

      <div className="orders__content">
        <div className={`orders__list ${selectedOrderId ? 'orders__list--shrink' : ''}`}>
          {orders.map((order) => {
            const orderProducts = products.filter((p) => p.order === order.id);
            const count = orderProducts.length;
            const usd = orderProducts.reduce((sum, p) => sum + (p.price.find((pr) => pr.symbol === 'USD')?.value || 0), 0);
            const uah = orderProducts.reduce((sum, p) => sum + (p.price.find((pr) => pr.symbol === 'UAH')?.value || 0), 0);

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={`order-card ${selectedOrderId === order.id ? 'order-card--active' : ''}`}
              >
                <div className="order-card__icon">📋</div>
                <div className="order-card__title">{order.title}</div>
                <div className="order-card__products">
                  <div>{count}</div>
                  <div style={{ fontSize: '10px', color: '#999' }}>Products</div>
                </div>
                <div className="order-card__date">
                  <div>{formatDateNumeric(order.date)}</div>
                  <div style={{ fontWeight: 'bold' }}>{formatDateFull(order.date)}</div>
                </div>
                <div className="order-card__price">
                  <div>{usd} $</div>
                  <div style={{ fontSize: '11px', color: '#999' }}>{uah} UAH</div>
                </div>
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
          <div className="order-detail">
            <div className="order-detail__actions">
              <button 
                className="btn-add-product" 
                onClick={() => {
                  setProductToEdit(null);
                  setIsProductFormOpen(true);
                }}
              >
                + Add Product
              </button>
            </div>
            
            <OrderDetail
              orderTitle={selectedOrder.title}
              products={selectedOrderProducts}
              onClose={() => setSelectedOrderId(null)}
              onEditProduct={(product) => {
                setProductToEdit(product);
                setIsProductFormOpen(true);
              }}
            />
          </div>
        )}
      </div>

      {isProductFormOpen && selectedOrderId && (
        <Modal title={productToEdit ? "Edit Product" : "Add New Product"} onClose={handleCloseProductModal}>
          <AddProductForm 
            orderId={selectedOrderId} 
            onClose={handleCloseProductModal} 
            productToEdit={productToEdit}
          />
        </Modal>
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