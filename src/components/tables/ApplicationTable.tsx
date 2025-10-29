import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApplicationForm from "../forms/ApplicationForm";
import { GlobalDataTable } from "../common/DataTable";

const ApplicationTable = ({
  applications,
  roles,
  handleUpsert,
  handleDelete,
}) => {
  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Domain", selector: (row) => row.domain_url, sortable: true },
    { name: "Type", selector: (row) => row.applicationType, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Activated On",
      selector: (row) =>
        row.activatedAt ? new Date(row.activatedAt).toLocaleDateString() : "-",
      sortable: true,
    },
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
          <ApplicationForm
            mode="edit"
            roles={roles}
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
