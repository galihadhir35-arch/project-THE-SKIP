<?php
$pageTitle = 'Admin Ongkir';
$isAdminPage = true;
$adminNav = 'shipping';
include "../includes/header.php";
include "../includes/admin_nav.php";
?>

<section class="section">
  <div class="container">
    <div class="page-head">
      <div>
        <span class="eyebrow">Pengiriman Manual</span>
        <h1>Tarif Pengiriman</h1>
        <p class="muted">Kelola area dan layanan yang dapat dipilih pembeli saat checkout. Tanpa API ekspedisi.</p>
      </div>
      <button class="btn btn--primary btn--sm" id="btn-add-rate" type="button">+ Tambah Tarif</button>
    </div>

    <div class="panel">
      <div class="table-wrap">
        <table class="admin-table">
          <thead>
            <tr><th>Area</th><th>Kurir / Layanan</th><th>Tarif</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody id="admin-shipping-body"></tbody>
        </table>
      </div>
    </div>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
