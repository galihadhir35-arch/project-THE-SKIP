<?php
$pageTitle = 'Official Merchandise & Custom Studio';
$activeNav = 'home';
include "includes/header.php";
?>

<section class="hero is-photo" style="--hero-photo-url: url('<?= asset_url('images/back1.jpg') ?>');">
  <div class="container hero__grid">
    <div class="hero__content">
      <span class="hero__kicker">THE SKIP · Official Store</span>
      <h1>Merchandise resmi untuk penggemar yang datang lebih awal.</h1>
      <p>Kaos, hoodie, dan koleksi tur yang dibuat di Bandung. Atau bawa desain Anda sendiri ke Custom Studio dan cetak sesuai gaya Anda.</p>
      <div class="hero__cta">
        <a href="shop/index.php" class="btn btn--promo">Lihat koleksi</a>
        <a href="custom/studio.php" class="btn btn--ghost">Mulai custom merch</a>
      </div>
      <ul class="hero__facts">
        <li><span class="hero__fact-label">Kategori</span> Apparel · Accessories · Collectibles</li>
        <li><span class="hero__fact-label">Pengiriman</span> Seluruh Indonesia · JNE &amp; SiCepat</li>
      </ul>
    </div>
    <div class="hero__art" aria-hidden="true">
      <figure class="hero__card hero__card--front">
        <img src="<?= asset_url('images/products/tshirt-classic.jpg') ?>" alt="">
      </figure>
      <figure class="hero__card hero__card--back">
        <img src="<?= asset_url('images/products/vinyl.jpg') ?>" alt="">
      </figure>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="editorial-head">
      <h2>Koleksi unggulan</h2>
      <a href="shop/index.php" class="link-arrow">Semua <span id="home-product-count">0</span> produk <span class="icon-wrap"><?= icon('arrowRight') ?></span></a>
    </div>
    <div class="product-grid" id="featured-grid"></div>
  </div>
</section>

<section class="section section--surface">
  <div class="container">
    <div class="collection-grid">
      <a class="collection-card" href="shop/index.php?category=apparel">
        <img src="<?= asset_url('images/products/tshirt-classic.svg') ?>" alt="">
        <div class="collection-card__foot">
          <strong>Apparel</strong>
          <span>Kaos &amp; hoodie</span>
        </div>
      </a>
      <a class="collection-card" href="shop/index.php?category=accessories">
        <img src="<?= asset_url('images/products/pin-set.svg') ?>" alt="">
        <div class="collection-card__foot">
          <strong>Accessories</strong>
          <span>Pin, tote, dan lainnya</span>
        </div>
      </a>
      <a class="collection-card" href="shop/index.php?category=collectibles">
        <img src="<?= asset_url('images/products/vinyl.svg') ?>" alt="">
        <div class="collection-card__foot">
          <strong>Collectibles</strong>
          <span>Vinyl &amp; edisi khusus</span>
        </div>
      </a>
      <a class="collection-card collection-card--custom" href="custom/studio.php">
        <img src="<?= asset_url('images/products/custom-base.svg') ?>" alt="">
        <div class="collection-card__foot">
          <strong>Custom Merch</strong>
          <span>Unggah desain sendiri</span>
        </div>
      </a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="custom-feature">
      <div class="custom-feature__copy">
        <h2>Desain Anda, dicetak oleh kami.</h2>
        <p>Pilih produk dasar dan warna, unggah artwork, lalu lihat pratinjau langsung di mockup. Admin meninjau desain dan menetapkan harga final per unit sebelum produksi.</p>
        <a href="custom/studio.php" class="btn btn--promo">Buka Custom Studio</a>
      </div>
      <ol class="custom-steps">
        <li>
          <span class="custom-steps__num">01</span>
          <div><strong>Pilih produk dasar</strong><p>Kaos atau hoodie, ukuran, warna, dan jumlah.</p></div>
        </li>
        <li>
          <span class="custom-steps__num">02</span>
          <div><strong>Unggah desain</strong><p>JPEG/PNG/WebP maksimal 5 MB, langsung tampil di mockup.</p></div>
        </li>
        <li>
          <span class="custom-steps__num">03</span>
          <div><strong>Review admin</strong><p>Admin menyetujui desain dan menetapkan harga final per unit.</p></div>
        </li>
        <li>
          <span class="custom-steps__num">04</span>
          <div><strong>Bayar &amp; kirim</strong><p>Pembayaran diverifikasi, lalu pesanan diproduksi dan dikirim.</p></div>
        </li>
      </ol>
    </div>
  </div>
</section>

<?php include "includes/footer.php"; ?>
