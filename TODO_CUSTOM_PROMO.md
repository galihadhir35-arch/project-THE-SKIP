TODO: Promosi Custom Merch Studio (tanpa mengubah logika bisnis / struktur data / id-class JS)

1. index.php — Hero: dua CTA bobot sama (btn--promo "Lihat koleksi", btn--primary "Mulai custom merch").
2. index.php — Pindahkan .custom-feature tepat setelah hero; latar --color-dark, padding lebih besar, CTA "Buka Custom Studio", visual mockup custom-base.svg + custom-base-hoodie.svg, 3 poin sistem.
3. index.php — collection-card--custom lebih lebar 2 kolom desktop + label "Fitur unggulan".
4. header.php — "Custom Studio": huruf tebal + titik aksen --color-primary; mobile: setelah Katalog; footer tetap.
5. shop/index.php — "Butuh Custom Merch?" jadi btn--primary; banner lebar di bawah grid (incl. hasil kosong); produk custom_base badge "Custom".
6. custom/studio.php — stepper 4 langkah (JS ringan di app.js), preview sticky diperkuat, estimasi + catatan jelas, pesan login ramah + tombol Masuk/Daftar.
7. Keranjang/pesanan — badge "Custom" pada item custom + tautan status request (gunakan field existing: type "custom", customRequestId).
8. Verifikasi: php -l semua file PHP, node --check JS, dev server 1366px & 390px, main-flow e2e.
