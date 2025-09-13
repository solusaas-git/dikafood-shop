import React from 'react';
import LucideIcon from '../icons/LucideIcon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

interface ItemsPerPageSelectorProps {
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  options?: number[];
  className?: string;
}

interface PaginationInfoProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  className?: string;
}

// Main Pagination Component
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`
          flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors
          ${currentPage <= 1 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
        aria-label="Previous page"
      >
        <LucideIcon name="chevronleft" size="sm" />
      </button>

      {/* First page + ellipsis */}
      {showPageNumbers && visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="flex items-center justify-center w-8 h-8 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {showPageNumbers && visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors
            ${page === currentPage
              ? 'bg-logo-lime text-white'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* Last page + ellipsis */}
      {showPageNumbers && visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="flex items-center justify-center w-8 h-8 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`
          flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors
          ${currentPage >= totalPages 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
        aria-label="Next page"
      >
        <LucideIcon name="chevronright" size="sm" />
      </button>
    </div>
  );
};

// Items Per Page Selector Component
export const ItemsPerPageSelector: React.FC<ItemsPerPageSelectorProps> = ({
  itemsPerPage,
  onItemsPerPageChange,
  options = [10, 20, 50, 100],
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-gray-600">Show:</span>
      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-logo-lime"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-600">per page</span>
    </div>
  );
};

// Pagination Info Component
export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
  className = ''
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      Showing {startItem} to {endItem} of {totalItems} results
    </div>
  );
};

// Combined Pagination Controls Component
interface PaginationControlsProps extends PaginationProps, ItemsPerPageSelectorProps {
  totalItems: number;
  showInfo?: boolean;
  showItemsPerPage?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showInfo = true,
  showItemsPerPage = true,
  showPageNumbers = true,
  maxVisiblePages = 5,
  options = [10, 20, 50, 100],
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Left side - Info and Items per page */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        {showInfo && (
          <PaginationInfo
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        )}
        {showItemsPerPage && (
          <ItemsPerPageSelector
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            options={options}
          />
        )}
      </div>

      {/* Right side - Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        showPageNumbers={showPageNumbers}
        maxVisiblePages={maxVisiblePages}
      />
    </div>
  );
};

export default Pagination;
