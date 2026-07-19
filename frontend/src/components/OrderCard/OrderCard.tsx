import { useTranslation } from 'react-i18next';
import type { Order } from '../../store/ordersSlice';
import { formatDateNumeric, formatDateFull } from '../../utils/dateFormatter';
import ListIcon from '../Icons/ListIcon';
import DeleteButton from '../Buttons/DeleteButton/DeleteButton';
import './OrderCard.css';

interface OrderCardProps {
  order: Order;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function OrderCard({ order, isActive, onSelect, onDelete }: OrderCardProps) {
  const { t, i18n } = useTranslation();

  return (
    <div
      onClick={onSelect}
      className={`order-card ${isActive ? 'order-card--active' : ''}`}
    >
      <div className="order-card__icon">
        <ListIcon size={18} className="order-card__icon-svg" />
      </div>

      <div className="order-card__title">{order.title}</div>

      <div className="order-card__products">
        <div className="order-card__products-count">{order.productsCount}</div>
        <div className="order-card__products-label">{t('orders.productsCountLabel')}</div>
      </div>

      <div className="order-card__date">
        <div className="order-card__date-secondary">{formatDateNumeric(order.date)}</div>
        <div className="order-card__date-main">{formatDateFull(order.date, i18n.language)}</div>
      </div>

      <div className="order-card__price">
        <div className="order-card__price-usd">{order.totalUsd} $</div>
        <div className="order-card__price-uah">{order.totalUah} UAH</div>
      </div>

      <DeleteButton
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        ariaLabel={t('a11y.deleteOrder')}
      />
    </div>
  );
}
