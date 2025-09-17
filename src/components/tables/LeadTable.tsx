import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalDataTable } from "../common/DataTable";

const LeadTable = ({ leads, handleDelete }) => {
  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.phoneNumber, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
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

  return <GlobalDataTable columns={columns} data={leads} />;
};

export default LeadTable;
