// src/components/tables/MastersCourseTable.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { MastersCourseForm } from "@/components/forms/MastersCourseForm";
import DataTable from "react-data-table-component";

const MastersCourseTable = ({ courses, handleUpsert, handleDelete }) => {
  const columns = [
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
    },
    {
      name: "Universities",
      selector: (row) => row.universities?.length || 0,
      sortable: true,
    },
    {
      name: "Courses",
      selector: (row) => row.courses?.length || 0,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <MastersCourseForm
            mode="edit"
            initialData={row}
            onSubmit={handleUpsert}
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
            onClick={() => handleDelete(row._id)}
          >
            <Trash className="h-4 w-4" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-md border border-border">
      <DataTable
        title="Masters Courses"
        columns={columns}
        data={courses}
        pagination
        highlightOnHover
        striped
        noDataComponent="No master courses found."
      />
    </div>
  );
};

export default MastersCourseTable;
