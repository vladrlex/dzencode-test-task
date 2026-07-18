import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOrders, removeOrderServer, addOrderServer } from '../../store/ordersSlice';
import { fetchProducts, type Product } from '../../store/productsSlice';
import { formatDateNumeric, formatDateFull } from '../../utils/dateFormatter';
import OrderForm from '../../components/OrderForm/OrderForm';
import OrderDetail from '../../components/OrderDetail/OrderDetail';
import DeleteOrderModal from '../../components/DeleteOrderModal/DeleteOrderModal';
import Modal from '../../components/Modal/Modal';
import AddProductForm from '../../components/AddProductForm/AddProductForm';
import ListIcon from '../../components/Icons/ListIcon';
import DeleteButton from '../../components/Buttons/DeleteButton/DeleteButton';
import Pagination from '../../components/Pagination/Pagination';
import './Orders.css';

export default function Orders() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const orders = useAppSelector((state) => state.orders.items);
  const ordersPage = useAppSelector((state) => state.orders.page);
  const ordersLimit = useAppSelector((state) => state.orders.limit);
  const ordersTotalPages = useAppSelector((state) => state.orders.totalPages);
  const ordersLoading = useAppSelector((state) => state.orders.loading);

  const orderProducts = useAppSelector((state) => state.products.items);
  const productsLoading = useAppSelector((state) => state.products.loading);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [page, setPageState] = useState(Number(searchParams.get('page')) || 1);
  const [limit, setLimitState] = useState(Number(searchParams.get('limit')) || 30);

  const setPage = (newPage: number) => {
    setPageState(newPage);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  };

  const setLimit = (newLimit: number) => {
    setLimitState(newLimit);
    setPageState(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('limit', String(newLimit));
      next.set('page', '1');
      return next;
    });
  };

  useEffect(() => {
    setPageState(1);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(fetchOrders({ search: searchQuery, page, limit }));
  }, [dispatch, searchQuery, page, limit]);

  useEffect(() => {
    if (selectedOrderId) {
      dispatch(fetchProducts({ order: selectedOrderId }));
    }
  }, [dispatch, selectedOrderId]);

  const refetchOrders = () => dispatch(fetchOrders({ search: searchQuery, page, limit }));

  const handleAddOrder = async (title: string, description: string) => {
    try {
      await dispatch(addOrderServer({ title, description })).unwrap();
      setIsFormOpen(false);
      refetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      try {
        await dispatch(removeOrderServer(deleteTargetId)).unwrap();
      } catch (error) {
        console.error(error);
      } finally {
        if (selectedOrderId === deleteTargetId) setSelectedOrderId(null);
        setDeleteTargetId(null);
        refetchOrders();
      }
    }
  };

  const handleCloseProductModal = () => {
    setIsProductFormOpen(false);
    setProductToEdit(null);
  };

  const handleProductSaved = () => {
    handleCloseProductModal();
    if (selectedOrderId) dispatch(fetchProducts({ order: selectedOrderId }));
    refetchOrders();
  };

  if (ordersLoading) {
    return (
      <div className="lazy-fallback-container">
        <div className="lazy-spinner"></div>
      </div>
    );
  }

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  return (
    <div className="orders">
      <div className="orders__header">
        <h2 className="orders__title">{t('orders.title')} / {orders.length}</h2>
        <button className="orders__add-btn" onClick={() => setIsFormOpen(!isFormOpen)}>
          {isFormOpen ? t('orders.cancelBtn') : t('orders.addOrderBtn')}
        </button>
      </div>

      {isFormOpen && (
        <Modal title={t('orders.modalAddTitle')} onClose={() => setIsFormOpen(false)}>
          <OrderForm onSubmit={handleAddOrder} />
        </Modal>
      )}

      <div className="orders__content">
        <div className={`orders__list stagger-list ${selectedOrderId ? 'orders__list--shrink' : ''}`}>
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrderId(order.id)}
              className={`order-card ${selectedOrderId === order.id ? 'order-card--active' : ''}`}
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
                  setDeleteTargetId(order.id);
                }}
                ariaLabel="Delete order"
              />
            </div>
          ))}

          <Pagination
            page={ordersPage}
            totalPages={ordersTotalPages}
            limit={ordersLimit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>

        {selectedOrderId && selectedOrder && (
          <div className="order-detail">
            <div className="order-detail__actions">
              <button
                className="btn-add-product"
                onClick={() => {
                  setProductToEdit(null);
                  setIsProductFormOpen(true);
                }}
              >
                {t('orders.addProductBtn')}
              </button>
            </div>

            {productsLoading ? (
              <div className="lazy-fallback-container">
                <div className="lazy-spinner"></div>
              </div>
            ) : (
              <OrderDetail
                orderTitle={selectedOrder.title}
                products={orderProducts}
                onClose={() => setSelectedOrderId(null)}
                onEditProduct={(product) => {
                  setProductToEdit(product);
                  setIsProductFormOpen(true);
                }}
              />
            )}
          </div>
        )}
      </div>

      {isProductFormOpen && selectedOrderId && (
        <Modal
          title={productToEdit ? t('orders.modalProductEditTitle') : t('orders.modalProductAddTitle')}
          onClose={handleCloseProductModal}
        >
          <AddProductForm
            orderId={selectedOrderId}
            onClose={handleProductSaved}
            productToEdit={productToEdit}
          />
        </Modal>
      )}

      {deleteTargetId && (
        <DeleteOrderModal
          onClose={() => setDeleteTargetId(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}