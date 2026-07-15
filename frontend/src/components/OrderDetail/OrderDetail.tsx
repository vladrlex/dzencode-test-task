import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../store/hooks';
import { type Product, removeProductServer } from '../../store/productsSlice';
import './OrderDetail.css';

interface OrderDetailProps {
  orderTitle: string;
  products: Product[];
  onClose: () => void;
  onEditProduct: (product: Product) => void;
}

export default function OrderDetail({ orderTitle, products, onClose, onEditProduct }: OrderDetailProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm(t('modals.confirmDeleteProduct'))) {
      try {
        await dispatch(removeProductServer(productId)).unwrap();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  return (
    <div className="order-detail">
      <button className="order-detail__close" onClick={onClose}>
        ✕
      </button>
      <h3 className="order-detail__title">{orderTitle}</h3>
      <div className="order-detail__list">
        {products.length === 0 ? (
          <div className="order-detail__empty">{t('productCard.noProductsInOrder')}</div>
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
                {product.isNew ? t('productCard.new') : t('productCard.used')}
              </div>

              <div className="order-detail__item-actions">
                <button 
                  className="btn-action btn-edit" 
                  title={t('orders.modalProductEditTitle')}
                  onClick={() => onEditProduct(product)}
                >
                  ✏️
                </button>
                <button 
                  className="btn-action btn-delete" 
                  title="Delete Product"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}