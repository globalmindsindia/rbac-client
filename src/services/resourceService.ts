import { getApi } from "@/api/api";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
};

export type ResourceDTO = { id: string; name: string };

export type ResourceList = {
  items: ResourceDTO[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};

export const resourceService = {
  // Get all resources
  async getResources() {
    const { data } = await getApi().get("/v1/resources/");
    return data;
  },

  async listAll(fields = "id,name"): Promise<ResourceDTO[]> {
    const { data: body } = await getApi().get<ApiEnvelope<ResourceDTO[]>>(
      "/v1/resources",
      {
        params: {
          "page[number]": 1,
          "page[size]": 1000,
          "fields[resources]": fields,
        },
      }
    );
    return body.data;
  },

  // Get all roles
  async getRoles() {
    const { data } = await getApi().get("/v1/roles/");
    return data;
  },

  // Upsert a resource (add or edit)
  async upsertResource(resource: any) {
    if (resource.id) {
      // Edit existing resource
      const { data } = await getApi().put(
        `/v1/resources/${resource.id}`,
        resource
      );
      return data;
    } else {
      // Create new resource
      const { data } = await getApi().post("/v1/resources/", resource);
      return data;
    }
  },
};
