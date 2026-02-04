import { api } from "@/core/http/api.client";

export type RolePermission = {
  id: number;
  name: string;
  guard_name?: string;
};

export type Role = {
  id: number;
  name: string; // slug (kkk_kkk)
  title?: string | null; // ekranda görünen (kkk kkk)
  permissions: RolePermission[];
};

export type RoleUpsertPayload = {
  name: string;
  title?: string | null;
  permissions?: string[];
};

const BASE = "/user-service/roles";

export const listRoles = async (): Promise<Role[]> => {
  const res = await api.get(BASE);
  return res.data?.data ?? [];
};

export const getRole = async (id: number | string): Promise<Role> => {
  const res = await api.get(`${BASE}/${id}`);
  return res.data as Role;
};

export const createRole = async (payload: RoleUpsertPayload): Promise<Role> => {
  const res = await api.post(BASE, payload);
  return res.data as Role;
};

export const updateRole = async (
  id: number | string,
  payload: RoleUpsertPayload,
): Promise<Role> => {
  const res = await api.put(`${BASE}/${id}`, payload);
  return res.data as Role;
};

export const deleteRole = async (id: number | string): Promise<Role> => {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data as Role;
};

export const syncRolePermissions = async (
  id: number | string,
  permissions: string[],
): Promise<Role> => {
  const res = await api.post(`${BASE}/${id}/permissions/sync`, { permissions });
  return res.data as Role;
};
