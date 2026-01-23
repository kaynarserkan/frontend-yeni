import { api } from "@/core/http/api.client";

export type Permission = {
  id: number;
  name: string;
  guard_name?: string;
};

export const listPermissions = async (): Promise<Permission[]> => {
  const res = await api.get("/user-service/permissions");
  // backend genelde { data: [...] } dönüyor
  return Array.isArray(res.data?.data) ? (res.data.data as Permission[]) : [];
};
