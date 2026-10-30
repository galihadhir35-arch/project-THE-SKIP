<?php
$pageTitle = 'Official Merchandise & Custom Studio';
$activeNav = 'home';
include "includes/header.php";
?>

<section class="hero is-photo" style="--hero-photo-url: url('<?= asset_url('images/back1.jpg') ?>');">
  <div class="container">
  <div class="hero__grid row g-4 align-items-center">
    <div class="hero__content col-12 col-lg-7">
      <span class="hero__kicker">THE SKIP · Official Store</span>
      <h1>Merchandise resmi untuk penggemar yang datang lebih awal.</h1>
      <p>Kaos, hoodie, dan koleksi tur yang dibuat di Bandung. Atau bawa desain Anda sendiri ke Custom Studio dan cetak sesuai gaya Anda.</p>
      <div class="hero__cta">
        <a href="shop/index.php" class="btn btn--promo">Lihat koleksi</a>
        <a href="custom/studio.php" class="btn btn--primary">Mulai custom merch</a>
      </div>
      <ul class="hero__facts">
        <li><span class="hero__fact-label">Kategori</span> Apparel · Accessories · Collectibles</li>
        <li><span class="hero__fact-label">Pengiriman</span> Seluruh Indonesia · JNE &amp; SiCepat</li>
      </ul>
    </div>
    <div class="hero__art col-lg-5" aria-hidden="true">
      <figure class="hero__card hero__card--front">
        <img src="<?= asset_url('images/products/tshirt-classic.jpg') ?>" alt="">
      </figure>
      <figure class="hero__card hero__card--back">
        <img src="<?= asset_url('images/products/vinyl.jpg') ?>" alt="">
      </figure>
    </div>
  </div>
  </div>
</section>

<section class="section section--surface">
  <div class="container">
    <div class="collection-grid row g-3">
      <div class="col-12 col-md-4">
      <a class="collection-card" href="shop/index.php?category=apparel">
        <div class="collection-card__icon"><?= icon('apparel', 'icon icon--lg') ?></div>
        <div class="collection-card__foot">
          <strong>Apparel</strong>
          <span class="description">Kaos &amp; hoodie</span>
          <span class="collection-card__arrow">Lihat koleksi <span class="arrow">→</span></span>
        </div>
      </a>
      </div>
      <div class="col-12 col-md-4">
      <a class="collection-card" href="shop/index.php?category=accessories">
        <div class="collection-card__icon"><?= icon('accessories', 'icon icon--lg') ?></div>
        <div class="collection-card__foot">
          <strong>Accessories</strong>
          <span class="description">Pin, tote, dan lainnya</span>
          <span class="collection-card__arrow">Lihat koleksi <span class="arrow">→</span></span>
        </div>
      </a>
      </div>
      <div class="col-12 col-md-4">
      <a class="collection-card" href="shop/index.php?category=collectibles">
        <div class="collection-card__icon"><?= icon('collectibles', 'icon icon--lg') ?></div>
        <div class="collection-card__foot">
          <strong>Collectibles</strong>
          <span class="description">Vinyl &amp; edisi khusus</span>
          <span class="collection-card__arrow">Lihat koleksi <span class="arrow">→</span></span>
        </div>
      </a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="editorial-head">
      <h2>Koleksi unggulan</h2>
      <a href="shop/index.php" class="link-arrow">Semua <span id="home-product-count">0</span> produk <span class="icon-wrap"><?= icon('arrowRight') ?></span></a>
    </div>
    <div class="product-grid row g-3" id="featured-grid"></div>

    <div class="cta-banner cta-banner--custom mt-l" id="catalog-custom-banner">
      <div class="cta-banner__text">
        <h2>Tidak menemukan yang cocok?</h2>
        <p>Buat merch sendiri dengan desain Anda. Harga final ditetapkan admin sebelum bayar.</p>
      </div>
      <a href="<?= base_url('custom/studio.php') ?>" class="btn btn--primary">Buka Custom Studio</a>
    </div>
  </div>
</section>

<section class="section section--surface">
  <div class="container">
    <div class="about-band" style="text-align:center; max-width: 64ch; margin: 0 auto;">
      <h2>Tentang THE SKIP</h2>
      <p>THE SKIP adalah band dari Bandung yang mencetak album debutnya, bertajuk “Self-Titled”, di dalam LP vinyl 12 inci — kini tersedia sebagai koleksi merch resmi. Samping rilis Tour 2026, kami memproduksi kaos, hoodie, pin, dan barang koleksi tur. Atau bawa desain Anda sendiri ke Custom Studio dan cetak sesuai gaya Anda.</p>
      <a href="<?= base_url('shop/index.php') ?>" class="btn btn--outline mt-m">Lihat Katalog</a>
    </div>
  </div>
</section>

<?php include "includes/footer.php"; ?>
