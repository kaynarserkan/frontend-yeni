# Pure CRM Frontend — Tema / Layout Kararları ve Notlar (Tek Kaynak)

Bu doküman, bu konuşmada aldığımız kararları ve “nasıl ilerleyeceğiz?” planını tek yerde tutmak için yazıldı.
Amaç: Aynı şeyleri tekrar konuşmadan devam etmek.

---

## 1) Proje Stack ve Temel Hedef

**Stack**
- Laravel Backend (değişmez / sadece entegre olunur)
- Vue 3 + TypeScript
- Vuetify 3 (UI framework / tema yönetimi)
- Vite

**Hedef**
- “Vuexy gibi ağır tema” yaklaşımını kopyalamadan; daha sade, kurumsal, hızlı bir CRM arayüzü üretmek.
- Önce her şeyi tek sayfada (Dashboard) toplayıp, sonra bileşenlere bölmek.

---

## 2) Modül Yapısı Kararı (Lead + User)

### 2.1 Pages / Components Standardı (SERT)

Karar (standart):
- `modules/<module>/pages` altındaki dosyalar **route entrypoint**’tir.
  - Page dosyası **ince** kalır.
  - Page içinde büyük UI blokları / uzun CSS / ağır etkileşim mantığı **yazılmaz**.
- Asıl UI ve davranış **component** katmanında olur ve 2 kategoriye ayrılır:

  1) **Shared (Proje geneli) Component’ler — TEK ADRES**
     - Konum: `src/components/`
     - Kural: Bir component’in gelecekte başka sayfada/modülde kullanılma ihtimali varsa **mutlaka** buraya konur.
     - Örnek: `DataTable.vue`, `KanbanBoard.vue`, `FiltersPanel.vue`, `FormDrawer.vue`

  2) **Module-specific (Sadece o modül) Component’ler**
     - Konum: `src/modules/<module>/components/`
     - Kural: Sadece ilgili modüle özel, başka yerde kullanılmayacak parçalar burada kalır.
     - Örnek: `lead/components/LeadStageBadge.vue`, `user/components/UserRolePills.vue`

- Page’in görevi:
  - Shared/module component’leri **compose etmek**
  - page-level state/param (route query, route params) yönetmek
  - sayfa bazlı layout ihtiyaçlarını belirlemek (ör. named-view/sidebar component seçmek)

Kural:
- Yeni bir ekran geliştirirken önce component üretilir,
- Page sadece onu render eder.

Amaç:
- Tekrarsız UI
- Kolay bakım
- Hızlı refactor (page bozulmadan component geliştirilebilir)
- Shared UI için tek “source of truth”: `src/components/`


Modül bazlı yapı tercih edildi:
- Her modül kendi `pages / components / services` alanına sahip olacak.
- **Pages**: route’a bağlanan ekranlar (tam sayfa).
- **Components**: sayfa içinde tekrar kullanılabilen parçalar.
- **services / api / repository**: modülün HTTP işleri.


Örnek yapı:

```
src/
modules/
  auth/
    pages/
      LoginView.vue
    components/
    services/
  dashboard/
    pages/
      DashboardView.vue
  lead/
    pages/
      LeadListView.vue
      LeadKanbanView.vue
      LeadDetailView.vue
    components/
      LeadFiltersPanel.vue
      LeadKanbanBoard.vue
      LeadTable.vue
    services/
      lead.api.ts
  user/
    pages/
      UsersListView.vue
      UserDetailView.vue
      UserCreateView.vue
    components/
      UserForm.vue
      UserTable.vue
    services/
      user.api.ts
```

> Not: “UsersListView.vue pages içinde olsun” kararı alındı: Ön yüzü nereden çalıştırdığımız net olsun.

---

## 3) URL / Route Kararı (Sayfa isimleri URL’i değiştirmez)

Sayfa dosya adı URL’i belirlemez.
URL’i **router** belirler.

Örnek:
- `http://localhost:5173/user`
- `path: '/user'`
- `component: UsersListView.vue`

---

## 4) Drawer Nedir?

**Drawer**: Ekranın sağından/solundan kayan panel.
- Create/Edit işlemleri için ayrı sayfa yerine tercih edilir.
- UX daha hızlıdır.

Karar:
- Drawer opsiyonel.
- Başta page → sonra drawer dönüşümü yapılabilir.

---

## 5) Tema Yaklaşımı: “Tek Kaynaktan Renk”

### 5.1 Vuetify Tema Yönetimi
- `src/plugins/vuetify.ts`
- `defaults` ile component ayarları

### 5.2 Global CSS’in Tema’yı Ezmemesi

Karar:
- Global renkler theme değişkenlerinden gelir.
- Sabit HEX minimum.

Örnek:
- `background: rgb(var(--v-theme-background));`
- `color: rgb(var(--v-theme-primary));`

### 5.3 UI Token Standardı (SERT)

Karar (standart):
- Component dosyalarında **tanımsız** hiçbir değer kullanılmaz:
  - `font-size: 12px` ❌
  - `padding: 24px` ❌
  - `color: #123456` ❌
- Tüm bu değerler sadece şu kaynaklardan gelir:
  1) `src/style.css` içindeki `:root` token’ları (`--crm-*`)
  2) Vuetify theme token’ları (`--v-theme-*`)
  3) `src/plugins/vuetify.ts` `defaults` ayarları
- Yeni bir “sayı” ihtiyacı doğarsa:
  - önce `:root` içine token eklenir,
  - sonra component o token’ı kullanır.

Amaç:
- Tutarlı UI
- Kolay tema değişimi
- Minimum tekrar

---

## 6) Renk Paleti Kararları

Başlangıç:
- Dark: `#061E29`
- Primary: `#1D546D`
- Accent: `#5F9598`
- BG: `#F3F4F4`

Yeni:
- Background: `#F5FBE6`
- Primary: `#215E61`
- Secondary: `#233D4D`
- Accent: `#FE7F2D`

Karar:
- Mavi ağırlık
- Accent sadece CTA

---

## 7) Font / Shadow / Radius

- Radius: yok
- Shadow: blur
- Font: Inter + system

---

## 8) Layout Kararı

- `v-app-bar`
- `v-navigation-drawer`
- `v-main`

Logo:
- `public/logo.png`
- Header açık renk

---

## 9) Dashboard Yaklaşımı

- Önce tek parça
- Sonra component extraction

---

## 10) Dashboard İçerik

- DataTable
- Mini chart
- Quick list

---

## 11) Login Sayfası Notu

- Autofill
- Vuetify field ayarları
- Global CSS

Karar:
- En son polish

---

## 12) Repo / Git

- `.env` gitignore
- `.env.example` repo’da

---

## 13) İleri Adımlar

1. Tema kontrol
2. Layout stabilizasyon
3. UI bileşenleri
4. Route’lar
5. Component extraction

---

## 14) Dosya Referansları

- `src/plugins/vuetify.ts`
- `src/style.css`
- `src/modules/dashboard/pages/DashboardView.vue`
- `public/logo.png`

---

## 15) Prensip

- Hızlı prototip → standardizasyon
- Tek kaynak tema
- Minimal global CSS
- Kurumsal UI
