import React from 'react';
import './Pagination.scss';

interface PaginationProps {
  count: number;
  next: string | null;
  previous: string | null;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ count, next, previous, limit, offset, onPageChange }) => {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(Math.max(0, offset - limit))}
        disabled={!previous}
      >
        ← Prev
      </button>
      <span className="pagination__info">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="pagination__btn"
        onClick={() => onPageChange(offset + limit)}
        disabled={!next}
      >
        Next →
      </button>
    </div>
  );
}; 