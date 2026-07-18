import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts, removeProductServer } from '../../store/productsSlice';
import { fetchOrders } from '../../store/ordersSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import DeleteOrderModal from '../../components/DeleteOrderModal/DeleteOrderModal';
import './Products.css';

export default function Products() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const products = useAppSelector((state) => state.products.items);
  const orders = useAppSelector((state) => state.orders.items);
  const loading = useAppSelector((state) => state.products.loading || state.orders.loading);

  const [selectedType, setSelectedType] = useState<string>('All');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; title: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchProducts(searchQuery));
  }, [dispatch, searchQuery]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteProduct = (productId: number, productTitle: string) => {
    setProductToDelete({ id: productId, title: productTitle });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await dispatch(removeProductServer(productToDelete.id)).unwrap();
      } catch (error) {
        console.error('Failed to delete product:', error);
      } finally {
        setDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="lazy-fallback-container">
        <div className="lazy-spinner"></div>
      </div>
    );
  }

  const productTypes = ['All', ...new Set(products.map((p) => p.type))];

  const filteredProducts = products.filter((p) => selectedType === 'All' || p.type === selectedType);

  if (!products || products.length === 0) {
    return (
      <div className="products__empty">
        <h3 className="products__empty-title">{t('products.noProducts')}</h3>
        <p className="products__empty-text">{t('products.emptyText')}</p>
      </div>
    );
  }

  return (
    <div className="products">
      <div className="products__header">
        <h2 className="products__title">{t('products.title')} / {filteredProducts.length}</h2>

        <div className="products__filter">
          <span className="products__filter-label">{t('products.filterLabel')}</span>

          <div className="products__dropdown dropdown-custom" ref={dropdownRef}>
            <button
              className={`dropdown-custom__toggle ${isOpen ? 'dropdown-custom__toggle--active' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>{selectedType === 'All' ? t('products.allTypes') : selectedType}</span>
              <span className={`dropdown-custom__arrow ${isOpen ? 'dropdown-custom__arrow--open' : ''}`}>▼</span>
            </button>

            {isOpen && (
              <div className="dropdown-custom__menu">
                {productTypes.map((type) => (
                  <div
                    key={type}
                    className={`dropdown-custom__item ${selectedType === type ? 'dropdown-custom__item--selected' : ''}`}
                    onClick={() => {
                      setSelectedType(type);
                      setIsOpen(false);
                    }}
                  >
                    {type === 'All' ? t('products.allTypes') : type}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="products__table-wrapper">
        <div className="products__list stagger-list">
          {filteredProducts.map((product) => {
            const parentOrder = orders.find((o) => o.id === product.order);
            const orderTitle = parentOrder ? parentOrder.title : t('products.unknownOrder');

            return (
              <ProductCard
                key={product.id}
                product={product}
                orderTitle={orderTitle}
                onDelete={(id) => handleDeleteProduct(id, product.title)}
              />
            );
          })}
        </div>
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