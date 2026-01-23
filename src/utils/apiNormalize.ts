// apiNormalize.ts (NEW FILE)
// CRM backend response normalizer helpers.
// Amaç: API response shape (array vs {data:[]}) değişse bile UI kırılmasın.

export const extractDataArray = <T = any>(payload: any): T[] => {
  if (!payload) return [];

  // Axios res.data zaten payload olarak gelir.
  // 1) Direkt array
  if (Array.isArray(payload)) return payload as T[];

  // 2) { data: [...] }
  if (Array.isArray(payload?.data)) return payload.data as T[];

  // 3) { data: { data: [...] } } (paginator / nested)
  if (Array.isArray(payload?.data?.data)) return payload.data.data as T[];

  return [];
};

export const extractDataItem = <T = any>(payload: any): T => {
  if (!payload) return payload as T;

  // 1) { data: {...} }
  if (
    payload &&
    typeof payload === "object" &&
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
  )
    return payload.data as T;

  // 2) Direkt object
  return payload as T;
};

export const extractMessage = (payload: any): string => {
  const msg = payload?.message;
  return typeof msg === "string" ? msg : "";
};
