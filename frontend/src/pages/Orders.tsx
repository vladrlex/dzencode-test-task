import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders, removeOrderServer, addOrderServer } from '../store/ordersSlice';
import { fetchProducts } from '../store/productsSlice';
import { formatDateNumeric, formatDateFull } from '../utils/dateFormatter';

import OrderForm from '../components/OrderForm';
import OrderDetail from '../components/OrderDetail';
import DeleteOrderModal from '../components/DeleteOrderModal';

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

  if (loading) return <div style={{ padding: '20px', color: '#666' }}>Loading data...</div>;

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const selectedOrderProducts = products.filter((p) => p.order === selectedOrderId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#333', margin: 0 }}>Orders / {orders.length}</h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#689f38',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          {isFormOpen ? 'Cancel' : '+ Add Order'}
        </button>
      </div>

      {isFormOpen && <OrderForm onSubmit={handleAddOrder} />}

      {orders.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#666', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>No orders found</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>The server returned an empty list or is currently offline.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ flex: selectedOrderId ? '0 0 450px' : '1', display: 'flex', flexDirection: 'column', gap: '15px', transition: 'all 0.3s ease' }}>
            {orders.map((order) => {
              const orderProducts = products.filter((p) => p.order === order.id);
              const orderProductsCount = orderProducts.length;
              const totalUSD = orderProducts.reduce((sum, p) => sum + (p.price.find((pr) => pr.symbol === 'USD')?.value || 0), 0);
              const totalUAH = orderProducts.reduce((sum, p) => sum + (p.price.find((pr) => pr.symbol === 'UAH')?.value || 0), 0);

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px 20px',
                    backgroundColor: '#fff',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    border: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    position: 'relative',
                    borderColor: selectedOrderId === order.id ? '#689f38' : '#e0e0e0',
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#333', minWidth: '100px' }}>{order.title}</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px', color: '#999' }}>📋</span>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>{orderProductsCount}</div>
                      <div style={{ color: '#999', fontSize: '12px' }}>Products</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}>
                    <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '2px' }}>
                      {formatDateNumeric(order.date)}
                    </div>
                    <div style={{ color: '#555', fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>
                      {formatDateFull(order.date)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <div style={{ fontSize: '12px', color: '#999' }}>{totalUSD} $</div>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>{totalUAH} UAH</div>
                  </div>

                  {selectedOrderId === order.id && (
                    <div style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', width: '0', height: '0', borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '10px solid #689f38' }} />
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTargetId(order.id);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#ef5350', padding: '5px' }}
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