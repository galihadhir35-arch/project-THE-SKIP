# WIREFRAME — MerchVerse (Frontend Fase 1 / UTS)

Struktur halaman sebelum coding. Teknologi: HTML + Bootstrap 5 (grid `row`/`col-*`) + CSS (`style.css`) + jQuery (interaksi). Semua halaman berbagi **Header** dan **Footer** yang sama (`includes/header.php`, `includes/footer.php`).

Breakpoint Bootstrap yang dipakai: `<576` ponsel, `md ≥768` tablet, `lg ≥992` desktop, `xl ≥1200`.

## Komponen bersama

```
HEADER (sticky)
+--------------------------------------------------------------+
| THE SKIP MERCHVERSE | Katalog  Custom Studio  Pesanan Saya | [Masuk] Keranjang(n) |
+--------------------------------------------------------------+
  Mobile: nav dilipat menjadi tombol menu (toggle jQuery).

FOOTER (row g-4)
+------------+------------+------------+------------+
| Brand+desc | Toko       | Akun       | Bantuan    |   lg: 4 kolom, md: 2, xs: 1-2
+------------+------------+------------+------------+
| (c) 2026 MerchVerse - prototype akademik                      |
+--------------------------------------------------------------+

MODAL (#app-modal) : judul | isi | [Batal] [OK]   -> openModal()/closeModal()
TOAST              : pesan sukses/error di pojok layar
```

## 1. Beranda — `index.php`

```
[HEADER]
+--------------------------------------------------------------+
| HERO (row)                                                   |
| col-lg-7: kicker, H1, paragraf, [Lihat koleksi][Custom merch]|
| col-lg-5: kartu gambar produk (disembunyikan <lg)            |
+--------------------------------------------------------------+
| KOLEKSI (row g-3)   col-md-4 x3: Apparel | Accessories | Collectibles |
+--------------------------------------------------------------+
| KOLEKSI UNGGULAN (row g-3)  col-6 col-md-4 col-xl-3 : kartu produk x4 |
+--------------------------------------------------------------+
| BANNER CTA Custom Studio  [Buka Custom Studio]               |
| TENTANG THE SKIP                                             |
[FOOTER]
```

## 2. Katalog — `shop/index.php`

```
[HEADER]
H1 Katalog | [ cari produk (#search-input) ] [ urutkan (#sort-select) ]
Filter chip: [Semua][Apparel][Accessories][Collectibles]   <- jQuery filter
"n produk ditemukan"
+--------+--------+--------+--------+   row g-3
| kartu  | kartu  | kartu  | kartu  |   xs: 2 kol | md: 3 | xl: 4
+--------+--------+--------+--------+
Empty state (jika hasil 0)
[FOOTER]
```

Kartu produk: gambar + tag kategori | nama | harga | status stok | [Tambah ke Keranjang].

## 3. Detail Produk — `shop/detail.php?id=…`

```
[HEADER]
Breadcrumb: Home / Shop / Nama produk
+------------------------+-------------------------------+
| col-lg-6 GALERI        | col-lg-6 PANEL DETAIL         |
| gambar utama           | kategori, H1, harga, badge    |
| thumbnail (klik ganti) | deskripsi                     |
|                        | Varian (chip) | Kuantitas -/+ |
|                        | [Tambah ke Keranjang]         |
|                        | meta: stok, pengiriman, bayar |
+------------------------+-------------------------------+
Produk Serupa (row g-3 : kartu)
[FOOTER]
```

## 4. Keranjang — `cart/index.php`

```
[HEADER]
Langkah 1 dari 2 | H1 Keranjang Belanja        [Lanjut Belanja]
(kosong) -> empty state + [Lihat Katalog]
+------------------------------+---------------------+
| col-lg-8 DAFTAR ITEM         | col-lg-4 RINGKASAN  |
| gambar | nama/varian         | jumlah item         |
| qty -/+ | harga | [Hapus]    | subtotal, ongkir    |
| ...                          | total sementara     |
|                              | [Lanjut ke Pembayaran] |
+------------------------------+---------------------+
```

## 5. Checkout — `checkout/index.php` (wajib login)

```
Langkah 2 dari 2 | H1 Checkout
+--------------------------------+---------------------+
| col-lg-8                       | col-lg-4 RINGKASAN  |
| PANEL Alamat Pengiriman        | daftar item         |
|  [nama] [kontak]  (col-md-6)   | subtotal/ongkir/total|
|  [alamat lengkap]              | [Buat Pesanan]      |
|  [kota] [kode pos] (col-md-6)  +---------------------+
| PANEL Pengiriman: select tarif |
| PANEL Metode Bayar (simulasi)  |
+--------------------------------+
Mobile: bar bawah tetap "Total | [Buat Pesanan]"
Validasi form: jQuery (wajib isi, pesan error alert)
```

## 6. Riwayat Pesanan — `orders/index.php`

```
H1 Pesanan Saya
TABEL: Kode | Tanggal | Tipe | Total | Status bayar | Status | [Detail]
(kosong) -> empty state
```

## 7. Detail Pesanan — `orders/detail.php?id=…`

```
Breadcrumb | Kode pesanan + badge status & pembayaran
+------------------------------+---------------------+
| col-lg-8                     | col-lg-4            |
| Item pesanan + total         | Alamat pengiriman   |
| Panel pembayaran:            | Kurir / resi        |
|  form unggah bukti (simulasi)| Riwayat status      |
|                              | (timeline)          |
+------------------------------+---------------------+
```

## 8. Custom Studio — `custom/studio.php`

```
H1 Custom Merch Studio                  [Status Permintaan Saya]
Alert: wajib login untuk mengirim  [Masuk][Daftar]
Stepper: 01 Pilih produk > 02 Unggah desain > 03 Kirim > 04 Bayar
+---------------------------+--------------------------------+
| col-lg-6 PREVIEW MOCKUP   | col-lg-6 FORM                  |
| (sticky di desktop)       | 01 Produk, ukuran, warna, qty  |
| gambar dasar + overlay    | 02 Unggah desain (drag & drop),|
| desain                    |    catatan admin               |
|                           | 03 Estimasi harga + [Kirim]    |
+---------------------------+--------------------------------+
Mobile: preview di atas, form di bawah (1 kolom)
```

## 9. Status Custom Request — `custom/status.php`

```
H1 Status Custom Request
Daftar permintaan: kartu per request -> status, penawaran harga,
[Setujui & Bayar] / [Tolak] (konfirmasi via modal)
```

## 10. Login / Register — `login.php`, `register.php`

```
+-----------------------------+---------------------------+
| col-lg-7 TEKS               | col-lg-5 KARTU FORM       |
| H1, deskripsi, daftar cek   | Email, Password (+ nama,  |
|                             | konfirmasi di register)   |
|                             | [Masuk/Daftar]            |
|                             | Kotak akun demo (isi cepat)|
+-----------------------------+---------------------------+
Error: alert di atas form (validasi jQuery)
```

## 11. Admin (role admin) — `admin/*.php`

Layout umum: header admin + navigasi admin (`includes/admin_nav.php`), konten satu kolom.

```
dashboard.php   : kartu statistik (pesanan, pendapatan, antrean) +
                  row: col-xl-8 Pesanan Terbaru (tabel) | col-xl-4 Perlu Tindakan
products.php    : toolbar [Tambah Produk] [cari] | TABEL produk
                  aksi Edit/Hapus -> modal form (jQuery)
orders.php      : filter status | TABEL pesanan | ubah status/resi (modal)
payments.php    : TABEL bukti bayar | [Verifikasi] [Tolak] (modal)
custom-requests.php : TABEL request | detail desain | set harga final / tolak
shipping.php    : TABEL tarif ongkir | tambah/ubah (modal form)
```

## Peta navigasi

```
Beranda -> Katalog -> Detail -> Keranjang -> (login) -> Checkout -> Detail Pesanan
        -> Custom Studio -> Status Custom -> Detail Pesanan (bayar)
Login/Register -> Beranda | Admin Dashboard (role admin)
```

## Interaksi jQuery

| Area | Interaksi |
|---|---|
| Katalog | filter kategori, pencarian, urut — render ulang grid |
| Keranjang | ubah qty, hapus item, ringkasan otomatis |
| Form | validasi login/register/checkout/studio, pesan error |
| Modal | `openModal()` / `closeModal()` (konfirmasi, form admin) |
| Tabel admin | render baris, filter, aksi per baris |
| Studio | pilih varian, unggah desain, preview mockup |
