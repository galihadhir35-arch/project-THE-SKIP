<?php
$pageTitle = 'Katalog Produk';
$activeNav = 'shop';
include "../includes/header.php";
?>

<section class="section">
  <div class="container">
    <div class="page-head">
      <div>
        <h1>Katalog Produk</h1>
        <p class="muted">Merchandise resmi THE SKIP. Pilih varian, cek stok, lalu tambahkan ke keranjang.</p>
      </div>
      <a href="<?= base_url('custom/studio.php') ?>" class="btn btn--dark">Butuh Custom Merch?</a>
    </div>

    <div class="catalog-toolbar">
      <div class="search-field">
        <span class="search-field__icon" aria-hidden="true"><?= icon('search') ?></span>
        <input type="search" id="search-input" placeholder="Cari produk, kategori…" class="form-control" aria-label="Cari produk">
      </div>
      <div class="filter-chips" role="group" aria-label="Filter kategori">
        <button class="filter-chip active" data-category="all">Semua</button>
        <button class="filter-chip" data-category="apparel">Apparel</button>
        <button class="filter-chip" data-category="accessories">Accessories</button>
        <button class="filter-chip" data-category="collectibles">Collectibles</button>
      </div>
      <div class="sort-field">
        <label for="sort-select" class="visually-hidden">Urutkan</label>
        <select id="sort-select" class="form-control form-control--sm">
          <option value="featured">Unggulan</option>
          <option value="price-asc">Harga terendah</option>
          <option value="price-desc">Harga tertinggi</option>
          <option value="name">Nama A–Z</option>
        </select>
      </div>
    </div>

    <p class="results-count" id="results-count"></p>

    <div class="product-grid" id="product-grid"></div>

    <div class="empty-state" id="empty-state" hidden>
      <div class="empty-state__icon"><?= icon('search', 'icon icon--lg') ?></div>
      <h3>Produk tidak ditemukan</h3>
      <p>Coba kata kunci atau kategori lain.</p>
      <a href="index.php" class="btn btn--primary mt-m">Reset Filter</a>
    </div>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
