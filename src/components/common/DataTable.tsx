import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  noDataMessage?: string;
}

export function GlobalDataTable<T>({
  columns,
  data,
  noDataMessage = "No records found.",
}: DataTableProps<T>) {
  return (
    <div className="border rounded-lg shadow-sm">
      <DataTable
        columns={columns}
        data={data}
        highlightOnHover
        striped
        pagination
        responsive
        noDataComponent={
          <div className="p-6 text-gray-500">{noDataMessage}</div>
        }
      />
    </div>
  );
}
