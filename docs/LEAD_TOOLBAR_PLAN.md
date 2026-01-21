# LEAD Toolbar Plan — UI Layout & Menu (Backend Bağlantısı Olmadan)

Plan çok iyi. Şu an en doğru hamle: **backend’e bağlamadan** sadece **toolbar “layout + menu” kabuğunu** standardize edip, üstüne de “ne yapacağız”ı anlatan **tek kaynak** bir guide yazmak. Sonra bu guide’ı tekrar okuttuğunda, toolbar’a hangi butonlar/aksiyonlar eklenecek, selection modunda ne değişecek, hepsini aynı dilden konuşacağız.

Bu doküman **kodsuzdur** ve sadece **UI iskeletini + davranış kurallarını** tanımlar.

---

## Dosya
`C:\dev\crm\frontend_pure\docs\LEAD_TOOLBAR_PLAN.md`

---

## 1) Amaç

- Lead ekranında Zoho benzeri toolbar.
- Şimdilik sadece **Layout** ve **Menu** (UI kabuğu).
- Backend bağlantıları **faz-2**’de yapılacak.

---

## 2) Toolbar Modları

- **Normal Mode (selection yok)**
- **Selection Mode (1+ lead seçili)**

> Her modda **layout aynıdır**, sadece içerik değişir.

---

## 3) Layout Şeması

Toolbar 3 bölgeye ayrılır:

- **Left:** Context (liste bağlamı / seçim özeti)
- **Center:** Görünüm ayarları (Layout / Sort)
- **Right:** Primary + Actions

---

## 4) UI Stub Listesi (Şimdilik yapılacaklar)

### Normal Mode

**Left**
- “All Leads” dropdown (placeholder)

**Center**
- “Layouts” dropdown (Standard / Compact)
- “Sort By” dropdown (Created / Updated)
- “Order” button (Asc / Desc — placeholder)

**Right**
- “Create Lead” (şimdilik sadece buton)
- “Actions” dropdown (Export / Import — placeholder)

---

### Selection Mode

**Left**
- “X selected” label (placeholder)
- “Clear” (placeholder)
- **Edit** butonu (Zoho benzeri)
- “Actions” dropdown  
  - Update  
  - Assign  
  - Delete  
  - Export  
  *(hepsi placeholder)*

**Center + Right**
- Şimdilik **gizli** ya da **disabled**  
  (Zoho gibi “selection varken sadeleşsin”)

---

## 5) Interaction Kuralları

- **Selection yokken:** Normal toolbar görünür.
- **Selection varken:**
  - “All Leads” yerine **Edit + Actions** görünür.
  - Sağ taraf opsiyonel olarak boş kalır.
- Tüm dropdown’lar şimdilik **dummy items** içerir.

---

## 6) Sonraki Faz (Backend’e bağlanınca)

- Her item için:
  - Permission
  - Endpoint
  - Payload notları  
  (bkz: `LEAD_BACKEND_GUIDE.md`)
- Bulk action davranışları (tekli / çoklu).

---

## 7) Kabul Kriterleri (UI)

- Toolbar yüksekliği Zoho hissi (daha kısa).
- Slot/prop düzeni temiz (DashboardView şişmez).
- Lead sayfasında **tek kaynak** toolbar.

---

## Not

Önce **sadece layout + menu**.  
Backend bağlantıları **faz-2**.

Bu doküman, ileride “toolbar neydi?” diye tekrar keşfetmemek için **tek kaynak**tır.
