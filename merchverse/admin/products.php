<?php
$pageTitle = 'Admin Produk';
$isAdminPage = true;
$adminNav = 'products';
include "../includes/header.php";
include "../includes/admin_nav.php";
?>

<section class="section">
  <div class="container">
    <div class="page-head">
      <div>
        <span class="eyebrow">Katalog</span>
        <h1>Kelola Produk</h1>
        <p class="muted">Tambah, ubah harga/stok varian, unggulan, dan aktif/nonaktifkan produk.</p>
      </div>
      <button class="btn btn--primary btn--sm" id="btn-add-product" type="button">+ Tambah Produk</button>
    </div>

    <div class="panel">
      <div class="table-wrap">
        <table class="admin-table">
          <thead>
            <tr><th>Foto</th><th>Produk</th><th>Kategori</th><th>Tipe</th><th>Harga</th><th>Stok</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody id="admin-products-body"></tbody>
        </table>
      </div>
    </div>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
