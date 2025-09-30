// services/roleService.ts
import { getApi } from "@/api/api";

export type ApiEnvelope<T> = { success: boolean; message: string; data: T };

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  permissions: string[];
  userCount: number;
}

export const roleService = {
  async getRoles(): Promise<Role[]> {
    const { data } = await getApi().get<ApiEnvelope<Role[]>>("/v1/roles");
    return data.data;
  },

  async getRoleById(id: string): Promise<Role> {
    const { data } = await getApi().get<ApiEnvelope<Role>>(`/v1/roles/${id}`);
    return data.data;
  },

  async createRole(payload: {
    name: string;
    description?: string;
  }): Promise<Role> {
    const { data } = await getApi().post<ApiEnvelope<Role>>(
      "/v1/roles",
      payload
    );
    return data.data;
  },

  async updateRole(
    id: string,
    payload: { name?: string; description?: string }
  ): Promise<Role> {
    const { data } = await getApi().put<ApiEnvelope<Role>>(
      `/v1/roles/${id}`,
      payload
    );
    return data.data;
  },

  async deleteRole(id: string): Promise<{ id: string } | null> {
    const { data } = await getApi().delete<ApiEnvelope<{ id: string } | null>>(
      `/v1/roles/${id}`
    );
    return data.data ?? null;
  },

  async assignPermissions(id: string, permissionIds: string[]): Promise<Role> {
    const { data } = await getApi().post<ApiEnvelope<Role>>(
      `/v1/roles/${id}/permissions`,
      { permissionIds }
    );
    return data.data;
  },

  async removePermission(id: string, permissionId: string): Promise<Role> {
    const { data } = await getApi().delete<ApiEnvelope<Role>>(
      `/v1/roles/${id}/permissions`,
      { data: { permissionId } }
    );
    return data.data;
  },
};
