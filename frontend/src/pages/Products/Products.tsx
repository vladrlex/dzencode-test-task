import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts, fetchProductTypes, removeProductServer } from '../../store/productsSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import DeleteOrderModal from '../../components/DeleteOrderModal/DeleteOrderModal';
import Pagination from '../../components/Pagination/Pagination';
import './Products.css';

export default function Products() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const products = useAppSelector((state) => state.products.items);
  const productTypes = useAppSelector((state) => state.products.types);
  const page = useAppSelector((state) => state.products.page);
  const limit = useAppSelector((state) => state.products.limit);
  const totalPages = useAppSelector((state) => state.products.totalPages);
  const total = useAppSelector((state) => state.products.total);
  const productsLoading = useAppSelector((state) => state.products.loading);

  const [selectedType, setSelectedTypeState] = useState<string>(searchParams.get('type') || 'All');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; title: string } | null>(null);
  const [localPage, setLocalPageState] = useState(Number(searchParams.get('page')) || 1);
  const [localLimit, setLocalLimitState] = useState(Number(searchParams.get('limit')) || 30);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const setLocalPage = (newPage: number) => {
    setLocalPageState(newPage);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  };

  const setLocalLimit = (newLimit: number) => {
    setLocalLimitState(newLimit);
    setLocalPageState(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('limit', String(newLimit));
      next.set('page', '1');
      return next;
    });
  };

  const setSelectedType = (type: string) => {
    setSelectedTypeState(type);
    setLocalPageState(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (type === 'All') {
        next.delete('type');
      } else {
        next.set('type', type);
      }
      next.set('page', '1');
      return next;
    });
  };

  useEffect(() => {
    dispatch(fetchProductTypes());
  }, [dispatch]);

  useEffect(() => {
    setLocalPageState(1);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(fetchProducts({ search: searchQuery, type: selectedType, page: localPage, limit: localLimit }));
  }, [dispatch, searchQuery, selectedType, localPage, localLimit]);

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
        dispatch(fetchProducts({ search: searchQuery, type: selectedType, page: localPage, limit: localLimit }));
      } catch (error) {
        console.error('Failed to delete product:', error);
      } finally {
        setDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  if (productsLoading) {
    return (
      <div className="lazy-fallback-container">
        <div className="lazy-spinner"></div>
      </div>
    );
  }

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
        <h2 className="products__title">{t('products.title')} / {total}</h2>

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
                <div
                  className={`dropdown-custom__item ${selectedType === 'All' ? 'dropdown-custom__item--selected' : ''}`}
                  onClick={() => {
                    setSelectedType('All');
                    setIsOpen(false);
                  }}
                >
                  {t('products.allTypes')}
                </div>
                {productTypes.map((type) => (
                  <div
                    key={type}
                    className={`dropdown-custom__item ${selectedType === type ? 'dropdown-custom__item--selected' : ''}`}
                    onClick={() => {
                      setSelectedType(type);
                      setIsOpen(false);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="products__table-wrapper">
        <div className="products__list stagger-list">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              orderTitle={product.orderTitle || t('products.unknownOrder')}
              onDelete={(id) => handleDeleteProduct(id, product.title)}
            />
          ))}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          limit={limit}
          onPageChange={setLocalPage}
          onLimitChange={setLocalLimit}
        />
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