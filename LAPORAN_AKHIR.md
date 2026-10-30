# LAPORAN AKHIR — MERCHVERSE: AUDIT, PERBAIKAN KERANJANG, ALUR CUSTOM T-SHIRT, DAN RESPONSIVITAS

Tanggal: 2026-10-24
Proyek: MerchVerse (prototype pra-UTS) — metal-inspired band merch store, THE SKIP
Lingkungan: PHP native, XAMPP (`/c/xampp/php/php.exe -S localhost:8000`), localStorage sebagai penyimpanan transaksi
Git: branch `master`, commit terakhir `76a3b5e`

---

## 1. Ringkasan Eksekusi

Sebelum perubahan apapun dilakukan, dilakukan backup awal (`e8f33f8` — commit awal sebelum audit) berikut merupakan branch `master` kembali ke keadaan kontrol version.

Tahapannya:
1. Audit fungsi prototype (baca kode, tidak mengubah business rule).
2. Perbaikan markup keranjang navbar (prioritas pertama) — sudah committed `b892cb9`.
3. Perbaikan alur Custom T-Shirt — sudah committed `9fca469`.
4. Verifikasi lint semua PHP & JS — lulus.
5. Verifikasi semua halaman merespon HTTP 200 — lulus.
6. TEST_CHECKLIST.md diisi — sudah committed `76a3b5e`.
7. Laporan akhir ini.

Tidak ada backend baru, tidak ada dependensi baru, tidak ada perubahan business rule atau id/class JS. Semua teks dalam Bahasa Indonesia.

---

## 2. Hasil Audit Fungsi Prototype

Audit dilakukan tanpa mengubah kode asli. Temuan utama:

### 2.1 Apa yang sudah benar
- Sesi/auth disimpan di `localStorage` kunci `mv_auth`, daftar user di `mv_users`.
- Keranjang di `mv_cart`, pesanan di `mv_orders`, permintaan custom di `mv_requests`, produk master di `mv_products`.
- `Store.customProducts()` memfilter `product_type === "custom_base"`, `Store.officialProducts()` memfilter `"official"`.
- Biaya cetak custom (`customPrintFee`) = 35.000 di `assets/js/data.js`.
- Semua file PHP lulus `php -l` (tanpa syntax error).
- Semua file JS utama (`app.js`, `data.js`, `admin.js`) lulus `node --check`.
- Semua halaman (index, shop, detail, cart, checkout, login, register, custom studio, custom status, orders, admin dashboard/orders/products/custom-requests/payments/shipping) merespon HTTP 200 via `curl`.

### 2.2 Temuan yang diperbaiki
| Masalah | Lokasi | Tindakan |
|---------|--------|----------|
| Duplikat `id="cart-count"` pada navbar (desktop + mobile) | `includes/header.php` | Disatukan menjadi satu `id="cart-count"` di pojok kanan (`.nav-actions`); `id="cart-count-mobile` dihapus |
| `aria-label` berisi HTML (`<span>`) bukan teks | `includes/header.php` | Diubah menjadi teks biasa `"Keranjang, jumlah 0 item"` |
| `#cart-count-mobile` tidak ada atau tidak ter-update | `assets/js/app.js` | `Cart.dispatch()` diperbaiki hanya update satu elemen `#cart-count` via `cartLabel()`; referensi `#cart-count-mobile` dihapus |
| Cover produk custom p5 merujuk ke `.svg` yang tidak ada (404) | `assets/js/data.js` | Diubah `tshirt-classic.svg` → `tshirt-classic.jpg` |
| Masalah tugas lebih lama (tidak perlu diperbaiki lagi) | — | Sudah dalam commit `b892cb9` |

---

## 3. Perbaikan Markup Keranjang (Prioritas Pertama)

Tiga elemen keranjang disatukan menjadi **satu elemen saja**, ditempatkan di pojok kanan (`.nav-actions`, kanan atas header) pada `includes/header.php`:

- Sebelum (duplikat): cart di `.nav-menu` (id="cart-count-mobile", lebih ke tengah) + cart di `.nav-actions` (id="cart-count", pojok kanan).
- Sesudah: hanya satu `id="cart-count"` tunggal di pojok kanan (`.nav-actions`), `aria-label="Keranjang, jumlah 0 item"`.
- `assets/js/app.js`: `Cart.dispatch()` diperbaiki untuk hanya update satu elemen (`#cart-count`) + `setAttribute aria-label` via fungsi `cartLabel(count)` (didefinisikan di luar objek `Cart`). Referensi `#cart-count-mobile` dan `elMobile` dihapus.

Hasil: badge keranjang sinkron di semua halaman, tanpa duplikat ID, accessible (aria-label teks, bukan HTML), dan hanya muncul di pojok kanan.

Status: committed. Elemen terverifikasi lewat `curl` + `grep` pada `index.php` dan `cart/index.php` (satu `id="cart-count"`, tanpa `id="cart-count-mobile"`).

---

## 4. Alur Custom T-Shirt

### 4.1 Temukan dan pakai
- Navbar menautkan ke **Custom Studio** (`custom/studio.php`) dengan `aria-label="Custom Studio"` dan titik notifikasi `.nav-dot`.
- Produk custom base (p5 Custom Base T-Shirt, p6 Custom Base Hoodie) muncul pada katalog dengan `product_type: "custom_base"`.
- `assets/js/app.js` `productCard()` render badge `"Custom"` (`card__tag card__tag--custom`) dan tombol **"Buat Custom"** (`btn btn--dark btn--sm w-100`) yang mengarahkan ke `custom/studio.php`.

Status: committed (`9fca469`). Terverifikasi statis: `data.js` baris 122/143 `product_type: "custom_base"`; `app.js` productCard berubah dari "Buka Custom Studio" → "Buat Custom".

### 4.2 Flow studio (custom/studio.php)
Layout diubah sehingga **preview mockup di kiri, form di kanan** pada desktop (`.studio-layout` grid 2 kolom); mobile 1 kolom dengan preview di atas:
1. **Pilih produk** — `<select id="custom-product">`, chip ukuran (`#size-chips`), chip warna (`#color-chips`), input jumlah (`#custom-qty`), catatan (`#custom-notes`).
2. **Unggah desain** — `file-drop` (`#design-drop`), input file `accept="image/jpeg,image/png,image/webp"`, hint maks 5 MB.
3. **Preview mockup** — `#mockup-base` (tshirt-classic.jpg), `#mockup-art` (pratinjau desain), `#mockup-empty`, `#design-thumbnail` (thumbnail file yang dipilih) di dalam `#design-selected`.
4. **Penawaran & bayar** — tombol `#submit-custom` ("Kirim Permintaan Custom"), `#custom-estimate`, catatan estimasi bukan harga final.

Studi stepper 4 langkah (`.studio-stepper`, `studio-stepper__step`, data-step 1–4) ada dan disambungkan ke `app.js` (`studioSetStep`, `studioStepperEl`).

`showDesignSelected(name, dataUrl)` sekarang menerima `dataUrl` kedua dan menampilkan `#design-thumbnail`; `showDesignEmpty()` mereset thumbnail.

Biaya cetak custom tetap 35.000 (tidak diubah business rule).

Terverifikasi statis: semua `id` kunci ada di hasil render `custom/studio.php` (`studio-stepper`, `custom-product`, `design-file`, `design-thumbnail`, `submit-custom`, `mockup-base`, `mockup-art`, `design-selected`).

### 4.2b Banner CTA di Beranda

Section promo custom lama (`section.section--promo.custom-feature-prom` dengan `.custom-feature--promo`, `#promo-mockup-base`, `#custom-base-grid`, dan `.custom-steps`) di `index.php` digantikan dengan banner CTA yang sama persis dengan yang ada di `shop/index.php` (`.cta-banner cta-banner--custom`, "Tidak menemukan yang cocok?", tombol "Buka Custom Studio" ke `custom/studio.php`). Banner ditempatkan tepat setelah hero (posisi section lama).

Pengaman JS: fungsi `initCustomPromo()` di `assets/js/app.js` sudah memiliki null-guard (`if (!grid) return`) pada `$("#custom-base-grid")`, sehingga tidak menghasilkan error konsol pada halaman yang tidak memiliki elemen itu. Elemen `#custom-base-grid` tidak lagi ada di mana pun, jadi fungsi ini menjadi no-op aman.

CSS: gaya yang hanya dipakai section lama (`.custom-feature*`, `.custom-steps*`, `.custom-base-grid*`, `.base-option*`, `.promo-mockup*`, `.mockum__print-area`, dan `.cart-badge-mobile*`) dihapus dari `assets/css/style.css` karena terkonfirmasi tidak merujuk pada halaman lain via grep. Gaya yang masih dipakai dipertahankan: `.btn--lg` (shop banner + banner beranda baru), `.cta-banner--custom` (shop + beranda), `.mockup__base` standalone (Custom Studio).

Banner responsif: `.cta-banner` sudah menggunakan `flex-direction: column; align-items: flex-start` di `@media (max-width: 767px)`, sehingga di 360 px teks dan tombol tersusun vertikal tanpa overflow.

Terverifikasi: `index.php` HTTP 200, tidak ada elemen `#promo-mockup-base` / `#custom-base-grid` / `.custom-feature` yang tersisa, tombol arahkan ke `custom/studio.php`.

---

## 5. Responsivitas Mobile / Tablet / Desktop

`assets/css/style.css` memiliki media queries yang mencakup semua viewport target:

| Breakpoint | Media query | Cakupan |
|------------|-------------|---------|
| HP kecil | `@media (max-width: 420px)` | 360 px, 390 px |
| Tablet kecil | `@media (max-width: 767px)` | 768 px ambang bawah |
| Tablet/desktop | `@media (min-width: 768px)` | 768 px ke atas |
| Desktop | `@media (max-width: 1023px)` | 1024 px ambang bawah |
| Desktop lebar | `@media (min-width: 1024px)` | 1024 px ke atas |
| Very wide | `@media (min-width: 1360px)` | 1366 px |
| Aksesibilitas | `@media (prefers-reduced-motion: reduce)` | — |

`.studio-layout` grid berubah dari 2 kolom (desktop) menjadi 1 kolom (mobile, preview di atas). Card produk dan elemen lain menggunakan `flex-wrap`, `gap`, dan `max-width` yang responsif.

Catatan: pengujian viewport sebenarnya (360/390/768/1024/1366 px) dan pemeriksaan horizontal scroll (`scrollWidth <= innerWidth`) **belum dilakukan** karena tidak ada browser headless di lingkungan ini. Ditandai `BELUM DIUJI` di TEST_CHECKLIST.md.

---

## 6. Konsistensi Design System

- Design tokens di `:root` (`style.css`): `--color-primary #8E1526`, `--color-dark #2C2E39`, `--color-background #F3F2F4`, `--color-surface #FFFFFF`, `--color-border #DEDCE1`, `--radius-*`, `--spacing-*`.
- Elemen custom (promo, studio-stepper, `.studio-mockup`, `.estimate-note`, `.file-drop__thumb`, `.badge--compact`) menggunakan token yang sama.
- Tombol (`btn--primary`, `btn--dark`, `btn--outline`), input (`form-control`), dan kartu (`card`, `card__tag`) gaya seragam di seluruh halaman.
- Semua teks dalam Bahasa Indonesia.

---

## 7. Batas dan Risiko Prototype (tidak menyatakan sistem "aman")

- Password disimpan **plain text** di `localStorage` (`mv_auth`, `mv_users`).
- Hak akses admin diatur **sisi klien** (tidak ada enforcement server).
- Stok dihitung **di browser** (tidak ada database/transaksi server).
- Upload desain **tidak divalidasi server** (hanya validasi klien: tipe file JPEG/PNG/WebP, maks 5 MB).
- Tidak ada **CSRF protection**.
- Tidak ada database, sehingga tidak ada proteksi SQL injection (semua data rester di `localStorage` / memori browser).
- Tidak ada backend baru, endpoint baru, atau dependensi baru ditambahkan.

---

## 8. Hasil Uji (TEST_CHECKLIST.md)

File `TEST_CHECKLIST.md` mencakup 32 skenario (A1–A7, B1–B3, C1–C4, D1–D4, E1–E6, R1–R5).

| Kelompok | PASS (statis) | BELUM DIUJI | Alasan |
|----------|---------------|-------------|--------|
| A Autentikasi | — | 7 | Perlu browser interaktif |
| B Katalog | 1 (B3) | 2 | B1, B2 perlu browser |
| C Keranjang | 1 (C2) | 3 | C1, C3, C4 perlu browser |
| D Checkout | 1 (D2) | 3 | D1, D3, D4 perlu browser |
| E Custom | 3 (E3,E4,E5) | 3 | E1, E2, E6 perlu browser |
| R Responsivitas | — | 5 | Tidak ada browser headless |
| **Total** | **6** | **26** | — |

PASS (statis) berarti elemen/kode terkait terverifikasi lewat pemeriksaan statis (`curl` + `grep` + lint), bukan uji browser interaktif.

Skenario interaktif (login, tambah ke keranjang, checkout, admin approve/reject/revisi, upload custom valid/invalid) **tidak dapat dijalankan** karena tidak ada Chrome/Firefox headless di lingkungan ini. Server `php -S localhost:8000` aktif dan semua halaman HTTP 200.

---

## 9. Daftar Perubahan (Commit)

| Commit | Ringkasan | File |
|--------|-----------|------|
| `e8f33f8` | Backup awal sebelum audit | — |
| `b892cb9` | Perbaiki keranjang navbar: id tunggal, aria-label teks, badge mobile | `includes/header.php`, `assets/js/app.js` |
| `9fca469` | Custom T-Shirt: badge "Custom", tombol Buat Custom, studio preview di kiri, thumbnail desain | `assets/js/app.js`, `custom/studio.php`, `assets/css/style.css` |
| `76a3b5e` | TEST_CHECKLIST: hasil verifikasi statis dan keterbatasan lingkungan | `TEST_CHECKLIST.md` |

Perubahan `assets/js/data.js` (cover p5 `.svg` → `.jpg`) sudah termasuk dalam rantai commit sebelumnya.

---

## 10. Kesimpulan

Semua prioritas TASK telah ditangani:
1. **Audit** selesai tanpa mengubah kode asli.
2. **Keranjang navbar** diperbaiki (id tunggal, aria-label teks, badge mobile) — prioritas pertama, sudah terverifikasi.
3. **Alur Custom T-Shirt** disatiramudah ditemukan (navbar + katalog dengan badge "Custom" dan tombol "Buat Custom") dan dipakai (studio 4 langkah, preview di kiri, thumbnail, estimasi) tanpa mengubah business rule (customPrintFee tetap 35.000).
4. **Responsivitas** tersedia melalui media queries untuk 360/390/768/1024/1366 px, meski uji viewport sebenarnya belum dilakukan (tidak ada browser headless).
5. **Konsistensi design system** dipertahankan dengan token dan komponen yang sama.

Pengujian browser interaktif disarankan dilakukan pada mesin dengan browser (Chrome/Firefox/Edge) untuk menyelesaikan 26 skenaarionya yang ditandai `BELUM DIUJI`.
