<?php
$pageTitle = 'Admin Pembayaran';
$isAdminPage = true;
$adminNav = 'payments';
include "../includes/header.php";
include "../includes/admin_nav.php";
?>

<section class="section">
  <div class="container">
    <div class="page-head">
      <div>
        <span class="eyebrow">Pembayaran Simulasi</span>
        <h1>Verifikasi Pembayaran</h1>
        <p class="muted">Hanya admin yang dapat menetapkan status terverifikasi. Periksa bukti simulasi sebelum menyetujui.</p>
      </div>
    </div>

    <div class="alert alert--info">
      Prototype akademik: pembayaran di sini adalah simulasi. Jangan meminta atau menyimpan data kartu, PIN, atau kredensial perbankan.
    </div>

    <div class="stack" id="admin-payments"></div>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
