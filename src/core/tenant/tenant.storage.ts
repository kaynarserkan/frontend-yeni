const TENANT_KEY = 'tenantKey'

export const getTenantKey = (): string => {
  return localStorage.getItem(TENANT_KEY) ?? ''
}

export const setTenantKey = (tenantKey: string): void => {
  localStorage.setItem(TENANT_KEY, tenantKey)
}
