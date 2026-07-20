import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts, fetchProductTypes, removeProductServer } from '../../store/productsSlice';
import { addToast } from '../../store/uiSlice';
import ProductCard from './ProductCard/ProductCard';
import DeleteOrderModal from '../../components/DeleteOrderModal/DeleteOrderModal';
import Pagination from '../../components/Pagination/Pagination';
import Dropdown from '../../components/Dropdown/Dropdown';
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
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; title: string } | null>(null);
  const [localPage, setLocalPageState] = useState(Number(searchParams.get('page')) || 1);
  const [localLimit, setLocalLimitState] = useState(Number(searchParams.get('limit')) || 30);

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

  const prevSearchQuery = useRef(searchQuery);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchProductTypes());
  }, [dispatch]);

  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      const canScrollRight = wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth - 1;
      const canScrollLeft = wrapper.scrollLeft > 0;
      if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
        e.preventDefault();
        wrapper.scrollLeft += e.deltaY;
      }
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    return () => wrapper.removeEventListener('wheel', handleWheel);
  }, [products]);

  useEffect(() => {
    const isNewSearch = prevSearchQuery.current !== searchQuery;
    prevSearchQuery.current = searchQuery;
    const effectivePage = isNewSearch ? 1 : localPage;

    if (isNewSearch && localPage !== 1) {
      setLocalPageState(1);
      return;
    }

    if (!isNewSearch && totalPages > 0 && localPage > totalPages) {
      setLocalPage(totalPages);
      return;
    }

    dispatch(fetchProducts({ search: searchQuery, type: selectedType, page: effectivePage, limit: localLimit }));
  }, [dispatch, searchQuery, selectedType, localPage, localLimit, totalPages]);

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
        dispatch(addToast(t('errors.deleteProductFailed')));
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
    const isFiltered = Boolean(searchQuery) || selectedType !== 'All';
    return (
      <div className="products__empty">
        <h3 className="products__empty-title">{t('products.noProducts')}</h3>
        <p className="products__empty-text">
          {isFiltered ? t('products.noResultsText') : t('products.emptyText')}
        </p>
      </div>
    );
  }

  return (
    <div className="products">
      <div className="products__header">
        <h2 className="products__title">{t('products.title')} / {total}</h2>

        <div className="products__filter">
          <span className="products__filter-label">{t('products.filterLabel')}</span>

          <Dropdown
            className="products__dropdown"
            options={[
              { value: 'All', label: t('products.allTypes') },
              ...productTypes.map((type) => ({ value: type, label: type })),
            ]}
            value={selectedType}
            onChange={setSelectedType}
            triggerLabel={selectedType === 'All' ? t('products.allTypes') : selectedType}
          />
        </div>
      </div>

      <div className="products__table-wrapper" ref={tableWrapperRef}>
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