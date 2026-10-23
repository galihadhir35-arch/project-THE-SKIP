<?php
$pageTitle = 'Admin Pesanan';
$isAdminPage = true;
$adminNav = 'orders';
include "../includes/header.php";
include "../includes/admin_nav.php";
?>

<section class="section">
  <div class="container">
    <div class="page-head">
      <div>
        <span class="eyebrow">Pemenuhan</span>
        <h1>Kelola Pesanan</h1>
        <p class="muted">Perbarui status, kurir, dan nomor resi. Pesanan hanya dapat diproses setelah pembayaran terverifikasi.</p>
      </div>
      <select id="admin-order-filter" class="form-control form-control--sm" aria-label="Filter status pesanan">
        <option value="all">Semua status</option>
        <option value="awaiting_payment">Menunggu Pembayaran</option>
        <option value="payment_review">Menunggu Verifikasi</option>
        <option value="processing">Diproses</option>
        <option value="shipped">Dikirim</option>
        <option value="completed">Selesai</option>
        <option value="cancelled">Dibatalkan</option>
      </select>
    </div>

    <div class="panel">
      <div class="table-wrap">
        <table class="admin-table">
          <thead>
            <tr><th>Kode</th><th>Pembeli</th><th>Tipe</th><th>Total</th><th>Pembayaran</th><th>Status</th><th>Resi</th><th>Aksi</th></tr>
          </thead>
          <tbody id="admin-orders-body"></tbody>
        </table>
      </div>
    </div>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
