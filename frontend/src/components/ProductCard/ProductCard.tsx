import { useTranslation } from 'react-i18next';
import type { Product } from '../../store/productsSlice';
import { formatDateNumeric, formatDateFull } from '../../utils/dateFormatter';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  orderTitle: string;
}

export default function ProductCard({ product, orderTitle }: ProductCardProps) {
  const { t } = useTranslation();
  const uahPrice = product.price?.find((p) => p.symbol === 'UAH')?.value;
  const usdPrice = product.price?.find((p) => p.symbol === 'USD')?.value;

  return (
    <div className="product-card">
      <div 
        className="product-card__status" 
        style={{ backgroundColor: product.isNew ? '#689f38' : '#333' }} 
      />

      <div className="product-card__icon">
        💻
      </div>

      <div className="product-card__info">
        <div className="product-card__title">{product.title}</div>
        <div className="product-card__sn">SN: {product.serialNumber}</div>
      </div>

      <div className="product-card__condition" style={{ color: product.isNew ? '#689f38' : '#333' }}>
        {product.isNew ? t('productCard.new') : t('productCard.used')}
      </div>

      <div className="product-card__guarantee">
        <div>{t('productCard.from')}: {formatDateNumeric(product.guarantee.start)}</div>
        <div>{t('productCard.to')}: {formatDateFull(product.guarantee.end)}</div>
      </div>

      <div className="product-card__price">
        <div className="product-card__price-usd">{usdPrice} $</div>
        <div className="product-card__price-uah">{uahPrice} UAH</div>
      </div>

      <div className="product-card__type-order">
        <span className="product-card__order">{orderTitle}</span>
        <span className="product-card__type">{product.type}</span>
      </div>
      
      <button className="product-card__delete">🗑️</button>
    </div>
  );
}