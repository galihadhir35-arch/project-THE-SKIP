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
      <p style="margin: 0 0 var(--spacing-s);">Masuk untuk mengirim permintaan. Anda tetap bisa menyiapkan desain dulu.</p>
      <div class="form-actions">
        <a href="<?= base_url('login.php?next=' . urlencode('custom/studio.php')) ?>" class="btn btn--primary">Masuk</a>
        <a href="<?= base_url('register.php') ?>" class="btn btn--outline">Daftar</a>
      </div>
    </div>

    <div class="studio-layout">
      <div class="studio-stepper-wrap">
        <ol class="studio-stepper" id="studio-stepper">
          <li class="studio-stepper__step studio-stepper__step--active" data-step="1">
            <span class="studio-stepper__num">01</span>
            <span class="studio-stepper__label">Pilih produk</span>
          </li>
          <li class="studio-stepper__step" data-step="2">
            <span class="studio-stepper__num">02</span>
            <span class="studio-stepper__label">Unggah desain</span>
          </li>
          <li class="studio-stepper__step" data-step="3">
            <span class="studio-stepper__num">03</span>
            <span class="studio-stepper__label">Kirim untuk ditinjau</span>
          </li>
          <li class="studio-stepper__step" data-step="4">
            <span class="studio-stepper__num">04</span>
            <span class="studio-stepper__label">Penawaran &amp; bayar</span>
          </li>
        </ol>
      </div>

      <div class="studio-body row g-4 align-items-start">
        <!-- Preview di kiri (sticky desktop / atas mobile), form di kanan desktop / bawah mobile -->
        <div class="col-12 col-lg-6 studio-preview-col">
        <section class="panel studio-preview-panel">
          <div class="panel__head">
            <h2 class="panel__title">Preview Mockup</h2>
            <span class="badge badge--neutral">Indikatif</span>
          </div>
          <div class="mockup studio-mockup">
            <img id="mockup-base" class="mockup__base" src="<?= asset_url('images/products/custom tshirt.jpg') ?>" alt="Mockup kaos custom" onerror="this.src='<?= asset_url('images/products/placeholder.svg') ?>'">
            <img id="mockup-art" class="mockup__art" src="" alt="Preview desain" hidden>
            <div class="mockup__empty" id="mockup-empty">Desain akan tampil di area cetak setelah diunggah</div>
          </div>
        </section>
        </div>

        <div class="col-12 col-lg-6">
        <div class="stack">
          <section class="panel">
            <div class="panel__head">
              <h2 class="panel__title"><span class="studio-step-label">01</span> Pilih Produk</h2>
            </div>

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
          </section>

          <section class="panel">
            <div class="panel__head">
              <h2 class="panel__title"><span class="studio-step-label">02</span> Unggah Desain</h2>
            </div>

            <div class="form-group">
              <label for="design-file">File Desain</label>
              <div class="file-drop" id="design-drop">
                <input type="file" id="design-file" accept="image/jpeg,image/png,image/webp" class="file-input file-drop__input" aria-hidden="true" tabindex="-1">
                <div class="file-drop__target" id="design-drop-target" role="button" tabindex="0" aria-label="Pilih file desain, tekan Enter atau Spasi untuk membuka kotak unggah">
                  <div class="file-drop__icon"><?= icon('upload', 'icon icon--lg') ?></div>
                  <div class="file-drop__label">
                    <strong class="file-drop__title">Pilih file desain atau seret ke sini</strong>
                    <p class="file-drop__hint">JPEG, PNG, atau WebP, maksimal 5 MB</p>
                  </div>
                </div>
                <div class="file-drop__selected" id="design-selected" hidden>
                  <span class="file-drop__name" id="design-name"></span>
                  <img id="design-thumbnail" class="file-drop__thumb" src="" alt="Thumbnail desain" hidden>
                  <button type="button" class="btn btn--outline btn--xs" id="design-replace" title="Ganti file desain">Ganti</button>
                  <button type="button" class="btn btn--outline btn--xs text-critical" id="design-remove" title="Hapus file desain">Hapus</button>
                </div>
              </div>
              <p class="form-hint">Pastikan Anda memiliki hak atas artwork yang diunggah. Preview bersifat indikatif.</p>
            </div>

            <div class="form-group">
              <label for="custom-notes">Catatan untuk Admin</label>
              <textarea id="custom-notes" rows="4" class="form-control" placeholder="Contoh: letakkan di dada kiri, warna cerah, teks tur 2026"></textarea>
            </div>
          </section>

          <section class="panel">
            <div class="panel__head">
              <h2 class="panel__title"><span class="studio-step-label">03</span> Kirim untuk Ditinjau</h2>
            </div>

            <div class="estimate-box" id="custom-estimate"></div>
            <button class="btn btn--primary w-100 mt-m" id="submit-custom" type="button">Kirim Permintaan Custom</button>
            <p class="estimate-note mt-s">Estimasi bukan harga final. Admin menetapkan harga final per unit saat meninjau desain Anda.</p>
          </section>
        </div>
        </div>
      </div>
    </div>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
