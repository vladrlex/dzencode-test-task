import { useTranslation } from 'react-i18next';
import type { Product } from '../../store/productsSlice';
import ProductIcon from '../Icons/ProductIcon';
import DeleteButton from '../Buttons/DeleteButton/DeleteButton';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  orderTitle: string;
  onDelete: (productId: number) => void;
}

const formatDateNumeric = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
};

const formatDateShortDayMonth = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day} / ${month}`;
};

const formatDateWithMonthName = (dateString: string, locale: string = 'ru'): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  let month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
  month = month.replace('.', '');
  
  if (month.length > 3) {
    month = month.substring(0, 3);
  }
  
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  return `${day} / ${capitalizedMonth} / ${year}`;
};

export default function ProductCard({ product, orderTitle, onDelete }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const uahPrice = product.price?.find((p) => p.symbol === 'UAH')?.value;
  const usdPrice = product.price?.find((p) => p.symbol === 'USD')?.value;

  return (
    <div className="product-card">
      <div className={`product-card__status ${product.isNew ? 'product-card__status--new' : ''}`} />

      <div className="product-card__icon">
        <ProductIcon type={product.type} size={20} className="product-card__icon-svg" />
      </div>

      <div className="product-card__info">
        <div className="product-card__title">{product.title}</div>
        <div className="product-card__sn">SN: {product.serialNumber}</div>
      </div>

      <div className={`product-card__cell product-card__status-text ${
        product.isNew ? 'product-card__status-text--free' : 'product-card__status-text--repair'
      }`}>
        {product.isNew ? 'свободен' : 'В ремонте'}
      </div>
      
      <div className="product-card__guarantee">
        <div className="product-card__guarantee-label">c {formatDateNumeric(product.guarantee.start)}</div>
        <div className="product-card__guarantee-label">по {formatDateNumeric(product.guarantee.end)}</div>
      </div>

      <div className="product-card__condition">
        {product.isNew ? t('productCard.new') : t('productCard.used')}
      </div>

      <div className="product-card__price">
        <span className="product-card__price-usd">{usdPrice} $</span>
        <span className="product-card__price-uah">{uahPrice} UAH</span>
      </div>

      <div className="product-card__group">
        {product.specification}
      </div>

      <div className="product-card__supplier">
        {product.supplier || t('productCard.supplierUnknown')}
      </div>

      <div className="product-card__order">
        {orderTitle}
      </div>

      <div className="product-card__date">
        <div className="product-card__date-short">{formatDateShortDayMonth(product.date)}</div>
        <div className="product-card__date-full">{formatDateWithMonthName(product.date, i18n.language)}</div>
      </div>

      <DeleteButton onClick={() => onDelete(product.id)} ariaLabel="Delete" size={16} />
    </div>
  );
}