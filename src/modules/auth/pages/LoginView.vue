<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/core/auth/auth.store'
import { useTenantStore } from '@/core/tenant/tenant.store'
import { api } from '@/core/http/api.client'

const router = useRouter()
const auth = useAuthStore()
const tenant = useTenantStore()

const tenantKey = ref(tenant.tenantKey)
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorText = ref('')

const extractToken = (payload: any): string => {
  return (
    payload?.access_token ??
    payload?.data?.access_token ??
    payload?.token ??
    payload?.data?.token ??
    ''
  )
}

const onSubmit = async () => {
  if (isLoading.value)
    return

  errorText.value = ''
  isLoading.value = true

  try {
    tenant.setTenant((tenantKey.value ?? '').trim())

    if (!tenant.tenantKey) {
      errorText.value = 'Tenant bilgisi boş olamaz.'
      return
    }

    const res = await api.post('/auth-service/login', {
      email: email.value,
      password: password.value,
    })

    const token = extractToken(res.data)

    if (!token) {
      errorText.value = 'Login başarılı görünüyor ama token bulunamadı.'
      return
    }

    auth.setToken(token)
    await router.push({ name: 'dashboard' })
  }
  catch (e: any) {
    errorText.value =
      e?.response?.data?.message ??
      e?.message ??
      'Login sırasında hata oluştu.'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <v-container fluid class="pa-0 h-100">
      <v-row no-gutters class="login-row">
        <!-- MOBILE HERO (md altı) -->
        <v-col cols="12" class="d-md-none">
          <div class="mobile-hero">
            <div class="hero-overlay hero-overlay--mobile">
              <div class="hero-title hero-title--mobile">
                Bring your ideas to life
              </div>
              <div class="hero-subtitle hero-subtitle--mobile">
                Çok kiracılı, güvenli ve hızlı CRM paneli
              </div>
            </div>
          </div>
        </v-col>

        <!-- SOL: FORM -->
        <v-col cols="12" md="5" class="form-col">
          <v-sheet class="form-card" rounded="xl" elevation="2" color="surface">
            <div class="d-flex align-center mb-6">
              <v-avatar size="40" class="me-3" color="surface" variant="flat">
                <v-img src="https://placehold.co/80x80?text=CRM" />
              </v-avatar>
              <div>
                <div class="brand-title">
                  Pure CRM
                </div>
                <div class="brand-subtitle">
                  Admin Panel
                </div>
              </div>
            </div>

            <div class="headline">
              Welcome back
            </div>
            <div class="subline mb-6">
              Lütfen giriş bilgilerinizi girin
            </div>

            <v-alert
              v-if="errorText"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              {{ errorText }}
            </v-alert>

            <v-form @submit.prevent="onSubmit">
              <v-text-field
                v-model="tenantKey"
                label="Tenant"
                placeholder="reginamed"
                autocomplete="organization"
                prepend-inner-icon="mdi-domain"
                variant="outlined"
                bg-color="surface"
                color="primary"
                class="mb-4"
              />

              <v-text-field
  v-model="email"
  label="E-mail"
  type="email"
  autocomplete="username"
  prepend-inner-icon="mdi-email-outline"
  variant="outlined"
  bg-color="surface"
  color="primary"
  class="mb-4"
/>

<v-text-field
  v-model="password"
  label="Password"
  type="password"
  autocomplete="current-password"
  prepend-inner-icon="mdi-lock-outline"
  variant="outlined"
  bg-color="surface"
  color="primary"
  class="mb-6"
/>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="isLoading"
              >
                Sign in
              </v-btn>
            </v-form>
          </v-sheet>
        </v-col>

        <!-- SAĞ: HERO (md ve üstü) -->
        <v-col cols="12" md="7" class="d-none d-md-flex hero-col">
          <div class="hero">
            <div class="hero-overlay">
              <div class="hero-title">
                Bring your ideas to life
              </div>
              <div class="hero-subtitle">
                Çok kiracılı, güvenli ve hızlı CRM paneli
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--crm-bg);
}

.login-row {
  min-height: 100vh;
}

/* LEFT */
.form-col {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.form-card {
  width: 100%;
  max-width: 440px;
  padding: 32px;
}

.brand-title {
  font-weight: 800;
  color: var(--crm-text);
  line-height: 1.1;
}

.brand-subtitle {
  font-size: 12px;
  color: var(--crm-text-muted);
}

.headline {
  font-size: 28px;
  font-weight: 800;
  color: var(--crm-text);
  line-height: 1.1;
}

.subline {
  color: var(--crm-text-muted);
  font-size: 14px;
}

/* HERO (desktop) */
.hero-col {
  min-height: 100vh;
}

.hero {
  width: 100%;
  min-height: 100vh;
  background-image:
    linear-gradient(120deg, rgba(6, 30, 41, 0.65), rgba(29, 84, 109, 0.25)),
    url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e');
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  left: 40px;
  bottom: 40px;
  right: 40px;
  max-width: 520px;
  padding: 24px;
  border-radius: 18px;
  background: rgba(6, 30, 41, 0.55);
  backdrop-filter: blur(6px);
}

.hero-title {
  font-size: 34px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.1;
}

.hero-subtitle {
  margin-top: 8px;
  color: rgba(243, 244, 244, 0.9);
}

/* MOBILE HERO */
.mobile-hero {
  height: 220px;
  background-image:
    linear-gradient(120deg, rgba(6, 30, 41, 0.70), rgba(95, 149, 152, 0.20)),
    url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e');
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay--mobile {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  padding: 16px;
  border-radius: 16px;
}

.hero-title--mobile {
  font-size: 22px;
}

.hero-subtitle--mobile {
  font-size: 13px;
}
</style>
