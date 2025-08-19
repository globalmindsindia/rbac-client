// components/common/DataTable.tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";

interface DataTableProps<T> {
  columns: { header: string; render: (row: T) => ReactNode }[];
  data: T[];
  pageSize?: number;
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 5,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead key={idx}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col, colIdx) => (
                <TableCell key={colIdx}>{col.render(row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span className="px-2 text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
