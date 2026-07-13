import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders, removeOrderServer, addOrderServer } from '../store/ordersSlice';
import { fetchProducts } from '../store/productsSlice';

export default function Orders() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.items);
  const products = useAppSelector((state) => state.products.items);
  const loading = useAppSelector((state) => state.orders.loading || state.products.loading);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await dispatch(addOrderServer({ title: newTitle, description: newDesc })).unwrap();
      setNewTitle('');
      setNewDesc('');
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
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

      {isFormOpen && (
        <form onSubmit={handleAddOrder} style={{ display: 'flex', gap: '15px', padding: '20px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e0e0e0', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. New Shipment"
              required
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 2 }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Description</label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="e.g. Dell Monitors"
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
            />
          </div>
          <button
            type="submit"
            style={{ padding: '9px 20px', backgroundColor: '#689f38', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Save
          </button>
        </form>
      )}

      {orders.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#666', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>No orders found</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>The server returned an empty list or is currently offline.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ flex: selectedOrderId ? '0 0 450px' : '1', display: 'flex', flexDirection: 'column', gap: '15px', transition: 'all 0.3s ease' }}>
            {orders.map((order) => {
              const orderProductsCount = products.filter((p) => p.order === order.id).length;
              const orderProducts = products.filter((p) => p.order === order.id);
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

                  <div style={{ textTransform: 'lowercase', color: '#666' }}>
                    {new Date(order.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
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
            <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e0e0e0', padding: '20px', position: 'relative' }}>
              <button
                onClick={() => setSelectedOrderId(null)}
                style={{ position: 'absolute', top: '-15px', right: '-15px', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
              >
                ✕
              </button>
              <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>{selectedOrder.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedOrderProducts.length === 0 ? (
                  <div style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No products in this order.</div>
                ) : (
                  selectedOrderProducts.map((product) => (
                    <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: product.isNew ? '#689f38' : '#ccc' }} />
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{product.title}</div>
                          <div style={{ color: '#999', fontSize: '12px' }}>SN: {product.serialNumber}</div>
                        </div>
                      </div>
                      <div style={{ color: product.isNew ? '#689f38' : '#666', fontSize: '13px' }}>
                        {product.isNew ? 'New' : 'Used'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {deleteTargetId && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '30px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', position: 'relative' }}>
            <button
              onClick={() => setDeleteTargetId(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#999' }}
            >
              ✕
            </button>
            <h4 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '18px' }}>Are you sure you want to delete this order?</h4>
            <p style={{ color: '#666', fontSize: '14px', margin: '0 0 25px 0' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button
                onClick={() => setDeleteTargetId(null)}
                style={{ padding: '8px 15px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
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
                }}
                style={{ padding: '8px 15px', borderRadius: '4px', border: 'none', backgroundColor: '#ef5350', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}