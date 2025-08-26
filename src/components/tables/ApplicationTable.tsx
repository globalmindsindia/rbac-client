import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApplicationForm from "../forms/ApplicationForm";
import { GlobalDataTable } from "../common/DataTable";

const ApplicationTable = ({ applications, handleUpsert, handleDelete }) => {
  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Domain", selector: (row) => row.domain_url, sortable: true },
    {
      name: "Roles",
      selector: (row) => row.roles?.length || 0,
      sortable: true,
    },
    {
      name: "Users",
      selector: (row) => row.userRoles?.length || 0,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          {/* Edit button */}
          <ApplicationForm
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

          {/* Delete button */}
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => handleDelete(row.id)}
          >
            <Trash className="h-4 w-4" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <GlobalDataTable
      columns={columns}
      data={applications}
      noDataMessage="No applications found."
    />
  );
};

export default ApplicationTable;
