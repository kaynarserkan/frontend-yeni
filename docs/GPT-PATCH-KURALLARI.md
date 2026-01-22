# GPT PATCH KURALLARI (SERT)

Bu doküman, ChatGPT’nin bu projede **kod / config / doküman** üretirken
uyması zorunlu kuralları tanımlar. Kurallar ihlal edilirse üretilen çıktı
**GEÇERSİZ** kabul edilir.

---

## 0) Altın Kurallar

### 0.0) Dosya Sağlama Zorunluluğu (SERT)

- **Uygulandı Say Kuralı (SERT):**
  ChatGPT’nin verdiği tüm patch ve doküman değişiklikleri için,
  kullanıcı **“UYGULAMADIM” demedikçe** değişiklikler **UYGULANMIŞ KABUL EDİLİR**
  ve sonraki yanıtlarda **kaynak gerçeklik** olarak kullanılır.
  - Aynı kodu tekrar üretmek **YASAKTIR**
  - Önceki çıktı var sayılır ve ona göre devam edilir
  - Bu kural ihlal edilirse sonraki çıktı **GEÇERSİZ** sayılır

- **Varsayım Yasağı (SERT):**
  Kod / patch / rota / endpoint / JS üretmeden önce ilgili dosyaların
  **tam ve güncel hali** paylaşılmalıdır.
  - “Muhtemelen”, “büyük ihtimalle”, “şöyle olmalı” ifadeleri **YASAKTIR**
  - Dosya görülmeden üretim **YAPILMAZ**

- **Mevcut Dosya İçeriği Görmeden Patch Yasağı (SERT):**
  İlgili dosya projede “zaten var” olsa bile, ChatGPT o dosyanın **tam ve güncel içeriğini görmeden**
  **kod/patch/config güncellemesi veremez**.
  - Özellikle config dosyaları (ör: `vite.config.*`, `tsconfig.*`, `eslint`, `env` vb.) için:
    - dosyanın tamamı görülmeden öneri/patch **YAPILMAZ**
    - “muhtemelen böyledir” yaklaşımı **YASAKTIR**
  - Bu kural ihlal edilirse üretilen çıktı **GEÇERSİZ** kabul edilir.

- Dosya sağlanmadan üretilen her çıktı **GEÇERSİZ**dir

---

### 0.1) Backend Değişmezlik Kuralı (SERT)

- **Backend dosyaları DEĞİŞTİRİLEMEZ.**
  - Backend (Laravel / PHP) dosyaları yalnızca **okunur / referans** amaçlıdır.
  - ChatGPT, backend için:
    - kod yazamaz
    - patch üretemez
    - refactor öneremez
    - yeni command / schedule / observer ekleyemez
- Tüm **aktif geliştirme, kural, işleyiş ve davranış değişiklikleri**
  **SADECE frontend dosyaları** üzerinden yapılır.
- Backend ile ilgili her talep:
  - yalnızca **mevcut davranışı açıklama**
  - **neden çalışmadığını analiz etme**
  - **frontend’den nasıl tetikleneceğini tarif etme**
    ile sınırlıdır.
- Bu kural ihlal edilirse üretilen çıktı **GEÇERSİZ** kabul edilir.

## 1) İlk Mesaj Kuralı (SERT)

Bir ekran / özellik / bugfix istendiğinde ChatGPT **tek seferde** şu dosyaları ister:

1. Ana ekran dosyası (Blade / Vue / Component)
2. Bağlı child component’ler
3. JS / Service / API client dosyaları
4. İlgili route dosyaları
5. Controller / Service / Handler
6. Bağlı ekranların eş dosyaları

Dosyalar gelmeden üretim yapılmaz.

---

## 2) Patch Sunum Biçimi (SERT)

- **Diff / Yama formatları YASAKTIR**
  - `+ / -`
  - unified diff
  - git patch

- Patch **zorunlu format**:
  - **Dosya yolu**
  - **Çapa (başlık / fonksiyon imzası / net hedef)**
  - **Bul:** (yalnızca hedefi bulduracak kısa satır veya imza)
  - **Yerine koy:** (çalışır, TAM BLOK)

- “Şuraya ekle”, “buradan sonra” gibi muğlak anlatım **YASAKTIR**

---

## 3) Tam Blok ve Bağlam Koruma (SERT)

- Patch verilen bölüm **tam ve çalışır blok** olmalıdır
- Mevcut bloğun:
  - öncesi
  - sonrası
  - event handler’ları
  - init akışı
    eksiltilmeden korunur
- Eksik satır bırakmak **YASAKTIR**

---

## 4) Önceki Sürüme Sadakat (SERT)

- Var olan:
  - fonksiyon adları
  - imzalar
  - değişkenler
  - event / emit isimleri
    **DEĞİŞTİRİLEMEZ**
- Gerekirse yalnızca **ek guard / doğrulama** eklenir

### 4.1) Snake_case Key Tırnak Zorunluluğu (SERT)

- Bu projede ESLint kuralları nedeniyle `snake_case` objecik key'leri **çıplak** yazılınca hata/uyarı oluşabilir.
- Bu yüzden `snake_case` key'ler **MUTLAKA string key** olarak yazılır:
  - ✅ `'national_id': value`
  - ✅ `'emergency_contact_phone': value`
  - ❌ `national_id: value`
- ChatGPT, `snake_case` key içeren her yeni obje/payload çıktısında bu formatı **zorunlu** uygular.
- Bu kural ihlal edilirse üretilen çıktı **GEÇERSİZ** kabul edilir.

---

## 5) Eski Blok Tekrarı Yasağı (SERT)

- Güncellenen bir fonksiyon/handler için çıktı **şu formatta** verilir:
  - `Fonksiyon/İmza satırı` + `// bloğunun tamamı` notu
  - `Yerine koy:` altında **aynı imza ile yeni TAM gövde**

- **Örnek format (zorunlu):**
  - `const onCancel = () => { // bloğunun tamamı`
  - `Yerine koy:`
    - `const onCancel = () => { ... }` (tam gövde)

- `Bul:` kısmında:
  - **eski gövde ASLA yazılmaz**
  - yalnızca hedefi bulduracak **kısa imza/başlık satırı** yazılır
  - ör: `const onCancel = () => { // bloğunun tamamı`
  - veya: `function onCancel() { // bloğunun tamamı`

- `Yerine koy:` kısmında:
  - aynı imza korunur
  - **yeni TAM gövde** eksiksiz verilir
  - yarım blok / parçalı satır bırakmak **YASAKTIR**

### 5.1) Style Bloğu Patch Kuralı (SERT)

- `<style>` değişikliklerinde **Bul kısmına eski style bloğunun tamamı ASLA yazılmaz.**
- Style patch formatı zorunlu:
  - **Çapa:** `<style scoped>` veya `<style>` // style bloğunun tamamı
  - **Bul:** sadece `<style scoped>` (veya `<style>`) satırı
  - **Yerine koy:** komple yeni `<style ...> ... </style>` bloğu
- Eski style’ı “Bul” içine kopyalamak **YASAKTIR**.
- Bu kural ihlal edilirse çıktı **GEÇERSİZ** kabul edilir.

- Doküman/guide dosyalarında:
  - dosyanın tamamı **ASLA** yeniden yazılmaz
  - yalnızca:
    - güncellenecek bölümün **başlığı/çapası**
    - ilgili **eklenecek maddeler**
    - ve **hangi satırdan/bölümden sonra ekleneceği**
      net biçimde verilir

---

## 6) Atomik Değişiklik Kuralı

- Tek mesaj = tek odak
- Alakasız refactor / temizlik **YASAK**
- Mesaj başına **en fazla 6 değişiklik**
- Kapsam büyürse parçalara bölünür

---

## 7) Yan Etki Kontrolü (SERT)

Patch aşağıdakileri bozmamalıdır:

- auth / tenant / csrf
- mevcut event listener’lar
- init ve lifecycle akışı
- header / interceptor mantığı

Şüphe varsa üretim DURUR ve ek dosya istenir.

---

## 8) Test Notu Zorunluluğu

Her patch sonunda **en az 3 maddelik Hızlı Test** yazılır.

Örnek:

- İlgili ekran açılıyor mu?
- API çağrısı 200 dönüyor mu?
- Console / log hatası var mı?

---

## 9) Route ve Endpoint Kuralları

- Route **ASLA varsayılmaz**
- `routes/*.php` dosyası görülmeden:
  - route
  - middleware
  - prefix
    önerilemez
- Varsayılan kabul edilen her route **GEÇERSİZ**dir

---

## 10) Güvenlik ve Risk

- Destructive komutlar **YASAK**
  - `migrate:fresh`
  - `db:wipe`
- Sistem bilgisi güncellenirse sohbet içinde belirtilir
- Doğruluk > hız

---

## 11) Markdown Standartları (SERT)

- Tüm MD çıktıları **geçerli Markdown** olmalıdır
- Başlıklar, listeler ve kod blokları düzgün olmalıdır
- Açıklama/yorum eklenmez
- Sadece istenen içerik verilir

## 11.1) Markdown (MD) Üretim Standardı — EK (SERT)

Bu projede ChatGPT tarafından üretilen **tüm Markdown içerikleri** aşağıdaki kurallara **zorunlu** olarak uyar.

### Kural 1 — Tek Code Block Zorunluluğu (SERT)

- `.md` dosyasına yapıştırılacak içerik **TEK BİR code block** içinde verilir.
- Aynı cevapta:
  - birden fazla code block
  - code block + düz metin karışımı
    **YASAKTIR**.
- Markdown içeriği **ham metin** olarak sunulur, render edilmeye çalışılmaz.

### Kural 2 — İç İçe Code Fence YASAĞI (SERT)

- Markdown içeriği **başka bir code fence (` ``` `)** içine ALINMAZ.
- Şu kullanım **KESİNLİKLE YASAKTIR**:
  - ```md

    ```
  - ```ts

    ```
  - ```js

    ```
- MD dosyası, editör tarafından **doğal markdown** olarak parse edilmelidir.

### Kural 3 — Akış Bozan Metin YASAĞI (SERT)

- Code block dışında:
  - açıklama
  - başlık
  - yorum
  - yönlendirme
    **YAZILMAZ**.
- “Aşağıdaki gibi”, “şimdi bunu ekle” vb. ifadeler **KULLANILMAZ**.

### Kural 4 — Kopyala-Yapıştır Güvencesi (SERT)

- Üretilen MD içerik:
  - `.md` dosyasına **doğrudan yapıştırıldığında**
  - hiçbir bölümünde format bozulması
  - markdown’dan düz metne düşme
  - başlık kayması
    **YAŞATMAMALIDIR**.

### İhlal Durumu

- Bu standartlara uymayan Markdown çıktıları **GEÇERSİZ** kabul edilir.
- Kullanıcı “md bozuk” dediği anda:
  - önceki çıktı iptal edilir
  - yeni çıktı **bu stand**
