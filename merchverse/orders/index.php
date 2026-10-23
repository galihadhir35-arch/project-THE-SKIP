<?php
$pageTitle = 'Riwayat Pesanan';
$activeNav = 'orders';
include "../includes/header.php";
?>

<section class="section">
  <div class="container">
    <div class="page-head">
      <div>
        <h1>Riwayat Pesanan</h1>
        <p class="muted">Pantau status pembayaran, pemenuhan, dan resi pesanan Anda.</p>
      </div>
      <div class="d-flex gap-s flex-wrap">
        <select id="order-filter" class="form-control form-control--sm" aria-label="Filter status">
          <option value="all">Semua status</option>
          <option value="awaiting_payment">Menunggu Pembayaran</option>
          <option value="payment_review">Menunggu Verifikasi</option>
          <option value="processing">Diproses</option>
          <option value="shipped">Dikirim</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
        <a href="<?= base_url('shop/index.php') ?>" class="btn btn--primary btn--sm">Belanja Lagi</a>
      </div>
    </div>

    <div class="empty-state" id="orders-empty" hidden>
      <div class="empty-state__icon"><?= icon('box', 'icon icon--lg') ?></div>
      <h3>Belum ada pesanan</h3>
      <p>Pesanan reguler dan custom yang sudah dibuat akan muncul di sini.</p>
      <a href="<?= base_url('shop/index.php') ?>" class="btn btn--primary mt-m">Mulai Belanja</a>
    </div>

    <div class="stack" id="orders-list"></div>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
