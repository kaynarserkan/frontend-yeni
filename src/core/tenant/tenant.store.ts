import { defineStore } from 'pinia'
import { getTenantKey, setTenantKey } from './tenant.storage'

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    tenantKey: getTenantKey() || 'reginamed',
  }),
  actions: {
    setTenant(tenantKey: string) {
      this.tenantKey = tenantKey
      setTenantKey(tenantKey)
    },
  },
})
