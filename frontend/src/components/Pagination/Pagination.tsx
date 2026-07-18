import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Pagination.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  limitOptions?: number[];
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  const delta = 1;
  const range: number[] = [];
  const withDots: (number | 'ellipsis')[] = [];
  let last: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (last !== undefined) {
      if (i - last === 2) {
        withDots.push(last + 1);
      } else if (i - last !== 1) {
        withDots.push('ellipsis');
      }
    }
    withDots.push(i);
    last = i;
  }

  return withDots;
}

export default function Pagination({
  page,
  totalPages,
  limit,
  limitOptions = [30, 50, 100],
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="pagination">
      <div className="pagination__limit">
        <span className="pagination__limit-label">
          {t('pagination.rowsPerPage', { defaultValue: 'Rows per page' })}
        </span>

        <div className="pagination__dropdown dropdown-custom" ref={dropdownRef}>
          <button
            type="button"
            className={`dropdown-custom__toggle ${isOpen ? 'dropdown-custom__toggle--active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{limit}</span>
            <span className={`dropdown-custom__arrow ${isOpen ? 'dropdown-custom__arrow--open' : ''}`}>▼</span>
          </button>

          {isOpen && (
            <div className="dropdown-custom__menu">
              {limitOptions.map((option) => (
                <div
                  key={option}
                  className={`dropdown-custom__item ${limit === option ? 'dropdown-custom__item--selected' : ''}`}
                  onClick={() => {
                    onLimitChange(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pagination__pages">
        <button
          type="button"
          className="pagination__nav-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ‹
        </button>

        {pages.map((p, idx) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="pagination__dots">…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`pagination__page-btn ${p === page ? 'pagination__page-btn--active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className="pagination__nav-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}