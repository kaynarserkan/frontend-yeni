import { api } from "@/core/http/api.client";
import {
  extractDataArray,
  extractDataItem,
  extractMessage,
} from "@/utils/apiNormalize";

export type Department = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

export type DepartmentUpsertPayload = {
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  sort_order?: number | null;
};

export const listDepartments = async (): Promise<Department[]> => {
  const res = await api.get("/config-service/departments");
  return extractDataArray<Department>(res.data);
};

export const getDepartment = async (
  id: number | string,
): Promise<Department> => {
  const res = await api.get(`/config-service/departments/${id}`);
  return extractDataItem<Department>(res.data);
};

export const createDepartment = async (
  payload: DepartmentUpsertPayload,
): Promise<Department> => {
  const res = await api.post("/config-service/departments", payload);
  return extractDataItem<Department>(res.data);
};

export const updateDepartment = async (
  id: number | string,
  payload: DepartmentUpsertPayload,
): Promise<Department> => {
  const res = await api.put(`/config-service/departments/${id}`, payload);
  return extractDataItem<Department>(res.data);
};

export const deleteDepartment = async (
  id: number | string,
): Promise<{ message: string }> => {
  const res = await api.delete(`/config-service/departments/${id}`);

  // Bazı delete response'ları direkt {message}, bazıları {data:{message}}
  const msg =
    extractMessage(res.data) || extractMessage((res.data as any)?.data);

  return { message: msg || "OK" };
};
