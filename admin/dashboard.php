<?php
$pageTitle = 'Admin Dashboard';
$isAdminPage = true;
$activeNav = 'admin';
$adminNav = 'dashboard';
include "../includes/header.php";
include "../includes/admin_nav.php";
?>

<section class="section">
  <div class="container" id="admin-dashboard">
    <div class="page-head">
      <div>
        <span class="eyebrow">Ringkasan</span>
        <h1>Dashboard Admin</h1>
        <p class="muted">Pantau pesanan, pembayaran, dan permintaan custom yang perlu ditindaklanjuti.</p>
      </div>
      <a href="<?= base_url('admin/orders.php') ?>" class="btn btn--primary btn--sm">Kelola Pesanan</a>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <span class="stat-card__label">Total pesanan</span>
        <strong id="stat-orders">0</strong>
        <span class="stat-card__hint">Reguler + custom</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__label">Pendapatan terverifikasi</span>
        <strong id="stat-revenue">Rp 0</strong>
        <span class="stat-card__hint">Pembayaran simulasi</span>
      </div>
      <div class="stat-card stat-card--attention">
        <span class="stat-card__label">Bukti menunggu verifikasi</span>
        <strong id="stat-pending-payments">0</strong>
        <span class="stat-card__hint"><a class="link" href="<?= base_url('admin/payments.php') ?>">Buka pembayaran</a></span>
      </div>
      <div class="stat-card stat-card--warning">
        <span class="stat-card__label">Custom request baru</span>
        <strong id="stat-pending-custom">0</strong>
        <span class="stat-card__hint"><a class="link" href="<?= base_url('admin/custom-requests.php') ?>">Buka review</a></span>
      </div>
      <div class="stat-card">
        <span class="stat-card__label">Produk terdaftar</span>
        <strong id="stat-products">0</strong>
        <span class="stat-card__hint"><a class="link" href="<?= base_url('admin/products.php') ?>">Kelola katalog</a></span>
      </div>
    </div>

    <div class="admin-two-col row g-4 align-items-start">
      <div class="col-12 col-xl-8">
      <section class="panel">
        <div class="panel__head">
          <h2 class="panel__title">Pesanan Terbaru</h2>
          <a class="link" href="<?= base_url('admin/orders.php') ?>">Semua pesanan</a>
        </div>
        <div class="table-wrap">
          <table class="admin-table">
            <thead>
              <tr><th>Kode</th><th>Tipe</th><th>Total</th><th>Pembayaran</th><th>Status</th><th></th></tr>
            </thead>
            <tbody id="admin-recent-orders"></tbody>
          </table>
        </div>
      </section>
      </div>

      <div class="col-12 col-xl-4">
      <section class="panel">
        <div class="panel__head">
          <h2 class="panel__title">Perlu Tindakan</h2>
        </div>
        <div class="queue" id="admin-queue"></div>
      </section>
      </div>
    </div>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
