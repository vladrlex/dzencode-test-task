import type { Product } from '../store/productsSlice';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const uahPrice = product.price?.find((p) => p.symbol === 'UAH')?.value;
  const usdPrice = product.price?.find((p) => p.symbol === 'USD')?.value;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 20px',
        backgroundColor: '#fff',
        borderRadius: '6px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 2 }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#e5e4e7',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#6b6375',
            fontWeight: 'bold',
          }}
        >
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
}