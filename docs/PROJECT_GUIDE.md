# PROJECT_GUIDE.md — CRM (Laravel Backend + Vue 3 + TS + Vuetify) Frontend Guide

Bu doküman, sıfırdan yazdığımız CRM panelin **tek kaynak (single source of truth)** rehberidir.
Amaç: **en az kodla**, **en optimize**, **disiplinli**, **ürünleşebilir (multi-tenant)** bir panel geliştirmek.

## 0) Ürün Özeti (Business)
Biz sağlık firmasıyız. Panel şu akışları hedefler:
- Lead yönetimi (potansiyel hasta)
- Takip / not / teklif / görev
- Randevu (Appointment)
- Hasta kartı (Patient)
- Ürün olarak farklı şirketlerin (tenant) kullanımı: aynı panel, farklı şirket verisi

## 1) Ana Prensipler (Sert Kurallar)
1) **Gereksiz hiçbir şey ekleme.**
   - Yeni bir kütüphane eklemeden önce: “bunu shared component ile çözebilir miyiz?”
2) **Tekrarlayan her şey shared’e taşınır.**
   - Aynı UI kalıbı 2. kez yazılıyorsa artık “shared component” olmalıdır.
3) **Sayfa dosyaları ince kalır.**
   - Sayfa sadece “ne gösteriyorum / hangi endpoint / hangi kolon” gibi kararları içerir.
   - Ağır iş: shared component + composable + store içinde olur.
4) **Her modül kendi içinde yaşar.**
   - Lead ile ilgili her şey leads modülünde; user ile ilgili her şey users modülünde.
5) **Performans default.**
   - Route’lar lazy-load.
   - Ağır bileşenler (tablo, drawer, editor, chart) gerektiğinde yüklenir.
   
6) **UI/Component Standardına Sadakat (SERT)**
- Bu projede tasarım tutarlılığı “şansa” bırakılmaz.
- `shared/components` altında tanımlanan standart bileşenler (DataTable, FormDrawer, Field, PageHeader, ConfirmDialog, EmptyState vb.)
  **mecburidir**.
- Aynı ihtiyacı karşılayan yeni component yazmak **yasaktır**.
- Yeni bir UI ihtiyacı çıkarsa:
  1) Önce mevcut shared component genişletilir,
  2) Olmuyorsa yeni component yalnızca `shared/components` altına eklenir ve
     **standart** haline getirilir.
- Modül içinde “kendi özel butonum / kendi özel dialogum / kendi özel tablo yapım” yaklaşımı **kabul edilmez**.


## 2) Teknoloji Kararı ve Nedenleri
### 2.1 UI: Vuetify (Disiplinli Kullanım)
Vuetify seçiyoruz çünkü:
- Form, dialog, layout işleri hızlı çıkar
- Vue ile uyumu yüksek

Dikkat:
- “Vuexy gibi şişmemek” için **component standardı** şart:
  - Liste: her yerde **tek DataTable**
  - Form: her yerde **tek FormDrawer**
  - Field: her yerde **tek Field wrapper**
- Ağır sayfalar / büyük tablolar: lazy-load + pagination şart

### 2.2 State: Pinia
- Modül bazlı store (leadsStore, usersStore vb.)
- Global store: auth / tenant / i18n / ui

### 2.3 API: Axios + tek client
- Token + Tenant + Dil header’ı otomatik gidecek
- Sayfalarda “header yazmak” yasak (unutuluyor, bug çıkarıyor)

### 2.4 Tipler: OpenAPI → TypeScript types
- OpenAPI’dan type üretip request/response hatalarını azaltacağız
- “Az kod, az hata, hızlı geliştirme” için kritik

## 3) Dosya ve Klasör Düzeni (Değişmez)
Amaç: “Bir dosya nerde?” sorusu bitmesi.

Önerilen yapı:
src/
  core/
    auth/          # token, login/logout, guards
    tenant/        # tenant seçimi, persist
    i18n/          # dil, seçili dil persist
    http/          # axios client, interceptors
    permissions/   # permission helpers, route guards
    layout/        # master layout (sidebar/topbar)
  modules/
    auth/          # Login page (UI) + auth flows (sadece ekran)
    users/
      pages/       # route'a bağlanan ekranlar (UsersList, UserDetail vb.)
      components/  # sadece users modülüne özel parçalar
      api/         # users.api.ts, users.types.ts
      store/       # (gerekiyorsa) users.store.ts
    leads/
      pages/
      components/
      api/
      store/
    appointments/
      pages/
      components/
      api/
      store/
    patients/
      pages/
      components/
      api/
      store/
  shared/
    components/    # DataTable, FormDrawer, Field, PageHeader, ConfirmDialog...
    composables/   # usePagination, useFilters, useAsyncState...
    utils/         # formatters, normalizers
    types/         # ortak tipler (UI-level)
  router/
    index.ts       # route toplama + guards
  styles/
  main.ts
  App.vue

Kural:
- `modules/<module>/pages` sadece **route'a bağlanan ekranlar** içindir (URL buradan değil, router'dan gelir).
- `modules/<module>/components` sadece **o modüle özel** parçalardır.
- 2+ modülde tekrar eden her UI kalıbı **zorunlu olarak** `shared/components` içine taşınır.
- `shared/components` dışındaki “kendi özel tablo/dialog/form” yaklaşımı **yasaktır** (tutarlılık kuralı).


## 4) Geliştirme Sırası (Roadmap)
Sıra net:
1) **Auth + Login sayfası**
2) **Master Layout** (sidebar/topbar)
3) **Core altyapı**
   - API client (token + tenant + language)
   - Router guards
   - Permission altyapısı
4) **User/Role/Permission modülü**
5) **Lead modülü**
6) **Appointment modülü**
7) **Patient modülü**

## 5) Core Kurallar (Uygulamanın Omurgası)
### 5.1 Auth (Token)
- Login → token alınır → güvenli şekilde saklanır
- Her API çağrısına otomatik eklenir
- 401 → otomatik logout + login sayfasına yönlendirme

### 5.2 Tenant (Çok Şirket)
- Sistem “seçili tenant” olmadan API çağrısı yapmaz
- Tenant bilgisi state + persist (refresh sonrası kaybolmaz)
- Tenant değişince:
  - ilgili cache/istek state temizlenir
  - sayfa verileri yeniden çekilir

### 5.3 Dil (i18n)
- Seçili dil state + persist
- Her API çağrısına otomatik `Accept-Language` gider
- UI metinleri basit tutulur (gereksiz çeviri şişkinliği yok)

### 5.4 Yetkilendirme (Role/Permission)
- Route meta üzerinden izin istenir:
  - meta: { permission: 'leads.read' } gibi
- Menü item’ı izin yoksa görünmez
- Route erişimi izin yoksa 403 sayfası

## 6) “Az Kod Çok İş” Standard Bileşenler
Bu projede hızın anahtarı: aynı kalıpları tekrar etmemek.

### 6.1 DataTable (Tek Standart)
Her listede aynı DataTable kullanılır:
- pagination
- server-side fetch
- search
- filters
- loading / empty state
- action column (view/edit/delete)

Kural:
- Yeni bir liste sayfası = %80 DataTable ayarlarıdır.

### 6.2 FormDrawer (Tek Standart)
Create/Edit formları aynı yapı:
- sağdan açılan drawer (veya dialog)
- Form submit/cancel standardı
- Validation standardı

Kural:
- “Edit sayfası” ayrı route olmak zorunda değil.
- Liste + drawer yaklaşımı: daha hızlı ve daha tutarlı.

### 6.3 Field Wrapper (Tek Standart)
Form alanlarının hepsi aynı wrapper’dan geçer:
- label, hint, error, required, layout
- farklı input tipleri (text, select, date, phone) aynı “dil” ile görünür

## 7) API Kullanım Standardı
### 7.1 Tek Axios Client
- core/http içinde tek instance
- request interceptor:
  - token → Authorization
  - tenant → X-Tenant
  - language → Accept-Language
- response interceptor:
  - 401 → logout
  - 422 → form error map’e dönüştür

Kural:
- Sayfa içinde “axios.create” yok.
- Sayfa içinde “headers: { X-Tenant }” yok.

### 7.2 Endpoint organizasyonu
Her modülün kendi api dosyası olur:
- src/modules/leads/api.ts
- src/modules/users/api.ts
vb.

Kural:
- “API çağrısı” sayfada yapılmaz, modül api’sinde yapılır.

## 8) OpenAPI → TypeScript Tipleri
Amaç: backend ile aynı dili konuşmak, hatayı azaltmak.
- OpenAPI dosyasından types üretilir (otomatik)
- Request/Response tipleri bu types’tan alınır

Kural:
- “any” mümkün olduğunca yok.
- UI-level data gerekiyorsa shared/types içinde ayrı tip yapılır.

## 9) Router Standardı (Performans için)
- Tüm modül sayfaları lazy-load:
  - import() ile açılır
- Router dosyaları modülde durur:
  - modules/leads/routes.ts
- router/index.ts sadece “toplar”

Kural:
- Büyük sayfa bileşenleri tek chunk olmak zorunda değil; gerekiyorsa alt parçalar da lazy-load.

## 10) UI/UX Standardı (Panel Kalitesi)
- Her sayfa:
  - PageHeader (başlık + kısa açıklama + primary action)
  - Loading state
  - Empty state
  - Error state (kullanıcıya anlaşılır)

Kural:
- “Boş ekran” yasak. Her durumda kullanıcı ne olduğunu anlamalı.

## 11) Yeni Sayfa Eklerken Checklist (Kısa)
1) Hangi modül? (modules/xxx)
2) Route ekle (lazy)
3) API fonksiyonunu modül api.ts’ye ekle
4) Store gerekliyse modül store ekle
5) UI: PageHeader + DataTable veya FormDrawer kullan
6) Permission meta ekle
7) Loading/empty/error kontrol et

## 12) Kütüphane Ekleme Kuralı
Yeni bir paket eklemeden önce:
- Bunu shared component/composable ile çözebilir miyiz?
- Paket “uzun vadede” bakım çıkarır mı?
- Boyutu ve performans etkisi var mı?

Karar:
- “Gereksiz paket” = proje şişmesi = Vuexy problemi

---

## Ek: Terimler (Kısa ve Basit)
- Tenant: Paneli kullanan şirket. (A şirketi / B şirketi)
- Lead: Potansiyel hasta kaydı
- Patient: Kazanılmış hasta + hasta kartı
- Drawer: Sağdan açılan form paneli. Genelde “Create/Edit” işlemleri ayrı sayfa yerine Drawer içinde yapılır (az route, az sayfa, hızlı UX).
- Shared component: Her modülde kullanılan ortak parça
