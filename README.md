# MerchVerse — Prototype Web Merchandise Band

Prototype frontend untuk toko merchandise resmi + layanan **Custom Merch Studio**.
Aplikasi ini adalah versi pra-UTS: seluruh alur bisnis berjalan penuh di sisi klien
(keranjang, checkout, pesanan, custom request, panel admin), sedangkan pembayaran dan
penyimpanan data disimulasikan.

> Catatan akademik: **tidak ada transaksi uang sungguhan**. Pembayaran, ongkir, dan
> autentikasi adalah simulasi menggunakan `localStorage` browser.

---

## 1. Fitur

### Pembeli
- Beranda dengan produk unggulan dan kategori.
- Katalog produk dengan pencarian + filter kategori + sortir.
- Detail produk: pilih varian (ukuran/warna), stok, tambah ke keranjang.
- Keranjang: ubah qty, hapus item, subtotal realtime.
- Checkout: data penerima, pilih tarif ongkir, ringkasan, buat pesanan.
- Riwayat pesanan + timeline status + upload bukti pembayaran (simulasi).
- Custom Studio: pilih produk dasar, unggah desain, preview mockup, estimasi harga.
- Custom Request Status: pantau penawaran admin, unggah revisi, terima penawaran -> checkout.
- Login / Daftar akun (demo berbasis `localStorage`).

### Admin
- Dashboard: statistik pesanan, pendapatan, pembayaran tertunda, custom request, produk.
- Produk: tambah/edit/aktifkan-nonaktifkan produk + varian.
- Pesanan: pantau dan ubah status pesanan.
- Custom Request: review desain, minta revisi, tolak, atau setujui dengan harga final per unit.
- Pembayaran: verifikasi / tolak bukti pembayaran.
- Ongkir: CRUD tarif pengiriman.

---

## 2. Tech Stack

| Lapisan | Teknologi |
|--------|-----------|
| Halaman | PHP native (tanpa framework), satu file per halaman |
| Styling | Bootstrap 5 (CDN) + CSS custom design system |
| Interaksi | JavaScript vanilla + jQuery (CDN) |
| Data master | `assets/js/data.js` |
| Data transaksi | `localStorage` (simulasi backend) |
| Aset gambar | SVG di `assets/images/products/` |

Tidak ada database atau server-side state. Semua mutasi data terjadi di browser.

---

## 3. Menjalankan Aplikasi

### Opsi A — PHP built-in server (paling cepat)
Butuh PHP 8.x.

```bash
cd merchverse
php -S localhost:8000
```

Buka `http://localhost:8000/index.php`.

Jika PHP tidak ada di `PATH` (contoh di XAMPP Windows):

```powershell
& "C:\xampp\php\php.exe" -S localhost:8000 -t .
```

### Opsi B — XAMPP / Laragon
1. Salin folder `merchverse` ke `htdocs` (XAMPP).
2. Jalankan Apache.
3. Buka `http://localhost/merchverse/index.php`.

Tidak perlu import database. Aplikasi langsung jalan.

---

## 4. Akun Demo

| Peran | Email | Password |
|-------|-------|----------|
| Pembeli | `buyer@merchverse.test` | `buyer123` |
| Admin | `admin@merchverse.test` | `admin123` |

Di halaman login tersedia tombol isi otomatis akun demo.

---

## 5. Alur Demo yang Disarankan

1. **Belanja**: buka Katalog -> pilih produk -> atur varian -> Tambah ke Keranjang.
2. **Checkout**: buka Keranjang -> Checkout -> isi data penerima -> pilih ongkir -> Buat Pesanan.
3. **Pembayaran**: di detail pesanan unggah bukti pembayaran (file gambar apa saja).
4. **Verifikasi admin**: login sebagai admin -> menu Pembayaran -> Verifikasi.
5. **Custom**: login pembeli -> Custom Studio -> pilih produk & unggah desain -> Kirim.
6. **Penawaran admin**: login admin -> Custom Request -> Review -> setujui + harga final per unit.
7. **Terima penawaran**: sebagai pembeli buka Status Custom -> Terima Penawaran -> Checkout.

---

## 6. Struktur Proyek

```
merchverse/
├─ index.php                # Beranda
├─ login.php / register.php # Autentikasi demo
├─ includes/                # helpers.php, header.php, footer.php, admin_nav.php
├─ shop/                    # index.php (katalog), detail.php
├─ cart/index.php           # Keranjang
├─ checkout/index.php       # Checkout (mendukung ?custom=<id>&rate=<id>)
├─ orders/                  # index.php (riwayat), detail.php (timeline + bukti)
├─ custom/                  # studio.php (unggah + preview), status.php (penawaran)
├─ admin/                   # dashboard, products, orders, custom-requests, payments, shipping
├─ database/                # skema SQL dan seed (diisi tahap pasca-UTS)
├─ assets/
│   ├─ css/style.css        # Design system + style semua halaman
│   ├─ js/data.js           # Data master (produk, user, ongkir, label status, seed)
│   ├─ js/app.js            # Logika pembeli (Store, Auth, Cart, render halaman)
│   ├─ js/admin.js          # Logika panel admin
│   ├─ js/icons.js          # Kumpulan ikon inline SVG
│   └─ images/products/*.{svg,jpg} # Aset produk
└─ PRD_MerchVerse.md        # Product Requirements Document
```

---

## 7. Catatan Implementasi

- `includes/helpers.php` menyediakan `base_url()`, `asset_url()`, `e()`, dan `rupiah()`,
  serta meneruskan base URL ke JS melalui `window.MV_BASE`.
- Kunci `localStorage`: `mv_auth`, `mv_users`, `mv_cart`, `mv_orders`, `mv_requests`,
  `mv_shipping`, `mv_products`, `mv_seeded_v1`.
- Checkout custom: `checkout/index.php?custom=<requestId>&rate=<rateId>` membuat order
  bertipe `custom` lalu menandai request sebagai `ordered`.
- Membersihkan data demo: hapus kunci `localStorage` di atas atau `localStorage.clear()`
  dari DevTools, lalu muat ulang halaman.
