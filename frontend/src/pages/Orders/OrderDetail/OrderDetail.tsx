import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../store/hooks';
import { type Product, removeProductServer } from '../../../store/productsSlice';
import { addToast } from '../../../store/uiSlice';
import CloseButton from '../../../components/Buttons/CloseButton/CloseButton';
import EditIcon from '../../../components/Icons/EditIcon';
import DeleteButton from '../../../components/Buttons/DeleteButton/DeleteButton';
import DeleteOrderModal from '../../../components/DeleteOrderModal/DeleteOrderModal';
import Button from '../../../components/Button/Button';
import './OrderDetail.css';

interface OrderDetailProps {
  orderTitle: string;
  products: Product[];
  onClose: () => void;
  onEditProduct: (product: Product) => void;
  onAddProduct: () => void;
  onProductDeleted: () => void;
}

export default function OrderDetail({ orderTitle, products, onClose, onEditProduct, onAddProduct, onProductDeleted }: OrderDetailProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; title: string } | null>(null);

  const handleDeleteProductClick = (productId: number, productTitle: string) => {
    setProductToDelete({ id: productId, title: productTitle });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await dispatch(removeProductServer(productToDelete.id)).unwrap();
        onProductDeleted();
      } catch (error) {
        console.error('Failed to delete product:', error);
        dispatch(addToast(t('errors.deleteProductFailed')));
      } finally {
        setDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  return (
    <div className="order-detail">
      <CloseButton
        onClick={onClose}
        className="order-detail__close-pos"
        ariaLabel={t('a11y.closeDetails')}
      />
      <h3 className="order-detail__title">{orderTitle}</h3>

      <div className="order-detail__actions">
        <Button className="btn-add-product" onClick={onAddProduct}>
          {t('orders.addProductBtn')}
        </Button>
      </div>

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
                  <div className="order-detail__item-sn">{t('productCard.serialNumberShort')}: {product.serialNumber}</div>
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
                  <EditIcon size={16} />
                </button>

                <DeleteButton
                  onClick={() => handleDeleteProductClick(product.id, product.title)}
                  ariaLabel={t('a11y.deleteProduct')}
                  size={16}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {deleteModalOpen && (
        <DeleteOrderModal
          onClose={() => {
            setDeleteModalOpen(false);
            setProductToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title={t('modals.confirmDeleteProduct', { defaultValue: 'Are you sure you want to delete this product?' })}
          itemName={productToDelete?.title}
        />
      )}
    </div>
  );
}