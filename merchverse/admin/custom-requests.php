<?php
$pageTitle = 'Admin Custom Request';
$isAdminPage = true;
$adminNav = 'custom';
include "../includes/header.php";
include "../includes/admin_nav.php";
?>

<section class="section">
  <div class="container">
    <div class="page-head">
      <div>
        <span class="eyebrow">Custom Merch</span>
        <h1>Review Custom Request</h1>
        <p class="muted">Tinjau desain, minta revisi, tolak, atau setujui desain dengan harga final per unit.</p>
      </div>
      <select id="admin-custom-filter" class="form-control form-control--sm" aria-label="Filter custom request">
        <option value="all">Semua status</option>
        <option value="submitted">Menunggu Tinjauan</option>
        <option value="under_review">Sedang Ditinjau</option>
        <option value="revision_requested">Perlu Revisi</option>
        <option value="approved">Disetujui</option>
        <option value="rejected">Ditolak</option>
        <option value="ordered">Sudah Dipesan</option>
      </select>
    </div>

    <div class="stack" id="admin-custom-requests"></div>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
