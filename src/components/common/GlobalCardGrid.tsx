import React, { useState, useMemo } from "react";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApplicationForm from "../forms/ApplicationForm";

interface CardItem {
  id: string | number;
  name: string;
  domain_url: string;
  roles?: any[];
  userRoles?: any[];
  [key: string]: any;
}

interface CardGridProps<T extends CardItem> {
  data: T[];
  itemsPerPage?: number;
  noDataMessage?: string;
  renderCard?: (item: T, actions?: React.ReactNode) => React.ReactNode;
  showPagination?: boolean;
  handleUpsert?: (data: any) => Promise<void> | void;
  handleDelete?: (id: string | number) => Promise<void> | void;
  roles?: any[];
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

// Reusable Pagination Component
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5,
}) => {
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    const end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* First Page Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="hidden sm:flex"
      >
        First
      </Button>

      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {/* Page Numbers */}
      {showPageNumbers && (
        <>
          {visiblePages[0] > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                className="hidden sm:flex"
              >
                1
              </Button>
              {visiblePages[0] > 2 && <span className="px-2">...</span>}
            </>
          )}

          {visiblePages.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="hidden sm:flex"
            >
              {page}
            </Button>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span className="px-2">...</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                className="hidden sm:flex"
              >
                {totalPages}
              </Button>
            </>
          )}
        </>
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>

      {/* Last Page Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="hidden sm:flex"
      >
        Last
      </Button>

      {/* Mobile Page Info */}
      <div className="flex sm:hidden items-center ml-4 text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

// Default Card Component
const DefaultCard: React.FC<{
  item: CardItem;
  actions?: React.ReactNode;
}> = ({ item, actions }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {item.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{item.domain_url}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="text-center p-3 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">
          {item.roles?.length || 0}
        </div>
        <div className="text-xs text-gray-600">Roles</div>
      </div>
      <div className="text-center p-3 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">
          {item.userRoles?.length || 0}
        </div>
        <div className="text-xs text-gray-600">Users</div>
      </div>
    </div>

    {actions && (
      <div className="flex gap-2 justify-end pt-4 border-t border-gray-100">
        {actions}
      </div>
    )}
  </div>
);

// Main GlobalCardGrid Component
export function GlobalCardGrid<T extends CardItem>({
  data,
  itemsPerPage = 12,
  noDataMessage = "No items found.",
  renderCard,
  showPagination = true,
  handleUpsert,
  handleDelete,
  roles,
}: CardGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const { paginatedData, totalPages } = useMemo(() => {
    const total = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = data.slice(startIndex, endIndex);

    return {
      paginatedData: paginated,
      totalPages: total,
    };
  }, [data, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to page 1 when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-500 bg-gray-50 rounded-lg">
        {noDataMessage}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Items Info */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}{" "}
          items
        </span>
        {showPagination && totalPages > 1 && (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedData.map((item) => {
          const cardActions =
            handleUpsert && handleDelete ? (
              <>
                <ApplicationForm
                  mode="edit"
                  roles={roles}
                  initialData={item as any}
                  onSubmit={(data: any) => {
                    const result = handleUpsert(data);
                    return result instanceof Promise
                      ? result
                      : Promise.resolve();
                  }}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash className="h-4 w-4" /> Delete
                </Button>
              </>
            ) : null;

          return (
            <div key={item.id}>
              {renderCard ? (
                renderCard(item, cardActions)
              ) : (
                <DefaultCard item={item} actions={cardActions} />
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
