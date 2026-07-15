import { type Product } from '../../store/productsSlice';
import './OrderDetail.css';

interface OrderDetailProps {
  orderTitle: string;
  products: Product[];
  onClose: () => void;
}

export default function OrderDetail({ orderTitle, products, onClose }: OrderDetailProps) {
  return (
    <div className="order-detail">
      <button className="order-detail__close" onClick={onClose}>
        ✕
      </button>
      <h3 className="order-detail__title">{orderTitle}</h3>
      <div className="order-detail__list">
        {products.length === 0 ? (
          <div className="order-detail__empty">No products in this order.</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="order-detail__item">
              <div className="order-detail__item-main">
                <div className={`order-detail__item-status ${product.isNew ? 'order-detail__item-status--new' : ''}`} />
                <div className="order-detail__item-info">
                  <div className="order-detail__item-title">{product.title}</div>
                  <div className="order-detail__item-sn">SN: {product.serialNumber}</div>
                </div>
              </div>
              <div className={`order-detail__item-condition ${product.isNew ? 'order-detail__item-condition--new' : ''}`}>
                {product.isNew ? 'New' : 'Used'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}