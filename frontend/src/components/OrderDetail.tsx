import { type Product } from '../store/productsSlice';

interface OrderDetailProps {
  orderTitle: string;
  products: Product[]; // Тепер тут завжди актуальний тип
  onClose: () => void;
}

export default function OrderDetail({ orderTitle, products, onClose }: OrderDetailProps) {
  return (
    <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e0e0e0', padding: '20px', position: 'relative' }}>
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: '-15px', right: '-15px', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
      >
        ✕
      </button>
      <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>{orderTitle}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {products.length === 0 ? (
          <div style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No products in this order.</div>
        ) : (
          products.map((product) => (
            <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: product.isNew ? '#689f38' : '#ccc' }} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{product.title}</div>
                  {/* Переконайся, що в slice експортується саме Product */}
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
  );
}