import type { Product } from '../store/productsSlice';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const uahPrice = product.price?.find((p) => p.symbol === 'UAH')?.value;
  const usdPrice = product.price?.find((p) => p.symbol === 'USD')?.value;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '20px 50px 2fr 1fr 1.5fr 1fr 1fr 40px',
      alignItems: 'center',
      padding: '12px 20px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e0e0e0',
      gap: '20px',
      fontSize: '14px'
    }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: product.isNew ? '#689f38' : '#333' }} />

      <div style={{ width: '40px', height: '40px', backgroundColor: '#f4f4f4', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        💻
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.title}</div>
        <div style={{ fontSize: '12px', color: '#999' }}>SN: {product.serialNumber}</div>
      </div>

      <div style={{ color: product.isNew ? '#689f38' : '#333' }}>
        {product.isNew ? 'New' : 'Used'}
      </div>

      <div style={{ fontSize: '12px', color: '#666' }}>
        <div>from {new Date().toLocaleDateString('en-GB')}</div>
        <div>to {new Date().toLocaleDateString('en-GB')}</div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '12px', color: '#999' }}>{usdPrice} $</div>
        <div style={{ fontWeight: 'bold' }}>{uahPrice} UAH</div>
      </div>

      <div style={{ color: '#666' }}>{product.type}</div>
      
      <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
    </div>
  );
}