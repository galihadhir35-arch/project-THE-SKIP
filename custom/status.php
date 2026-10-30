<?php
$pageTitle = 'Status Custom Request';
$activeNav = 'custom';
include "../includes/header.php";
?>

<section class="section">
  <div class="container">
    <div class="page-head">
      <div>
        <h1>Status Permintaan Custom</h1>
        <p class="muted">Pantau keputusan admin, harga final, dan lanjutkan pembayaran setelah penawaran disetujui.</p>
      </div>
      <a href="<?= base_url('custom/studio.php') ?>" class="btn btn--primary btn--sm">Buat Permintaan Baru</a>
    </div>

    <div class="alert alert--success" id="custom-status-alert" hidden></div>
    <div class="stack" id="custom-request-list"></div>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
