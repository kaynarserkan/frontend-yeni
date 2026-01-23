import { api } from "@/core/http/api.client";

export type Permission = {
  id: number;
  name: string;
  guard_name?: string;
};

export type Role = {
  id: number;
  name: string;
  // backend role detail/list içinde permissions dönebiliyor
  permissions?: Permission[];
};

export type Department = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active?: boolean;
  sort_order?: number | null;
};

export type User = {
  id: number;
  name: string;
  email: string;

  profile?: any;
  roles: Role[];
  permissions: Permission[];
  departments: Department[];
};

export type Paginated<T> = {
  data: T[];
  meta?: Record<string, any>;
  links?: Record<string, any>;
};

export type UserCreatePayload = {
  name: string;
  email: string;
  password: string;
  roles?: string[];
};

export type UserUpdatePayload = {
  name?: string;
  email?: string;
  password?: string;
  roles?: string[];
};

export const listUsers = async (
  params?: Record<string, any>,
): Promise<Paginated<User>> => {
  const res = await api.get("/user-service/users", { params });
  return res.data as Paginated<User>;
};

export const getUser = async (id: number | string): Promise<User> => {
  const res = await api.get(`/user-service/users/${id}`);
  return res.data as User;
};

export const createUser = async (payload: UserCreatePayload): Promise<User> => {
  const res = await api.post("/user-service/users", payload);
  return res.data as User;
};

export const updateUser = async (
  id: number | string,
  payload: UserUpdatePayload,
): Promise<User> => {
  const res = await api.put(`/user-service/users/${id}`, payload);
  return res.data as User;
};

export const deleteUser = async (id: number | string): Promise<User> => {
  const res = await api.delete(`/user-service/users/${id}`);
  return res.data as User;
};

// User roles sync
export const syncUserRoles = async (
  id: number | string,
  roles: string[],
): Promise<User> => {
  const res = await api.post(`/user-service/users/${id}/roles/sync`, { roles });
  return res.data as User;
};

// User permissions sync
export const syncUserPermissions = async (
  id: number | string,
  permissions: string[],
): Promise<User> => {
  const res = await api.post(`/user-service/users/${id}/permissions/sync`, {
    permissions,
  });
  return res.data as User;
};

// User departments
export const listUserDepartments = async (
  id: number | string,
): Promise<{ data: Department[] }> => {
  const res = await api.get(`/user-service/users/${id}/departments`);
  return res.data as { data: Department[] };
};

export const syncUserDepartments = async (
  id: number | string,
  departments: Array<number | string>,
): Promise<Department[]> => {
  const res = await api.post(`/user-service/users/${id}/departments`, {
    departments,
  });
  return res.data as Department[];
};

// Profile deactivate
export const deactivateUserProfile = async (
  id: number | string,
): Promise<any> => {
  const res = await api.patch(`/user-service/users/${id}/profile/deactivate`);
  return res.data;
};
