# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## MerchVerse — Band Merchandise Store & Custom Merch Studio

**Versi dokumen:** 1.0  
**Status:** Draft untuk ditinjau dan disetujui sebelum implementasi  
**Tanggal:** 22 Oktober 2026  
**Platform:** Web responsif  
**Nama band:** Belum ditentukan — gunakan placeholder `[Nama Band]` sampai diputuskan  
**Pemilik produk:** Tim/mahasiswa pengembang proyek  
**Dokumen acuan:** Penugasan Proyek Pemrograman Web Fullstack dan `DESIGN.md` yang diberikan pengguna

> **Penting:** Dokumen ini adalah spesifikasi yang direncanakan, bukan bukti bahwa aplikasi atau fitur telah dibuat. Ketentuan yang bersumber dari materi tugas dipisahkan dari keputusan rancangan dan asumsi yang masih perlu dikonfirmasi.

\newpage

## Daftar Isi

0. Ringkasan Keputusan  
1. Latar Belakang  
2. Visi, Tujuan, dan Indikator Keberhasilan  
3. Pengguna Sasaran dan Permasalahan  
4. Ruang Lingkup Produk  
5. Aktor dan Hak Akses  
6. Functional Requirements  
7. User Stories  
8. Alur Bisnis Utama  
9. Aturan Bisnis  
10. UI/UX Design Guidelines  
11. Responsive Requirements  
12. Teknologi dan Arsitektur  
13. Skema Database Awal  
14. Kebutuhan AJAX/JSON API  
15. Keamanan, Privasi, dan Integritas  
16. Non-Functional Requirements  
17. Acceptance Criteria  
18. Prioritas MVP  
19. Rencana Tahapan Pengerjaan  
20. Test Plan  
21. Deployment Lokal dan Struktur Direktori  
22. Risiko dan Mitigasi  
23. Asumsi dan Hal yang Masih Perlu Dikonfirmasi  
24. Out of Scope  
25. Glosarium  
26. Referensi dan Dasar Penyusunan

\newpage

## 0. Ringkasan Keputusan

| Area | Keputusan rancangan |
|---|---|
| Model bisnis | Satu toko online untuk merchandise satu band; bukan marketplace multi-penjual |
| Produk | Merchandise reguler serta pesanan custom merch |
| Custom merch | Pembeli memilih produk/varian, mengunggah desain, melihat preview mockup langsung, lalu menunggu persetujuan admin |
| Pembayaran | Simulasi pembayaran; pembeli mengirim bukti simulasi dan admin memverifikasi. Tidak ada transaksi uang sungguhan pada MVP |
| Pesanan custom | Pembayaran penuh setelah desain dan harga final disetujui admin |
| Pengiriman | Tarif diatur tanpa API ekspedisi; admin mengelola ongkir, kurir, resi, dan status pengiriman |
| Akun | Pembeli wajib daftar/login. Admin memiliki role dan halaman pengelolaan terpisah |
| Frontend pra-UTS | HTML, CSS, Bootstrap, jQuery, dan data dummy |
| Backend pasca-UTS | PHP native, MySQL, CRUD, business logic, AJAX/JSON API, validasi, dan pengujian |
| Lingkungan lokal | XAMPP, phpMyAdmin, Git |
| Responsif | HP, tablet, desktop, termasuk pengujian viewport sempit |
| Gaya visual | Kanvas putih, hero gelap, foto produk dominan, tombol commerce maroon `#8E1526`, CTA promosi hitam, font display New Rocker, font UI Inter, rounded cards, dan tombol kapsul |

## 1. Latar Belakang

Penggemar band umumnya mencari merchandise melalui kanal yang tersebar, sementara pesanan custom sering dilakukan secara manual lewat percakapan. Alur manual dapat membuat detail ukuran, warna, jumlah, desain, harga, pembayaran, dan status produksi sulit dilacak secara konsisten.

MerchVerse dirancang sebagai satu toko web untuk satu band yang menyatukan katalog official merchandise dan alur pesanan custom pada satu tempat. Produk reguler menggunakan alur katalog dan checkout standar. Produk custom menggunakan alur pengunggahan desain, preview mockup, peninjauan admin, konfirmasi harga, pembayaran penuh, produksi, dan pengiriman.

Dalam konteks tugas, proyek ini juga menjadi sarana menerapkan proses fullstack secara bertahap: merancang kebutuhan, membangun prototype UI dengan data dummy sebelum UTS, lalu mengintegrasikan PHP, MySQL, CRUD, business logic, dan AJAX/JSON setelah UTS.

## 2. Visi, Tujuan, dan Indikator Keberhasilan

### 2.1 Visi

Menyediakan pengalaman belanja merchandise band yang konsisten, mudah ditelusuri, dan memiliki alur pesanan custom yang transparan dari pengajuan desain sampai pengiriman.

### 2.2 Tujuan produk

1. Menyediakan katalog merchandise satu band dengan informasi produk, harga, varian, dan stok.
2. Memungkinkan pembeli yang memiliki akun melakukan checkout dan melihat riwayat pesanannya.
3. Menyediakan pemesanan custom dengan unggah desain dan preview mockup langsung.
4. Memastikan desain custom ditinjau dan harga final ditentukan sebelum pembayaran.
5. Mencatat pembayaran simulasi dan menyediakan verifikasi oleh admin.
6. Memungkinkan admin mengelola produk, stok, pesanan, tarif pengiriman, pembayaran, dan progres produksi.
7. Menghasilkan aplikasi yang responsif dan memenuhi tahap teknologi dari tugas kuliah.

### 2.3 Indikator keberhasilan proyek

- Pengunjung dapat melihat katalog dan detail produk pada seluruh ukuran layar target.
- Pembeli dapat membuat akun, login, menambah produk ke keranjang, dan membuat pesanan reguler.
- Pembeli dapat mengirim permintaan custom, melihat preview, dan menerima keputusan admin.
- Pesanan custom tidak dapat dibayar sebelum desain serta harga final disetujui.
- Pembayaran tidak dapat dianggap berhasil hanya karena pembeli menekan tombol; status berhasil harus ditetapkan oleh admin setelah verifikasi.
- Admin dapat memperbarui status pesanan dan pengiriman serta menyimpan nomor resi.
- Minimal satu fitur inti menggunakan AJAX dengan komunikasi JSON antara frontend dan backend.
- Fungsi utama dapat diuji pada viewport 360, 390, 768, 1024, dan 1440 piksel tanpa overflow horizontal yang tidak disengaja.
- Source code, skema SQL, instruksi instalasi, dan checklist pengujian tersedia.

Target angka seperti tingkat konversi penjualan atau jumlah pengguna aktif belum ditetapkan karena proyek ini merupakan prototype akademik.

## 3. Pengguna Sasaran dan Permasalahan

### 3.1 Segmen pengguna

- **Penggemar/pembeli:** ingin melihat dan membeli merchandise resmi dari satu band.
- **Pembeli custom:** ingin memesan produk dengan desain yang diunggah sendiri, tanpa proses pesanan yang sulit dilacak.
- **Admin toko:** mengelola katalog, stok, pengajuan desain, pembayaran, pesanan, tarif pengiriman, dan resi.

### 3.2 Masalah yang ditangani

- Detail produk dan ketersediaan dapat ditampilkan dalam format yang konsisten.
- Informasi varian, jumlah, dan harga dapat dipastikan sebelum pesanan dibuat.
- Desain custom dan keputusan admin tercatat pada satu permintaan.
- Status pembayaran dan status pemenuhan pesanan dapat dipantau.
- Informasi pengiriman tidak hanya bergantung pada percakapan yang terpisah.

### 3.3 Bukan tujuan produk

MerchVerse tidak dimaksudkan untuk menjadi marketplace multi-penjual, penyedia layanan pembayaran sungguhan, sistem logistik otomatis, atau editor desain grafis profesional dalam versi MVP.

## 4. Ruang Lingkup Produk

### 4.1 Termasuk dalam MVP

**Storefront dan akun**

- Homepage/landing page.
- Katalog dan filter/pencarian dasar.
- Halaman detail produk.
- Registrasi, login, logout, dan role buyer/admin.
- Keranjang belanja untuk produk reguler.
- Form checkout, alamat pengiriman, pemilihan tarif yang tersedia, dan ringkasan biaya.
- Riwayat dan detail pesanan pembeli.

**Custom Merch Studio**

- Pilih tipe produk dasar (minimal kaos dan/atau hoodie, sesuai keputusan final katalog).
- Pilih ukuran, warna, jumlah, dan catatan.
- Unggah gambar desain.
- Preview langsung dengan menempatkan gambar pada area cetak di mockup produk.
- Kirim permintaan untuk ditinjau admin.
- Admin dapat menyetujui, meminta revisi, atau menolak.
- Admin menetapkan harga final per unit; pembeli menerima/menolak penawaran.
- Setelah penawaran diterima, pembeli melakukan checkout dan pembayaran penuh.

**Transaksi dan administrasi**

- Simulasi pembayaran dengan pengunggahan bukti atau tanda pembayaran simulasi.
- Status menunggu pembayaran, menunggu verifikasi, terverifikasi, dan ditolak.
- Verifikasi pembayaran oleh admin.
- Manajemen produk, kategori, varian, stok, dan harga.
- Manajemen pesanan dan pembaruan status.
- Tarif pengiriman yang dikelola tanpa API ekspedisi.
- Input nama kurir/layanan dan nomor resi secara manual.
- Dashboard admin dengan daftar ringkas pesanan dan item yang perlu ditindaklanjuti.
- AJAX/JSON untuk sekurang-kurangnya satu fitur inti; rancangan ini menyarankan beberapa endpoint.

### 4.2 Tidak termasuk MVP

- Marketplace dengan banyak penjual atau banyak toko band.
- Payment gateway live, pemrosesan kartu, QRIS atau transfer sungguhan yang diverifikasi otomatis.
- API ekspedisi, pelacakan kurir real-time, label pengiriman otomatis.
- Chat real-time antara pembeli dan admin.
- Aplikasi Android/iOS native.
- Editor desain lanjutan dengan layer, font, dan alat gambar profesional.
- Pembuatan desain menggunakan AI.
- Program loyalitas, poin, dompet digital, cicilan, kupon kompleks, atau langganan.
- Refund otomatis dan dispute management penuh.
- Layanan multi-bahasa atau multi-mata uang.
- Dashboard analitik bisnis yang kompleks.

### 4.3 Batasan penting

- Hanya satu toko dan satu identitas band untuk MVP.
- Role hanya `buyer` dan `admin`.
- Pembelian produk reguler dan pesanan custom menggunakan alur checkout terpisah pada MVP; keduanya tidak digabung dalam satu order.
- Preview mockup bersifat indikatif, bukan bukti akurasi warna atau hasil cetak.
- Nama band, aset visual, artwork, dan identitas resmi masih perlu diputuskan. Gunakan identitas fiktif atau aset yang pengguna proyek memiliki izin untuk menggunakannya.

## 5. Aktor dan Hak Akses

| Aktor | Hak akses | Tidak boleh dilakukan |
|---|---|---|
| Pengunjung | Melihat homepage, katalog, filter, dan detail produk | Membuat order, mengakses pesanan pribadi, atau membuka halaman admin |
| Pembeli (login) | Mengelola sesi akun dasar, keranjang, checkout, mengunggah desain, melihat pesanan sendiri, mengirim bukti simulasi, melihat status | Mengubah harga final dari sisi browser, memverifikasi pembayaran sendiri, melihat pesanan pengguna lain, atau mengakses fungsi admin |
| Admin | CRUD produk/kategori/varian, kelola stok, meninjau custom request, menetapkan harga final, memverifikasi pembayaran, mengatur ongkir, resi, dan status order | Mengakses password plaintext; menyatakan pembayaran sungguhan jika transaksi hanya simulasi |

Registrasi publik hanya membuat akun `buyer`. Akun admin dibuat melalui seed/database atau prosedur administrasi lokal, bukan melalui form registrasi publik.

## 6. Functional Requirements

Prioritas: **P0** = harus ada untuk MVP; **P1** = penting jika kapasitas waktu cukup; **P2** = pengembangan berikutnya. Semua persyaratan di bawah merupakan rencana yang harus diuji, bukan fitur yang telah diimplementasikan.

| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-01 | Sistem menyediakan homepage dengan identitas band, navigasi, CTA ke katalog dan custom studio, serta section produk unggulan. | P0 |
| FR-02 | Pengunjung dapat melihat katalog, detail produk, harga, deskripsi, foto, varian, dan status stok. | P0 |
| FR-03 | Pengguna dapat mencari produk dan memfilter berdasarkan kategori atau atribut dasar. | P1 |
| FR-04 | Pembeli dapat mendaftar, login, dan logout. Email harus unik dan password disimpan sebagai hash. | P0 |
| FR-05 | Sistem membatasi halaman dan aksi berdasarkan role buyer/admin. | P0 |
| FR-06 | Pembeli dapat memilih varian, kuantitas, menambah item ke keranjang, mengubah kuantitas, dan menghapus item. | P0 |
| FR-07 | Sistem menghitung subtotal, ongkir, dan total menggunakan nilai yang dihitung ulang di server. | P0 |
| FR-08 | Pembeli dapat mengisi nama penerima, nomor kontak, alamat, kota/area, kode pos jika relevan, dan tarif pengiriman yang tersedia. | P0 |
| FR-09 | Sistem membuat order reguler dengan kode order unik, snapshot nama/varian/harga, total, status, dan waktu pembuatan. | P0 |
| FR-10 | Pembeli dapat memilih produk dasar untuk custom merch, ukuran, warna, jumlah, dan catatan. | P0 |
| FR-11 | Pembeli dapat mengunggah desain sesuai tipe file, ukuran, dan validasi server yang ditetapkan. | P0 |
| FR-12 | UI menampilkan preview langsung yang menggabungkan gambar desain dengan mockup produk; perubahan pilihan terkait memperbarui preview jika sesuai. | P0 |
| FR-13 | Pembeli dapat mengirim custom request dan melihat status permintaan. | P0 |
| FR-14 | Admin dapat meninjau desain dan memilih approve, request revision, atau reject disertai catatan. | P0 |
| FR-15 | Admin dapat menetapkan harga final; pembeli harus menerima penawaran sebelum order custom dibuat dan pembayaran dimulai. | P0 |
| FR-16 | Sistem menyediakan alur pembayaran simulasi dan upload bukti simulasi untuk order. | P0 |
| FR-17 | Admin dapat memverifikasi atau menolak bukti pembayaran dengan catatan. | P0 |
| FR-18 | Status `verified/paid` hanya ditetapkan oleh proses server berotorisasi admin setelah verifikasi. | P0 |
| FR-19 | Admin dapat mengelola katalog produk, foto, kategori, varian, harga, dan stok dengan CRUD. | P0 |
| FR-20 | Sistem memeriksa stok ketika checkout dan mencegah kuantitas melebihi stok yang tersedia. | P0 |
| FR-21 | Admin dapat memperbarui status pemenuhan order, tarif ongkir yang ditawarkan, nama kurir, dan nomor resi. | P0 |
| FR-22 | Pembeli dapat melihat detail dan riwayat order miliknya, status pembayaran, status pemenuhan, ongkir, dan resi jika tersedia. | P0 |
| FR-23 | Aksi inti terpilih menggunakan AJAX dan mengirim/menerima JSON tanpa reload penuh jika sesuai. | P0 |
| FR-24 | Sistem menyediakan pesan validasi, error, loading, empty state, dan konfirmasi tindakan penting. | P0 |
| FR-25 | Admin dapat melihat ringkasan order dan jumlah item yang menunggu verifikasi/persetujuan. | P1 |
| FR-26 | Pembeli dapat menyatakan order selesai diterima atau admin dapat menandainya selesai. | P1 |
| FR-27 | Preview custom mendukung penggeseran, perubahan skala, pilihan area cetak lebih dari satu sisi, atau fitur desain lanjutan. | P2 |
| FR-28 | Wishlist, promo, notifikasi email, laporan penjualan, dan fitur analitik. | P2 |

## 7. User Stories

| ID | User story | Kriteria selesai utama |
|---|---|---|
| US-01 | Sebagai pengunjung, saya ingin menjelajahi produk agar dapat menemukan merch yang saya inginkan. | Katalog dan detail tampil dengan harga, varian, dan stok yang benar. |
| US-02 | Sebagai pembeli, saya ingin membuat akun dan login agar dapat melihat riwayat order saya. | Akun dibuat, sesi berfungsi, dan data order dibatasi pada pemiliknya. |
| US-03 | Sebagai pembeli, saya ingin memilih ukuran/warna dan menambah produk ke keranjang. | Varian wajib dipilih dan total dihitung benar. |
| US-04 | Sebagai pembeli, saya ingin mengetahui total beserta ongkir sebelum membayar. | Ringkasan menampilkan subtotal, ongkir, dan total akhir sebelum order dikonfirmasi. |
| US-05 | Sebagai pembeli custom, saya ingin mengunggah gambar dan melihatnya di mockup. | File tervalidasi dan preview diperbarui tanpa mengunggah file yang tidak valid. |
| US-06 | Sebagai pembeli custom, saya ingin mengetahui apakah desain disetujui dan berapa harga finalnya. | Status/catatan admin dan harga final dapat dilihat oleh pemilik request. |
| US-07 | Sebagai pembeli, saya ingin mengirim bukti pembayaran simulasi. | Bukti tercatat dengan status menunggu verifikasi dan order belum ditandai lunas. |
| US-08 | Sebagai admin, saya ingin menyetujui atau menolak pembayaran. | Perubahan tercatat dan hanya admin yang terotorisasi dapat melakukannya. |
| US-09 | Sebagai admin, saya ingin mengelola stok dan produk. | Perubahan tersimpan, validasi berjalan, dan produk nonaktif tidak dapat dibeli. |
| US-10 | Sebagai pembeli, saya ingin melacak status pesanan dan nomor resi. | Status dan resi terbaru muncul pada halaman detail order. |
| US-11 | Sebagai pengguna HP, saya ingin melakukan fungsi inti tanpa zoom atau scroll horizontal yang tidak disengaja. | Halaman utama lolos pengujian viewport responsif yang ditentukan. |

## 8. Alur Bisnis Utama

### 8.1 Beli merchandise reguler

1. Pengunjung membuka homepage atau katalog.
2. Pembeli login/registrasi.
3. Pembeli memilih produk, varian, dan kuantitas.
4. Sistem memeriksa ketersediaan dan menambah item ke keranjang.
5. Pembeli checkout serta mengisi alamat dan area pengiriman.
6. Sistem menghitung ulang harga dari database dan menampilkan subtotal, ongkir, serta total.
7. Pembeli mengonfirmasi order; sistem menyimpan order dengan status menunggu pembayaran dan mereservasi stok melalui transaksi database.
8. Pembeli mengirim bukti pembayaran simulasi.
9. Admin meninjau bukti lalu memverifikasi atau menolaknya.
10. Jika diverifikasi, order masuk ke tahap pemrosesan.
11. Admin mengemas barang, memasukkan kurir dan resi, lalu memperbarui status menjadi dikirim.
12. Pembeli melihat status. Order dapat ditandai selesai setelah barang diterima.

### 8.2 Custom merch

1. Pembeli login dan membuka Custom Studio.
2. Pembeli memilih produk dasar dan atribut (ukuran, warna, jumlah), mengunggah gambar, serta menambahkan catatan.
3. UI menampilkan preview mockup indikatif.
4. Pembeli mengirim request; status menjadi menunggu peninjauan.
5. Admin meninjau file dan spesifikasi. Admin dapat meminta revisi, menolak, atau menyetujui desain.
6. Jika disetujui, admin menetapkan harga final dan catatan produksi.
7. Pembeli meninjau harga final. Jika setuju, sistem membuat order custom dengan pembayaran penuh; jika tidak, request tetap tidak dibayar dan dapat ditolak/ditutup.
8. Pembeli menyelesaikan langkah pembayaran simulasi dan mengunggah bukti.
9. Admin memverifikasi pembayaran.
10. Setelah pembayaran terverifikasi, admin mengubah status produksi, kemudian status pengiriman dan nomor resi.
11. Pembeli memantau status pada riwayat order.

### 8.3 Penanganan pembayaran ditolak

- Pembeli melihat alasan penolakan yang tidak mengandung data sensitif.
- Pembeli dapat mengunggah bukti baru selama order masih terbuka.
- Order tidak boleh masuk proses produksi atau pengiriman sebelum pembayaran terverifikasi.
- Admin dapat membatalkan order sesuai aturan pembatalan; stok yang telah direservasi dikembalikan satu kali.

## 9. Aturan Bisnis

### 9.1 Produk dan stok

- Harga menggunakan Rupiah (IDR), disimpan sebagai integer dalam satuan rupiah tanpa nilai pecahan.
- Satu SKU/varian mengacu pada kombinasi produk dan atribut seperti ukuran serta warna.
- Produk atau varian nonaktif/tidak tersedia tidak dapat dimasukkan ke order baru.
- Kuantitas harus bilangan bulat positif dan dibatasi stok yang tersedia.
- Nama produk, SKU, varian, dan harga unit disalin sebagai snapshot ke detail order agar riwayat tidak berubah saat katalog diedit.
- Stok direservasi saat order reguler dibuat untuk mengurangi overselling. Stok dikembalikan saat order dibatalkan, dan pengembalian harus idempoten (tidak boleh dua kali untuk satu pembatalan).

### 9.2 Rumus harga

**Order reguler**

`Subtotal = Σ (harga unit snapshot × kuantitas)`  
`Total = Subtotal + ongkir`

**Custom merch**

`Estimasi per unit = harga dasar produk + biaya cetak sesuai tabel harga`  
`Estimasi total = estimasi per unit × kuantitas + ongkir`

Rumus estimasi tidak menjadi komitmen harga final. Admin menetapkan harga final per unit setelah meninjau desain dan spesifikasi. **Total final = (harga final per unit × kuantitas) + ongkir yang tampil sebelum pembayaran.** Biaya tambahan harus dijelaskan sebelum pembeli menyetujui penawaran. Tidak ada biaya tersembunyi.

### 9.3 Custom request

- File wajib diunggah sebelum request dikirim.
- Format yang disarankan: JPEG, PNG, atau WebP; ukuran maksimum awal 5 MB per file. Batas ini merupakan keputusan rancangan dan dapat diubah setelah uji coba.
- Upload harus melewati validasi tipe MIME dan ekstensi di server; nama file dibuat ulang secara acak.
- Preview menempatkan artwork pada area cetak depan mockup. Posisi dan skala awal ditetapkan sistem; editor drag-and-drop lanjutan adalah P2.
- Preview bersifat ilustratif; warna layar, ukuran aktual, dan hasil cetak dapat berbeda.
- Produksi belum boleh dimulai sebelum desain disetujui, pembeli menerima harga final, dan pembayaran terverifikasi.
- Admin dapat request revision dengan catatan. Versi awal mengasumsikan revisi dilakukan dengan mengunggah file baru ke request yang sama; riwayat versi lengkap adalah P2.
- Pengguna bertanggung jawab memiliki izin atas artwork yang diunggah. Admin berhak menolak konten yang melanggar hukum, hak cipta, atau kebijakan toko.

### 9.4 Simulasi pembayaran

- MVP tidak memproses uang sungguhan dan tidak terhubung ke payment gateway live.
- Metode pembayaran diberi label jelas, misalnya **Transfer (Simulasi)**.
- Pembeli dapat mengunggah gambar bukti simulasi atau mengirim tanda pembayaran demo sesuai implementasi yang disepakati.
- Status pembayaran: `awaiting_proof`, `pending_verification`, `verified`, `rejected`.
- Status order dan status pembayaran disimpan terpisah agar tidak rancu.
- Pembeli tidak dapat menetapkan status `verified` melalui request browser/API.
- Admin hanya memverifikasi setelah memeriksa bukti yang dikirim pada lingkungan simulasi.
- Jika pembayaran ditolak, admin menyertakan alasan dan pembeli dapat mengirim ulang selama order tidak dibatalkan.
- Tidak boleh mengumpulkan nomor kartu, PIN, kata sandi perbankan, atau kredensial finansial.

### 9.5 Pengiriman manual

- Tarif pengiriman ditetapkan melalui daftar area/layanan dan dikelola admin.
- Pembeli hanya dapat memilih tarif yang aktif; ongkir ditampilkan sebelum order final dibuat.
- Area yang tidak memiliki tarif aktif tidak dapat checkout sampai admin menambahkan tarif atau menetapkan prosedur manual yang jelas.
- Admin memasukkan kurir/layanan, nomor resi, dan tanggal pengiriman secara manual.
- Status yang disarankan: `processing`, `shipped`, `completed`; order juga dapat `cancelled` jika aturan pembatalan terpenuhi.
- Nomor resi tidak wajib sebelum order berstatus dikirim.

### 9.6 Transisi status

| Entitas | Status yang direncanakan | Aturan transisi |
|---|---|---|
| Custom request | `submitted`, `under_review`, `revision_requested`, `approved`, `rejected`, `ordered` | Request masuk review; admin menentukan hasil; setelah pembeli menerima penawaran dan order dibuat, status menjadi `ordered`. |
| Payment | `awaiting_proof`, `pending_verification`, `verified`, `rejected` | Pembeli mengirim bukti; admin memverifikasi/menolak; buyer tidak dapat menyetujui sendiri. |
| Order | `awaiting_payment`, `payment_review`, `processing`, `shipped`, `completed`, `cancelled` | Dibuat saat checkout; proses fulfillment hanya setelah pembayaran verified; pembatalan tunduk pada aturan stok. |

## 10. UI/UX Design Guidelines

Ketentuan di bagian ini mengadaptasi `DESIGN.md` yang diberikan. Rancangan mengacu pada karakter sistem tersebut, tetapi tidak menyalin logo, nama, atau identitas visual merek sumber.

### 10.1 Prinsip desain

- **Product-first:** fotografi merchandise menjadi titik fokus; jangan memenuhi halaman dengan dekorasi yang tidak membantu pembelian.
- **Whitespace:** sisakan jarak yang konsisten agar produk, harga, varian, dan tombol mudah dipindai.
- **Kontras aksi:** CTA pemasaran menggunakan hitam; CTA transaksi seperti tambah ke keranjang, lanjut checkout, atau konfirmasi pembelian menggunakan maroon.
- **Konsistensi:** komponen tombol, input, kartu, label status, dan pesan error harus digunakan secara konsisten di halaman terkait.
- **Responsive:** semua fungsi inti dapat dipakai dengan sentuhan di layar kecil, bukan hanya diperkecil dari desktop.
- **Clarity before decoration:** harga, stok, ukuran, ongkir, status pembayaran, dan catatan custom harus jelas.

### 10.2 Warna

| Token | Nilai | Penggunaan |
|---|---|---|
| Primary commerce | `#8E1526` | Tombol beli, tambah ke keranjang, lanjut checkout, aksi transaksi utama |
| Primary pressed | `#6E0F1C` | State tombol aktif/pressed |
| Canvas | `#FFFFFF` | Latar utama dan permukaan kartu |
| Surface soft | `#F3F2F4` | Latar thumbnail, bidang pendukung, search field |
| Ink deep | `#2C2E39` | Hero gelap, headline utama, CTA pemasaran hitam |
| Ink | `#2C2E39` | Teks utama |
| Charcoal | `#5C5D66` | Teks sekunder dan state pressed CTA hitam |
| Hairline soft | `#DEDCE1` | Garis pemisah atau border halus |
| Success | `#247A4D` | Status sukses/tersedia |
| Attention | `#A96500` | Status perlu perhatian |
| Warning | `#A96500` | Promo atau peringatan yang jelas |
| Critical | `#B4233D` | Error, stok habis, atau penolakan |

Catatan implementasi pra-UTS: nilai token di atas mengikuti `assets/css/style.css`. Palet maroon dipakai sebagai aksen brand dan aksi commerce; hindari memakainya sebagai latar teks panjang agar hierarki visual tetap jelas.

### 10.3 Tipografi

- Font display: New Rocker untuk headline brand; font UI: Inter untuk navigasi, tombol, label, dan body. Fallback `Georgia, serif` dan `Arial, sans-serif`.
- Headline hero desktop dapat berada pada rentang sekitar 48–64 px dan turun menjadi 24–36 px pada layar kecil.
- Judul bagian 24–36 px; body utama sekitar 16 px; teks pendukung sekitar 14 px; caption sekitar 12 px.
- Pertahankan line-height body sekitar 1,5 dan hindari teks penting yang terlalu kecil.
- Harga dan CTA harus lebih mudah terlihat daripada metadata sekunder.

### 10.4 Bentuk dan komponen

- Tombol berbentuk kapsul (`border-radius: 999px`) dengan tinggi sentuh sekitar 44 px atau lebih.
- Foto/hero produk menggunakan sudut membulat besar, sekitar 24–32 px; thumbnail menggunakan 8–16 px.
- Kartu produk lebih mengutamakan foto dan whitespace dibanding border/shadow tebal.
- Form input memiliki tinggi sekitar 44 px, label yang jelas, error state, dan instruksi format file.
- Status pembayaran/pesanan menggunakan label teks disertai warna; jangan mengandalkan warna saja.
- Dialog konfirmasi digunakan untuk tindakan yang berdampak seperti pembatalan order atau penghapusan produk.

### 10.5 Navigasi dan halaman

1. **Homepage:** navbar (logo/identitas band, Shop, Custom Studio, pencarian, akun, keranjang), hero gelap dengan CTA, kategori, merchandise unggulan, CTA custom, dan footer.
2. **Katalog:** judul/kategori, search, filter dasar, jumlah hasil, grid produk, harga, status stok, dan state saat tidak ada hasil.
3. **Detail produk:** galeri gambar, nama, harga, deskripsi, varian, kuantitas, stok, CTA biru, serta kebijakan terkait.
4. **Custom Studio:** pilihan produk dan varian, uploader, preview mockup, catatan, estimasi, instruksi hak penggunaan desain, dan status review.
5. **Cart/checkout:** daftar item, kuantitas, subtotal, alamat, pilihan pengiriman, ongkir, total, dan ringkasan transaksi.
6. **Order history/detail:** kode order, item, nominal, status pembayaran, status pemenuhan, catatan, waktu pembaruan, dan resi.
7. **Login/register:** form sederhana dengan validasi inline dan pesan error yang spesifik.
8. **Admin:** navigasi ke produk, kategori/varian, custom request, pembayaran, pesanan, tarif pengiriman, dan ringkasan status.

### 10.6 State yang wajib dirancang

Untuk halaman interaktif, wireframe dan implementasi harus mencakup:

- Loading saat AJAX berlangsung.
- Empty state saat katalog/riwayat kosong.
- Error koneksi dan error validasi.
- Sukses setelah simpan/submit.
- Stok habis atau kuantitas tidak valid.
- Custom request menunggu tinjauan, revisi, disetujui, atau ditolak.
- Bukti pembayaran menunggu verifikasi, terverifikasi, atau ditolak.
- Pesanan menunggu pembayaran, diproses, dikirim, selesai, atau dibatalkan.

## 11. Responsive Requirements

### 11.1 Breakpoint rancangan

Breakpoint berikut mengadaptasi panduan pada `DESIGN.md`. Grid Bootstrap dan CSS media queries dapat dipakai bersama; breakpoint harus diuji dalam browser, bukan hanya mengandalkan tampilan framework.

| Rentang viewport | Tata letak yang diharapkan |
|---|---|
| < 480 px | Navigasi ringkas/hamburger; hero dan form satu kolom; judul mengecil; tombol dan input lebar serta mudah disentuh; tidak ada overflow horizontal. Grid produk boleh dua kolom jika kartu tetap terbaca, jika tidak gunakan satu kolom. |
| 480–767 px | Navigasi mobile; konten utama bertumpuk; kartu fitur satu kolom atau dua kolom jika cukup lebar; detail produk menumpuk gambar di atas pilihan. |
| 768–1023 px | Navigasi kategori dapat tampil; layout dua kolom untuk bagian yang sesuai; formulir/preview custom dapat berdampingan jika muat. |
| 1024–1359 px | Navigasi penuh; katalog multi-kolom; detail produk dapat memakai area galeri dan panel pembelian berdampingan. |
| ≥ 1360 px | Maksimum lebar konten dibatasi sekitar 1280 px dengan gutter lebih besar; jangan membentangkan teks terlalu lebar. |

### 11.2 Aturan responsif wajib

- Gunakan layout berbasis Bootstrap Grid dan komponen responsif.
- Semua foto memakai `max-width: 100%`, rasio yang konsisten, dan perilaku `object-fit` sesuai jenis gambar.
- Tidak boleh ada elemen penting yang tertutup, terpotong, atau membutuhkan zoom horizontal.
- Pada layar sempit, form checkout dan custom disusun vertikal; preview diletakkan dekat dengan kontrol terkait.
- Tabel admin harus bisa digulir secara horizontal dalam wadahnya atau berubah menjadi tampilan kartu; bukan menyebabkan seluruh halaman melebar.
- Tombol utama tidak boleh berada terlalu dekat dengan aksi destruktif.
- Error/validation text harus membungkus secara alami dan tidak keluar dari kartu.
- Uji keyboard dan fokus input selain sentuhan.

### 11.3 Viewport minimum uji

`360 × 800`, `390 × 844`, `768 × 1024`, `1024 × 768`, `1366 × 768`, dan `1440 × 900`. Ukuran tersebut adalah viewport pengujian proyek, bukan klaim dukungan perangkat tertentu.

## 12. Teknologi dan Arsitektur

### 12.1 Tahap pra-UTS: prototype UI

- HTML untuk struktur halaman.
- CSS untuk token visual dan penyesuaian desain.
- Bootstrap untuk grid, form, navbar, modal, dan komponen responsif.
- jQuery untuk interaksi prototype dan simulasi perubahan UI.
- Data dummy lokal untuk produk, varian, stok, pesanan, dan status.
- Belum wajib ada backend/database transaksi pada tahap prototype.

### 12.2 Tahap pasca-UTS: fullstack

- PHP native untuk controller/proses bisnis dan endpoint.
- MySQL/MariaDB dari XAMPP sebagai database.
- PDO atau MySQLi dengan prepared statements untuk query database; gunakan satu pendekatan secara konsisten.
- AJAX/jQuery untuk request asinkron dengan payload/response JSON pada fitur yang sesuai.
- Session PHP untuk autentikasi.
- Git untuk versi kode dan commit bertahap.
- phpMyAdmin untuk inspeksi dan pengelolaan database lokal.

Versi minor perangkat lunak dan sumber asset belum ditetapkan; versi harus dipin sebelum implementasi agar dependensi konsisten. React, Laravel, dan framework backend lain tidak digunakan pada rencana awal kecuali dosen menyetujuinya.

### 12.3 Prinsip arsitektur

- Pisahkan tampilan, logika bisnis, dan akses data secara sederhana meskipun menggunakan PHP native.
- Browser tidak menjadi sumber kebenaran harga, stok, role, atau status pembayaran; semuanya diverifikasi di server.
- Operasi checkout dan perubahan stok dilakukan dalam transaksi database agar data tidak setengah tersimpan.
- Gunakan HTTP status code dan bentuk respons JSON yang konsisten.
- Simpan file upload dengan nama acak, validasi server, dan akses yang dikendalikan.

## 13. Skema Database Awal

Skema ini merupakan rancangan konseptual; nama kolom dan normalisasi akhir dapat disesuaikan saat ERD dibuat. Semua tabel transaksional sebaiknya memakai primary key, foreign key, waktu pembuatan, dan indeks yang sesuai.

| Tabel | Fungsi dan kolom utama |
|---|---|
| `users` | `id`, `name`, `email` (unique), `password_hash`, `role` (`buyer`/`admin`), `is_active`, `created_at`, `updated_at` |
| `categories` | `id`, `name`, `slug`, `is_active`, `created_at` |
| `products` | `id`, `category_id`, `name`, `slug`, `description`, `product_type` (`official`/`custom_base`), `base_price`, `cover_image`, `is_active`, `created_at`, `updated_at` |
| `product_images` | `id`, `product_id`, `file_path`, `alt_text`, `sort_order` |
| `product_variants` | `id`, `product_id`, `sku` (unique), `size`, `color`, `price_adjustment`, `stock_qty`, `is_active` |
| `shipping_rates` | `id`, `area_code/name`, `service_name`, `fee`, `is_active`, `updated_by`, `updated_at` |
| `custom_requests` | `id`, `user_id`, `product_id`, `size`, `color`, `quantity`, `design_file_path`, `design_notes`, `status`, `quoted_unit_price`, `admin_note`, `created_at`, `reviewed_at`, `updated_at` |
| `orders` | `id`, `order_code` (unique), `user_id`, `order_type` (`official`/`custom`), `custom_request_id` (nullable/unique), `status`, `subtotal`, `shipping_rate_id`, `shipping_fee`, snapshot alamat penerima, `courier_name`, `tracking_number`, `created_at`, `updated_at`, `paid_at`, `shipped_at` |
| `order_items` | `id`, `order_id`, `product_id` (nullable jika diperlukan untuk snapshot), `variant_id` (nullable sesuai jenis), `product_name_snapshot`, `sku_snapshot`, `size_snapshot`, `color_snapshot`, `unit_price`, `quantity`, `line_total` |
| `payments` | `id`, `order_id`, `method` (simulasi), `amount`, `status`, `proof_file_path`, `submitted_at`, `verified_by`, `verified_at`, `rejection_note`, `updated_at` |
| `order_status_history` | `id`, `order_id`, `old_status`, `new_status`, `changed_by`, `note`, `created_at` |

### 13.1 Relasi inti

- Satu kategori dapat memiliki banyak produk.
- Satu produk dapat mempunyai banyak foto dan varian.
- Satu buyer dapat mempunyai banyak custom request dan order.
- Satu order memiliki satu atau lebih item untuk order reguler; order custom MVP berisi satu konfigurasi custom yang telah disetujui.
- Satu order mempunyai satu catatan pembayaran aktif pada MVP. Jika percobaan pembayaran berulang perlu dilacak secara lengkap, skema dapat dikembangkan menjadi payment attempts terpisah.
- Satu order dapat mempunyai banyak catatan riwayat status.
- `verified_by` mengacu ke user admin yang memverifikasi pembayaran.

### 13.2 Catatan desain data

- Gunakan `DECIMAL` hanya jika kebutuhan nilai memerlukan pecahan; untuk harga IDR tanpa pecahan, integer cukup.
- Gunakan foreign key dan indeks email, SKU, order code, foreign key, dan kolom status yang sering difilter.
- Jangan menyimpan password plaintext.
- Simpan snapshot harga/alamat pada order agar perubahan data master tidak mengubah transaksi historis.
- Tentukan kebijakan penghapusan: order dan pembayaran tidak dihapus permanen melalui operasi admin biasa; lebih aman menggunakan status atau soft delete untuk data master.

## 14. Kebutuhan AJAX/JSON API

Semua endpoint berikut adalah rancangan, belum dibuat. Endpoint dapat berupa file PHP native terpisah atau struktur setara yang disepakati saat implementasi.

| Endpoint rancangan | Metode | Akses | Tujuan |
|---|---|---|---|
| `/api/products.php` | GET | Publik | Pencarian/filter produk dengan JSON |
| `/api/cart/add.php` | POST | Buyer | Menambah varian/kuantitas ke keranjang dan memvalidasi stok |
| `/api/cart/update.php` | POST | Buyer | Memperbarui kuantitas/hapus item dan mengembalikan ringkasan total |
| `/api/custom/estimate.php` | POST | Buyer | Menghitung estimasi custom dari tabel harga server; tidak menerima total final yang dipercaya begitu saja dari client |
| `/api/custom/submit.php` | POST multipart | Buyer | Membuat custom request dan mengembalikan status awal |
| `/api/checkout/create-order.php` | POST | Buyer | Validasi keranjang, hitung total server-side, reservasi stok, simpan order dalam transaksi DB |
| `/api/payments/submit-proof.php` | POST multipart | Pemilik order | Mengunggah bukti simulasi dan mengubah payment menjadi `pending_verification` |
| `/api/orders/detail.php` | GET | Pemilik order/admin | Mengembalikan detail order; buyer hanya boleh melihat order sendiri |
| `/api/admin/custom-review.php` | POST | Admin | Approve/request revision/reject request dan menetapkan harga/catatan |
| `/api/admin/payment-verify.php` | POST | Admin | Memverifikasi/menolak bukti pembayaran |
| `/api/admin/order-status.php` | POST | Admin | Memperbarui status, kurir, dan resi serta mencatat riwayat |

### 14.1 Format respons yang disarankan

Berhasil:

```json
{
  "success": true,
  "message": "Item berhasil ditambahkan ke keranjang.",
  "data": {
    "cart_count": 2,
    "subtotal": 298000
  }
}
```

Gagal validasi:

```json
{
  "success": false,
  "message": "Kuantitas melebihi stok yang tersedia.",
  "errors": {
    "quantity": "Stok tersedia: 1"
  }
}
```

### 14.2 Ketentuan API

- Gunakan HTTP status yang sesuai, misalnya `200/201` untuk berhasil, `400` untuk request tidak valid, `401` untuk belum login, `403` untuk role tidak berhak, `404` untuk data tidak ditemukan, `409` untuk konflik stok/status, dan `500` untuk kesalahan server tanpa detail internal.
- Jangan mengirim stack trace, query SQL, path server, password, atau data sensitif kepada browser.
- Validasi data di browser untuk kenyamanan dan ulangi validasi pada server untuk keamanan.
- Gunakan CSRF token/session validation untuk endpoint perubahan data.
- Semua endpoint perubahan status harus memeriksa role pada server.
- Respons JSON harus konsisten dan tidak mencampur output HTML/warning PHP.

## 15. Keamanan, Privasi, dan Integritas

1. **Autentikasi:** gunakan `password_hash()` dan `password_verify()`, regenerasi session ID setelah login, logout dengan menghancurkan sesi, dan cookie sesi dengan flag yang sesuai.
2. **Autorisasi:** periksa role dan kepemilikan order/request di server pada setiap request; menyembunyikan tombol saja tidak cukup.
3. **SQL injection:** gunakan prepared statements; jangan menyusun query dari input mentah.
4. **XSS:** escape teks pengguna ketika ditampilkan; validasi input dan jangan menjalankan konten upload.
5. **CSRF:** gunakan token untuk form dan endpoint POST yang mengubah data.
6. **Validasi upload:** batasi MIME/ekstensi, ukuran, dimensi jika diperlukan, nama file acak, dan jenis file; tolak file executable/script; cegah direktori upload mengeksekusi PHP.
7. **Penyimpanan file:** file desain dan bukti pembayaran sebaiknya berada pada direktori yang tidak bisa dieksekusi dan hanya dapat diakses melalui handler yang mengotorisasi pemilik/admin.
8. **Data pembayaran:** hanya simulasikan; jangan meminta PIN, password perbankan, atau nomor kartu. Jangan klaim pembayaran sungguhan telah terjadi.
9. **Harga dan stok:** hitung dan validasi ulang server-side; gunakan transaksi database untuk order dan perubahan stok.
10. **Hak akses file:** pembeli hanya dapat melihat file desain, bukti, dan order miliknya; admin dapat melihat file yang diperlukan untuk review.
11. **Error handling:** tampilkan pesan ramah kepada pengguna, tetapi simpan detail teknis di log lokal tanpa password/token.
12. **Data pribadi:** kumpulkan hanya informasi yang dibutuhkan untuk akun, pengiriman, dan order; jangan memasukkannya ke repository publik atau contoh screenshot.
13. **Repository:** file konfigurasi dengan credential tidak boleh di-commit; sediakan `.env.example` atau konfigurasi contoh tanpa rahasia jika diperlukan.
14. **Produksi:** XAMPP hanya untuk lingkungan lokal tugas. Deployment publik memerlukan HTTPS, konfigurasi server aman, proteksi upload, backup, dan review keamanan tambahan.

## 16. Non-Functional Requirements

| ID | Area | Persyaratan |
|---|---|---|
| NFR-01 | Responsif | Layout berfungsi pada viewport 360 px sampai desktop lebar dan tidak menimbulkan overflow horizontal pada halaman umum. |
| NFR-02 | Usability | Harga, stok, varian, biaya pengiriman, status, dan tindakan berikutnya dapat dipahami tanpa instruksi panjang. |
| NFR-03 | Accessibility dasar | Navigasi keyboard yang masuk akal, label form, alt text gambar produk, fokus terlihat, dan status tidak hanya dibedakan oleh warna. |
| NFR-04 | Performance | Foto dioptimalkan, gambar di bawah fold dapat menggunakan lazy loading, dan query katalog memakai indeks yang sesuai. Target awal: halaman utama lokal dapat digunakan dalam sekitar 3 detik pada lingkungan uji normal; hasil perlu diukur dan tidak dijamin pada semua perangkat/jaringan. |
| NFR-05 | Security | Semua perubahan data diverifikasi di server; query parametrik; upload divalidasi; kontrol role dan kepemilikan diterapkan. |
| NFR-06 | Reliability | Transaksi order dan stok menghindari data parsial; kegagalan tidak boleh membuat status pembayaran palsu atau stok berubah dua kali. |
| NFR-07 | Maintainability | Struktur file dan penamaan konsisten, konfigurasi dipisahkan, logika perhitungan tidak diduplikasi di banyak halaman. |
| NFR-08 | Compatibility | Pengujian utama dilakukan di versi terkini Chrome/Edge pada desktop dan minimal satu browser mobile modern jika tersedia. |
| NFR-09 | Local setup | Aplikasi dapat dijalankan dengan instruksi tertulis menggunakan XAMPP, database SQL, dan konfigurasi contoh. |
| NFR-10 | Traceability | Persyaratan utama memiliki ID dan dipetakan pada test checklist serta status PASS/FAIL. |

## 17. Acceptance Criteria (Definition of Done)

### 17.1 Frontend/UTS

- [ ] Project Brief, daftar kebutuhan, user stories, user flow, entitas awal, business rules, dan wireframe tersedia.
- [ ] Enam bagian UI dasar yang disyaratkan dalam materi tugas ditunjukkan: landing/login, dashboard/home, halaman data, form, detail, dan responsive layout. Nama halaman disesuaikan dengan konteks toko.
- [ ] Katalog, detail produk, custom studio, cart/checkout, dan mockup admin dapat didemonstrasikan menggunakan data dummy.
- [ ] Bootstrap dan jQuery digunakan sesuai kebutuhan; tombol dan kontrol prototype memberikan respons yang dapat dilihat.
- [ ] Tampilan diuji pada mobile, tablet, dan desktop; tidak ada teks terpotong atau scroll horizontal yang tidak disengaja.
- [ ] Source code dan progres kerja dikelola dalam Git.

### 17.2 Fullstack/pasca-UTS

- [ ] Registrasi, login, logout, dan kontrol role berjalan.
- [ ] CRUD produk, kategori, varian, stok, dan kebutuhan admin berjalan dengan validasi.
- [ ] Checkout menyimpan order dan item dengan snapshot harga, varian, ongkir, dan total yang benar.
- [ ] Stok tidak menjadi negatif; reservasi dan pengembalian stok tidak dilakukan dua kali.
- [ ] Custom request mendukung upload valid, preview mockup, review admin, revisi/penolakan, serta penetapan harga final.
- [ ] Custom order tidak bisa dibayar sebelum penawaran disetujui pembeli.
- [ ] Bukti pembayaran membuat status menunggu verifikasi; hanya admin yang dapat menyetujui pembayaran.
- [ ] Order belum diproses/dikirim sebelum pembayaran disetujui.
- [ ] Pembeli tidak dapat membuka order atau file milik pengguna lain.
- [ ] Status pengiriman dan resi tampil pada detail order setelah diinput admin.
- [ ] Minimal satu fitur inti memakai AJAX dengan JSON; endpoint mengirim status HTTP dan error yang konsisten.
- [ ] Ada file SQL/database seed, README, test checklist dengan PASS/FAIL, dan cara menjalankan proyek secara lokal.
- [ ] Demo dapat dijalankan oleh orang lain mengikuti instruksi tanpa membutuhkan credential rahasia atau layanan berbayar.

## 18. Prioritas MVP

### P0 — Harus selesai

- Login/register dan role.
- Homepage, katalog, detail, cart, checkout.
- Admin CRUD produk, varian, stok, dan kategori.
- Custom request dengan upload serta preview mockup.
- Review desain dan konfirmasi harga final.
- Pembayaran simulasi dan verifikasi admin.
- Tarif kirim manual, resi, dan status order.
- AJAX/JSON pada satu atau lebih fitur inti.
- Validasi, keamanan dasar, responsive, test checklist, dokumentasi.

### P1 — Jika waktu cukup

- Filter produk yang lebih lengkap.
- Dashboard ringkas untuk admin.
- Riwayat transisi status yang dapat dilihat pembeli.
- Pembeli dapat menandai order selesai diterima.
- Pencarian dan sortir lebih lanjut.

### P2 — Tidak menjadi penghalang MVP

- Mockup editor drag/scale dan sisi depan-belakang.
- Gateway pembayaran live, API ekspedisi, notifikasi email.
- Wishlist, promo lanjutan, laporan analitik, atau fitur komunitas.

## 19. Rencana Tahapan Pengerjaan

Jadwal kalender detail belum ditentukan. Urutan berikut berorientasi pada tahapan tugas dan dapat disesuaikan dengan tanggal UTS serta tenggat resmi dosen.

### Tahap A — Perencanaan
1. Konfirmasi nama band/brand dan aset yang boleh digunakan.
2. Finalisasi PRD dan minta persetujuan dosen untuk scope.
3. Buat user flow, daftar kebutuhan, business rules, dan ERD awal.
4. Tetapkan design tokens serta wireframe halaman inti.
5. Buat repository Git dan struktur folder.

**Output:** PRD, Project Brief 1 halaman, user stories, user flow, ERD awal, wireframe, repository.

### Tahap B — Frontend sebelum UTS
1. Bangun struktur HTML dan CSS serta Bootstrap.
2. Implementasikan homepage, katalog, detail produk, login/register prototype, cart/checkout, custom studio, dan tampilan admin yang perlu didemonstrasikan.
3. Gunakan data dummy yang representatif.
4. Implementasikan interaksi jQuery untuk filter, varian, kuantitas, kalkulasi estimasi, dan preview mockup.
5. Lakukan pengujian responsif dan revisi UI.
6. Siapkan demo dan dokumentasi frontend.

**Output:** prototype UI, source code frontend, bukti pengujian UI, demo UTS.

### Tahap C — Backend/database setelah UTS
1. Buat database MySQL dan jalankan migration/SQL seed.
2. Implementasikan koneksi PHP dan autentikasi berbasis session.
3. Buat CRUD produk/kategori/varian.
4. Integrasikan katalog, cart, checkout, order, dan stok.
5. Implementasikan custom request, upload aman, preview, admin review, dan penawaran harga.
6. Implementasikan pembayaran simulasi dengan verifikasi admin.
7. Implementasikan tarif kirim, resi, status pemenuhan, dan riwayat.
8. Integrasikan endpoint AJAX/JSON serta validasi server.

**Output:** aplikasi fullstack lokal, SQL/seed, endpoint API, instruksi setup.

### Tahap D — Testing dan pengumpulan akhir
1. Jalankan uji fungsional per requirement ID.
2. Uji hak akses, upload, harga, stok, pembayaran, serta perpindahan status.
3. Uji responsif di viewport yang ditetapkan.
4. Perbaiki bug dan lakukan regresi.
5. Rapikan README, test checklist, dokumentasi, slide/demo, dan commit Git.

**Output:** source code final, SQL, README, test checklist PASS/FAIL, dokumentasi API, slide presentasi, demo.

## 20. Test Plan

| ID tes | Skenario | Hasil yang diharapkan |
|---|---|---|
| TC-01 | Mendaftar dengan email baru | Akun buyer dibuat dan password tersimpan sebagai hash. |
| TC-02 | Mendaftar dengan email yang sudah dipakai | Sistem menolak dengan pesan validasi. |
| TC-03 | Buyer membuka URL admin secara langsung | Akses ditolak di sisi server. |
| TC-04 | Menambah item dengan varian valid | Item masuk keranjang dan total diperbarui. |
| TC-05 | Memesan kuantitas melebihi stok | Request ditolak; stok tidak berubah menjadi negatif. |
| TC-06 | Checkout dengan ongkir tersedia | Total sama dengan subtotal plus ongkir dan tersimpan konsisten. |
| TC-07 | Harga produk berubah setelah order dibuat | Snapshot harga order lama tetap sama. |
| TC-08 | Upload desain berformat/ukuran diperbolehkan | File diterima, tersimpan aman, dan preview muncul. |
| TC-09 | Upload file executable atau file melebihi batas | Server menolak upload tanpa menyimpan file berbahaya. |
| TC-10 | Pembeli mengirim custom request | Status request masuk ke antrean review admin. |
| TC-11 | Pembeli mencoba membayar sebelum custom disetujui | Sistem menolak pembuatan pembayaran/order custom. |
| TC-12 | Admin menyetujui desain dan menetapkan harga final | Pembeli dapat melihat penawaran dan menerima/menolak. |
| TC-13 | Buyer mencoba memanggil endpoint verifikasi pembayaran | Server merespons 403 atau menolak aksi. |
| TC-14 | Bukti simulasi diunggah | Status menunggu verifikasi dan order belum diproses. |
| TC-15 | Admin menolak bukti pembayaran | Status ditolak, alasan tersimpan, dan pembeli diberi informasi. |
| TC-16 | Admin memverifikasi bukti | Payment menjadi verified dan order masuk pemrosesan. |
| TC-17 | Admin input kurir/resi dan status shipped | Detail order buyer menampilkan kurir, resi, dan status terbaru. |
| TC-18 | Buyer mencoba membuka order milik orang lain | Server menolak akses data. |
| TC-19 | AJAX mengirim request valid/tidak valid | JSON konsisten, status HTTP sesuai, UI memperbarui feedback. |
| TC-20 | Layar 360, 390, 768, 1024, 1366, 1440 px | Konten dan kontrol penting terlihat serta dapat digunakan tanpa overflow yang tidak disengaja. |
| TC-21 | Menghapus/membatalkan order yang stoknya telah direservasi | Stok dikembalikan tepat satu kali sesuai kebijakan. |
| TC-22 | Form dikirim dengan CSRF token tidak valid | Server menolak perubahan. |

Setiap test dicatat pada checklist dengan kolom: test ID, requirement ID, prasyarat, langkah, expected result, actual result, status PASS/FAIL, dan catatan/bukti.

## 21. Deployment Lokal dan Struktur Direktori

### 21.1 Langkah setup yang direncanakan

1. Instal dan jalankan XAMPP; aktifkan Apache dan MySQL.
2. Letakkan folder proyek di direktori web lokal, misalnya `htdocs/merchverse/`.
3. Buat database `merchverse` melalui phpMyAdmin.
4. Impor file skema dan data awal SQL.
5. Salin `config.example.php` ke konfigurasi lokal dan isi pengaturan koneksi lokal; file rahasia tidak dikomit ke Git.
6. Buat akun admin lokal melalui seed/prosedur aman dan gunakan password demo yang diganti saat diperlukan.
7. Buka aplikasi melalui `http://localhost/merchverse/`.
8. Jalankan checklist pengujian awal dan periksa log PHP bila terjadi error.

### 21.2 Struktur folder awal

```text
merchverse/
├── index.php
├── login.php
├── register.php
├── shop/
│   ├── index.php
│   └── detail.php
├── custom/
│   ├── studio.php
│   └── status.php
├── cart/
│   └── index.php
├── checkout/
│   └── index.php
├── orders/
│   ├── index.php
│   └── detail.php
├── admin/
│   ├── dashboard.php
│   ├── products/
│   ├── orders/
│   ├── custom-requests/
│   └── payments/
├── api/
│   ├── products.php
│   ├── cart/
│   ├── custom/
│   ├── checkout/
│   ├── payments/
│   ├── orders/
│   └── admin/
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── storage/
│   ├── designs/
│   └── payment-proofs/
├── includes/
│   ├── auth.php
│   ├── db.php
│   ├── csrf.php
│   └── helpers.php
├── database/
│   ├── schema.sql
│   └── seed.sql
├── config.example.php
├── .gitignore
└── README.md
```

Struktur ini adalah usulan awal. Folder dapat disesuaikan selama pemisahan kode, endpoint, assets, database, dan storage tetap jelas. Direktori upload harus dilindungi agar file tidak dapat dieksekusi atau diakses pengguna lain tanpa otorisasi.

## 22. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Scope terlalu besar | Fitur inti tidak selesai | Prioritaskan P0; jadikan gateway live, API ekspedisi, dan editor lanjutan out of scope. |
| Desain custom tidak jelas/ilegal | Komplain atau masalah hak cipta | Admin review, catatan persetujuan, aturan hak penggunaan artwork. |
| Upload berbahaya | Risiko keamanan server | Validasi server, nama acak, batas ukuran, direktori non-eksekusi, akses terkontrol. |
| Status pembayaran dipalsukan | Order diproses tanpa verifikasi | Verifikasi di server oleh role admin; tidak mempercayai status dari browser. |
| Stok tidak konsisten | Overselling atau stok ganda | Transaksi database, pemeriksaan stok saat checkout, aturan reservasi dan pengembalian stok idempoten. |
| Layout rusak di perangkat kecil | Pengalaman mobile buruk | Wireframe responsif sejak awal dan pengujian pada viewport target. |
| Artwork tidak berizin | Masalah hak cipta/merek | Gunakan band fiktif atau aset yang berizin; hindari mengklaim afiliasi resmi tanpa izin. |
| Dependensi/version tidak konsisten | Aplikasi gagal dijalankan di perangkat lain | Cantumkan versi dan langkah setup di README; uji ulang pada instalasi bersih. |
| Bukti pembayaran menyimpan data pribadi | Paparan data | Gunakan bukti demo, batasi akses, dan jangan gunakan kredensial keuangan nyata. |

## 23. Asumsi dan Hal yang Masih Perlu Dikonfirmasi

Keputusan yang telah diberikan pengguna:

- Satu toko untuk satu band.
- Custom merch mendukung unggah desain dan preview mockup langsung.
- Pembayaran disimulasikan dan diverifikasi admin.
- Ongkir, kurir, resi, dan status pengiriman dikelola manual.
- Pembayaran custom dilakukan penuh setelah desain disetujui.
- Pembeli wajib login; role admin terpisah.
- Harus responsif pada HP, tablet, dan desktop.
- Frontend: HTML, CSS, Bootstrap, jQuery sebelum UTS.
- Backend: PHP native, MySQL, CRUD, AJAX/JSON setelah UTS; XAMPP dan Git.
- Visual mengikuti prinsip dalam `DESIGN.md`.

Asumsi rancangan yang masih memerlukan persetujuan:

1. Nama band, logo, dan katalog produk menggunakan placeholder sampai identitas/aset final disetujui.
2. MVP mempunyai satu toko dan role admin tunggal secara fungsional; aplikasi dapat memiliki lebih dari satu akun admin jika diperlukan tanpa mengubah model multi-penjual.
3. Checkout produk reguler dan custom dipisahkan.
4. Preview custom menggunakan gambar mockup statis dan artwork sebagai overlay pada area cetak depan; editor yang dapat menggeser/mengubah skala artwork belum menjadi syarat P0.
5. Batas file upload awal adalah 5 MB dengan JPEG/PNG/WebP.
6. Admin menetapkan harga final custom setelah meninjau desain.
7. Ongkir dipilih dari tarif area/layanan yang sudah dimasukkan admin; tidak ada kalkulasi API kurir.
8. Bukti pembayaran adalah bukti simulasi dan tidak merepresentasikan transfer sungguhan.
9. Status final pembatalan/refund, tenggat pembayaran, dan batas revisi desain perlu disepakati sebelum implementasi.
10. Nama produk, harga, tarif pengiriman, kebijakan privasi, syarat penggunaan, dan copy halaman final belum ditetapkan.
11. Tanggal tenggat dan rubrik penilaian aktual mengikuti instruksi dosen; PRD ini tidak menggantikan persetujuan dosen.

## 24. Out of Scope (Ditegaskan)

Fitur berikut sengaja tidak dijadikan syarat kelulusan MVP: pembayaran live, integrasi kurir, multi-vendor, editor desain tingkat lanjut, AI image generation, sistem refund otomatis, chat real-time, aplikasi mobile native, promosi kompleks, dan notifikasi email otomatis. Fitur tersebut hanya ditambahkan jika scope inti disetujui dan waktu tersisa.

## 25. Glosarium

- **PRD:** Product Requirements Document; dokumen yang mendefinisikan tujuan, scope, perilaku, dan kriteria penerimaan produk.
- **MVP:** Minimum Viable Product; lingkup fungsi terkecil yang masih dapat didemonstrasikan secara utuh.
- **CRUD:** Create, Read, Update, Delete.
- **AJAX:** Teknik browser mengirim request tanpa reload penuh.
- **JSON:** Format data untuk pertukaran informasi antara frontend dan backend.
- **Mockup:** Representasi visual untuk memperlihatkan perkiraan letak desain pada produk.
- **Snapshot order:** Salinan nilai transaksi saat pembelian dibuat agar histori tidak berubah ketika data katalog diedit.
- **Reservasi stok:** Pengurangan stok tersedia saat order dibuat agar unit yang sama tidak dijual berlebihan.
- **Payment simulation:** Alur demo untuk mempraktikkan status dan verifikasi pembayaran tanpa memindahkan uang sungguhan.

## 26. Referensi dan Dasar Penyusunan

1. **Penugasan Proyek Pemrograman Web Fullstack** — materi tugas yang diunggah pengguna; menjadi acuan tahapan analisis kebutuhan, prototype UI sebelum UTS, dan pengembangan fullstack setelah UTS.
2. **`DESIGN.md`** — file desain yang diunggah pengguna; menjadi acuan adaptasi warna, tipografi, tombol, kartu produk, whitespace, navigasi, dan responsivitas.
3. **Keputusan produk dalam percakapan** — model satu toko untuk satu band, custom upload + preview, pembayaran simulasi diverifikasi admin, pengiriman manual, pembayaran penuh custom setelah desain disetujui, akun buyer dan admin, serta kebutuhan responsif.

