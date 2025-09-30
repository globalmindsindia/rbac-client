import { GlobalCardGrid } from "../common/GlobalCardGrid";

interface ResourceCardGridProps {
  applications: Array<{
    id: string | number;
    name: string;
    domain_url: string;
    roles?: any[];
    userRoles?: any[];
    [key: string]: any;
  }>;
  roles?: any[];
  handleUpsert: (data: any) => Promise<void> | void;
  handleDelete: (id: string | number) => Promise<void> | void;
  itemsPerPage?: number;
}

const ResourceCardGrid: React.FC<ResourceCardGridProps> = ({
  applications,
  roles,
  handleUpsert,
  handleDelete,
  itemsPerPage = 12,
}) => {
  const renderApplicationCard = (item: any, actions: React.ReactNode) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 break-all">
            {item.domain_url}
          </p>
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

  return (
    <GlobalCardGrid
      data={applications}
      itemsPerPage={itemsPerPage}
      noDataMessage="No applications found."
      renderCard={renderApplicationCard}
      showPagination={true}
      handleUpsert={handleUpsert}
      handleDelete={handleDelete}
      roles={roles}
    />
  );
};

export default ResourceCardGrid;
