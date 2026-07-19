import { useTranslation } from 'react-i18next';
import type { Product } from '../../store/productsSlice';
import { formatDateNumeric, formatDateFull, formatDateWithYear } from '../../utils/dateFormatter';
import ProductIcon from '../Icons/ProductIcon';
import DeleteButton from '../Buttons/DeleteButton/DeleteButton';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  orderTitle: string;
  onDelete: (productId: number) => void;
}

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
        <div className="product-card__sn">{t('productCard.serialNumberShort')}: {product.serialNumber}</div>
      </div>

      <div className={`product-card__cell product-card__status-text ${
        product.isNew ? 'product-card__status-text--free' : 'product-card__status-text--repair'
      }`}>
        {product.isNew ? t('productCard.statusAvailable') : t('productCard.statusInRepair')}
      </div>

      <div className="product-card__guarantee">
        <div className="product-card__guarantee-label">{t('productCard.from')} {formatDateWithYear(product.guarantee.start)}</div>
        <div className="product-card__guarantee-label">{t('productCard.to')} {formatDateWithYear(product.guarantee.end)}</div>
      </div>

      <div className={`product-card__condition ${product.isNew ? 'product-card__condition--new' : ''}`}>
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
        <div className="product-card__date-short">{formatDateNumeric(product.date)}</div>
        <div className="product-card__date-full">{formatDateFull(product.date, i18n.language)}</div>
      </div>

      <DeleteButton onClick={() => onDelete(product.id)} ariaLabel={t('a11y.delete')} size={16} />
    </div>
  );
}