import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} limit={30} onPageChange={vi.fn()} onLimitChange={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('calls onPageChange with the clicked page number', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination page={1} totalPages={3} limit={30} onPageChange={onPageChange} onLimitChange={vi.fn()} />
    );

    fireEvent.click(screen.getByText('2'));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables the previous button on the first page and the next button on the last page', () => {
    const { rerender } = render(
      <Pagination page={1} totalPages={3} limit={30} onPageChange={vi.fn()} onLimitChange={vi.fn()} />
    );
    expect(screen.getByText('‹')).toBeDisabled();
    expect(screen.getByText('›')).not.toBeDisabled();

    rerender(
      <Pagination page={3} totalPages={3} limit={30} onPageChange={vi.fn()} onLimitChange={vi.fn()} />
    );
    expect(screen.getByText('‹')).not.toBeDisabled();
    expect(screen.getByText('›')).toBeDisabled();
  });

  it('calls onPageChange with page - 1 when the previous button is clicked', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination page={2} totalPages={3} limit={30} onPageChange={onPageChange} onLimitChange={vi.fn()} />
    );

    fireEvent.click(screen.getByText('‹'));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
