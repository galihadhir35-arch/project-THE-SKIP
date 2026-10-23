<?php
$pageTitle = 'Custom Merch Studio';
$activeNav = 'custom';
include "../includes/header.php";
?>

<section class="section">
  <div class="container">
    <div class="page-head">
      <div>
        <h1>Custom Merch Studio</h1>
        <p class="muted">Pilih produk dasar, unggah desain, lihat preview mockup, lalu kirim untuk ditinjau admin.</p>
      </div>
      <a href="<?= base_url('custom/status.php') ?>" class="btn btn--outline btn--sm">Status Permintaan Saya</a>
    </div>

    <div class="alert alert--info" id="studio-login-notice" hidden>
      Anda belum masuk. Anda tetap bisa menyiapkan desain, tetapi harus <a class="link" href="<?= base_url('login.php?next=custom/studio.php') ?>">masuk</a> untuk mengirim permintaan.
    </div>

    <div class="studio-layout">
      <div class="stack">
        <section class="panel">
          <h2 class="panel__title">1. Pilih Produk Dasar</h2>
          <div class="form-group">
            <label for="custom-product">Produk</label>
            <select id="custom-product" class="form-control"></select>
          </div>

          <div class="form-group">
            <label>Ukuran</label>
            <div class="filter-chips" id="size-chips"></div>
          </div>

          <div class="form-group">
            <label>Warna</label>
            <div class="filter-chips" id="color-chips"></div>
          </div>

          <div class="form-group">
            <label for="custom-qty">Jumlah</label>
            <input type="number" id="custom-qty" value="1" min="1" max="50" class="form-control">
            <p class="form-hint" id="custom-variant-info"></p>
          </div>

          <div class="form-group">
            <label for="custom-notes">Catatan untuk Admin</label>
            <textarea id="custom-notes" rows="3" class="form-control" placeholder="Contoh: letakkan di dada kiri, warna cerah, tambahkan teks tur 2026…"></textarea>
          </div>

          <div class="form-group">
            <label for="design-file">Unggah Desain (JPEG / PNG / WebP maks. 5 MB)</label>
            <input type="file" id="design-file" accept="image/jpeg,image/png,image/webp" class="file-input">
            <p class="form-hint">Pastikan Anda memiliki hak atas artwork yang diunggah. Preview bersifat indikatif.</p>
          </div>
        </section>
      </div>

      <aside class="stack">
        <section class="panel studio-preview-panel">
          <div class="panel__head">
            <h2 class="panel__title">2. Preview Mockup</h2>
            <span class="badge badge--neutral">Indikatif</span>
          </div>
          <div class="mockup">
            <img id="mockup-base" class="mockup__base" src="<?= asset_url('images/products/tshirt-classic.svg') ?>" alt="Mockup produk">
            <img id="mockup-art" class="mockup__art" src="" alt="Preview desain" hidden>
            <div class="mockup__empty" id="mockup-empty">Desain akan tampil di area cetak setelah diunggah</div>
          </div>
          <div class="estimate-box" id="custom-estimate"></div>
          <button class="btn btn--primary w-100 mt-m" id="submit-custom" type="button">Kirim Permintaan Custom</button>
          <p class="form-hint mt-s">Admin akan meninjau desain dan menetapkan harga final sebelum pembayaran. Estimasi bukan harga final.</p>
        </section>
      </aside>
    </div>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
