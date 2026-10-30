# TEST_CHECKLIST.md — MerchVerse (prototype pra-UTS)

| ID | Skenario | Langkah | Hasil diharapkan | Hasil aktual | Status |
|----|----------|---------|------------------|--------------|--------|
| A1 | Autentikasi: login benar pembeli | login.php, buyer@merchverse.test / buyer123 | Berhasil, redirect index, akun muncul di navbar | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| A2 | Autentikasi: login salah | login.php, salah password | Error "Email atau password salah" | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| A3 | Autentikasi: daftar valid | register.php, data baru | Akun dibuat, redirect index | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| A4 | Autentikasi: daftar email duplikat | register.php, email sudah ada | Error "Email sudah terdaftar" | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| A5 | Autentikasi: logout | tombol Keluar | Redirect index, akun hilang | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| A6 | Autentikasi: admin membuka /admin/* | admin@..., dashboard | Diakses | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| A7 | Autentikasi: pembeli membuka /admin/* | buyer@..., dashboard | Redirect index (ditolak) | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| B1 | Katalog: pencarian | shop/index.php, ketik kata kunci | Hasil sesuai | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| B2 | Katalog: filter kategori | klik chip kategori | Hasil difilter | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| B3 | Katalog: produk custom_base muncul | kategori Semua | p5 Custom Base T-Shirt + p6 Custom Base Hoodie, badge "Custom", tombol "Buat Custom" | data.js: p5 & p6 product_type="custom_base", cover tshirt-classic.jpg; app.js productCard render badge "Custom" + tombol "Buat Custom" (terverifikasi statis) | PASS (statis) |
| C1 | Keranjang: tambah produk | detail produk, Tambah ke Keranjang | Badge bertambah, toast | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| C2 | Keranjang: badge sinkron | reload / pindah halaman | Badge sama di semua halaman | header.php hanya satu elemen keranjang di pojok kanan (id="cart-count", .nav-actions); Cart.dispatch() update satu elemen via cartLabel() (terverifikasi statis via curl+grep: hanya satu id="cart-count") | PASS (statis) |
| C3 | Keranjang: ubah qty / hapus | halaman keranjang | Total berubah, item hilang | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| C4 | Keranjang: kosong | hapus semua | Tampilan keranjang kosong | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| D1 | Checkout: form valid | isi lengkap + tarif | Pesanan dibuat, redirect detail | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| D2 | Checkout: form tidak valid | kosongkan field | Error di dekat field (Indonesian) | checkout/index.php render id="checkout-error", recipient-name/phone/address (terverifikasi statis) | PASS (statis) |
| D3 | Checkout: custom belum disetujui | URL checkout?custom=<id> request belum approved | "Penawaran tidak dapat diproses" | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| D4 | Checkout: custom disetujui + terima | status.php terima penawaran → checkout | Order custom dibuat | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| E1 | Custom: kirim request | studio, pilih produk, upload, kirim | Request terkirim, status submitted | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| E2 | Custom: upload invalid | file non-image / > 5 MB | Error format/ukuran | Belum dijalankan (memerlukan browser interaktif; validasi hanya sisi klien) | BELUM DIUJI |
| E3 | Custom: admin setujui + harga | admin custom-requests, setujui + harga final | Status approved, quotedUnitPrice terisi | admin.js baris 511-621: validasi approved butuh price>0, quotedUnitPrice disimpan (terverifikasi statis) | PASS (statis) |
| E4 | Custom: admin tolak | admin custom-requests, tolak | Status rejected | admin.js: status rejected + note wajib (terverifikasi statis) | PASS (statis) |
| E5 | Custom: admin revisi | admin custom-requests, revisi | Status revision_requested + catatan | admin.js: status revision_requested + note wajib (terverifikasi statis) | PASS (statis) |
| E6 | Custom: pembeli terima penawaran | status.status approved, tombol terima | Redirect checkout | Belum dijalankan (memerlukan browser interaktif) | BELUM DIUJI |
| R1 | Responsivitas: 360 px | beranda, katalog, detail, cart, checkout, studio | Tidak ada horizontal scroll, tidak ada tumpukan | CSS @media (max-width: 420px) ada; uji viewport sebenarnya belum dilakukan (tidak ada browser headless) | BELUM DIUJI |
| R2 | Responsivitas: 390 px | layaknya R1 | Tidak ada horizontal scroll | CSS @media (max-width: 420px) cakup 390px; uji viewport sebenarnya belum dilakukan | BELUM DIUJI |
| R3 | Responsivitas: 768 px | layaknya R1 | Tidak ada horizontal scroll | CSS @media (max-width: 767px) dan (min-width: 768px) ada; uji viewport sebenarnya belum dilakukan | BELUM DIUJI |
| R4 | Responsivitas: 1024 px | layaknya R1 | Tidak ada horizontal scroll | CSS @media (max-width: 1023px) dan (min-width: 1024px) ada; uji viewport sebenarnya belum dilakukan | BELUM DIUJI |
| R5 | Responsivitas: 1366 px | layaknya R1 | Tidak ada horizontal scroll | CSS @media (min-width: 1360px) ada; uji viewport sebenarnya belum dilakukan | BELUM DIUJI |

Keterangan status: PASS = berhasil dijalankan; FAIL = gagal; BELUM DIUJI = belum dieksekusi. PASS (statis) = elemen/kode terkait terverifikasi lewat pemeriksaan statis (curl + grep), bukan uji browser interaktif.

Batas prototype (tidak menyatakan sistem "aman"):
- Password disimpan plain text di localStorage (mv_auth, mv_users)
- Hak akses admin diatur sisi klien (tidak ada enforcement server)
- Stok dihitung di browser (tidak ada database/transaksi server)
- Upload desain tanpa validasi server (hanya validasi klien: tipe file, max 5 MB)
- Tidak ada CSRF protection
- Tidak ada database, jadi tidak ada proteksi SQL injection (semua data di localStorage/memori browser)

Catatan eksekusi: tidak ada browser headless (Chrome/Firefox) tersedia di lingkungan ini, sehingga skenario interaktif (login, keranjang, checkout, admin review, upload custom) tidak dapat dijalankan secara langsung dan ditandai BELUM DIUJI. Server `php -S localhost:8000` berjalan dan semua halaman merespon HTTP 200.
