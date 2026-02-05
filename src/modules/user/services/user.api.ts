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

export type UserProfile = {
  id: number;
  user_id: number;

  title?: string | null;
  specialty?: string | null;
  skills?: string[] | null;

  daily_capacity?: number | null;

  country_id?: number | null;
  state_id?: number | null;
  city_id?: number | null;

  address_line?: string | null;
  phone_number?: string | null;

  national_id?: string | null;
  passport_id?: string | null;

  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;

  is_active?: boolean;

  // backend resource bazen relation’ları da döndürebilir
  country?: any;
  state?: any;
  city?: any;

  created_at?: string;
  updated_at?: string;
  created_at_local?: string;
  updated_at_local?: string;

  // olası avatar alanları (backend’e göre değişebilir)
  avatar_url?: string | null;
};

export type User = {
  id: number;
  name: string;
  email: string;

  // bazı endpoint’ler profile’ı user içine gömülü döndürebilir
  profile?: UserProfile | null;

  // bazı backendler user’da direkt avatar_url döndürür
  avatar_url?: string | null;

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

// =====================
// User profile (user_profiles)
// =====================
export const getUserProfile = async (
  id: number | string,
): Promise<UserProfile | null> => {
  const res = await api.get(`/user-service/users/${id}/profile`);
  // bazı stoplight çıktısında array gibi görünmüş; biz güvenli parse edelim
  const data = res.data;
  if (!data) return null;
  if (Array.isArray(data)) return (data[0] ?? null) as any;
  return data as UserProfile;
};

export type UserProfileUpdatePayload = {
  title?: string | null;
  specialty?: string | null;
  skills?: string[] | null;
  daily_capacity?: number | null;

  country_id?: number | null;
  state_id?: number | null;
  city_id?: number | null;

  address_line?: string | null;
  phone_number?: string | null;
  national_id?: string | null;
  passport_id?: string | null;

  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;

  is_active?: boolean;
};

export const updateUserProfile = async (
  id: number | string,
  payload: UserProfileUpdatePayload,
): Promise<UserProfile> => {
  // Backend PUT/PATCH hangisini kullanıyorsa burada tek yerden değiştirirsin.
  // Ben önce PUT deneyeyim, 405/404 gibi durumlarda PATCH fallback yapayım.
  try {
    const res = await api.put(`/user-service/users/${id}/profile`, payload);
    return res.data as UserProfile;
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 404 || status === 405) {
      const res = await api.patch(`/user-service/users/${id}/profile`, payload);
      return res.data as UserProfile;
    }
    throw e;
  }
};

// =====================
// Avatar (endpoint backend’e göre değişebilir)
// =====================
// Varsayılan: POST multipart -> /users/{id}/avatar , DELETE -> /users/{id}/avatar
export const uploadUserAvatar = async (
  id: number | string,
  file: File,
): Promise<any> => {
  const fd = new FormData();
  fd.append("avatar", file);

  // Content-Type set etme; browser boundary’yi doğru atar
  try {
    const res = await api.post(`/user-service/users/${id}/avatar`, fd);
    return res.data;
  } catch (e: any) {
    // alternatif isim: photo
    const status = e?.response?.status;
    if (status === 422) throw e;

    const fd2 = new FormData();
    fd2.append("photo", file);
    const res2 = await api.post(`/user-service/users/${id}/avatar`, fd2);
    return res2.data;
  }
};

export const deleteUserAvatar = async (id: number | string): Promise<any> => {
  const res = await api.delete(`/user-service/users/${id}/avatar`);
  return res.data;
};

