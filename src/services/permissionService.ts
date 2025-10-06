// services/permissionService.ts
import { getApi } from "@/api/api";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
};

export type PermissionDTO = {
  id: string;
  action: string;
  resource: { id: string; name: string };
  label: string; // resource.name:action
};

export type PermissionList = {
  items: PermissionDTO[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};

export const permissionService = {
  async list(
    params: { page?: number; size?: number; q?: string } = {}
  ): Promise<PermissionList> {
    const page = params.page ?? 1;
    const size = params.size ?? 10;
    const { data } = await getApi().get<ApiEnvelope<PermissionDTO[]>>(
      "/v1/permissions",
      {
        params: { "page[number]": page, "page[size]": size, q: params.q ?? "" },
      }
    );
    const meta = (data as any).meta ?? {
      total: (data as any).data.length,
      page,
      size,
      totalPages: 1,
    };
    return {
      items: data.data,
      total: meta.total,
      page: meta.page,
      size: meta.size,
      totalPages: meta.totalPages,
    };
  },

  async getAll(): Promise<PermissionDTO[]> {
    // Fetch a large page to approximate "all"
    const { data } = await getApi().get<ApiEnvelope<PermissionDTO[]>>(
      "/v1/permissions",
      {
        params: { "page[number]": 1, "page[size]": 1000 },
      }
    );
    return data.data;
  },

  async getById(id: string): Promise<PermissionDTO> {
    const { data } = await getApi().get<ApiEnvelope<PermissionDTO>>(
      `/v1/permissions/${id}`
    );
    return data.data;
  },

  async create(payload: {
    action: string;
    resourceId: string;
  }): Promise<PermissionDTO> {
    const { data } = await getApi().post<ApiEnvelope<PermissionDTO>>(
      "/v1/permissions",
      payload
    );
    return data.data;
  },

  async update(
    id: string,
    payload: { action?: string; resourceId?: string }
  ): Promise<PermissionDTO> {
    const { data } = await getApi().put<ApiEnvelope<PermissionDTO>>(
      `/v1/permissions/${id}`,
      payload
    );
    return data.data;
  },

  async delete(id: string): Promise<{ id: string }> {
    const { data } = await getApi().delete<ApiEnvelope<{ id: string }>>(
      `/v1/permissions/${id}`
    );
    return data.data;
  },
};
