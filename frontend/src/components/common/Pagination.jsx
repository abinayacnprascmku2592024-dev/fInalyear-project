import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange }) => {
  if (totalPages <= 1 && !pageSize) return null;

  return (
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mt-4 pt-3 border-top border-light">
      {onPageSizeChange && (
        <div className="d-flex align-items-center gap-2 small text-muted">
          <span>Show:</span>
          <select 
            className="form-select form-select-sm" 
            style={{ width: 'auto' }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>per page</span>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Table navigation">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-item-btn btn btn-sm btn-outline-secondary me-1"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft size={10} /> Prev
              </button>
            </li>
            
            <li className="page-item disabled mx-2 d-flex align-items-center">
              <span className="small text-muted">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
            </li>

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-item-btn btn btn-sm btn-outline-secondary ms-1"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <FaChevronRight size={10} />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Pagination;
