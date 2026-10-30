<?php
$pageTitle = 'Masuk';
include "includes/header.php";
?>

<section class="section auth-section">
  <div class="container">
   <div class="auth-layout row g-4 align-items-start">
    <div class="auth-copy col-12 col-lg-7">
      <h1>Masuk untuk melanjutkan</h1>
      <p class="lead">Buat pesanan, unggah desain custom, dan pantau status pesanan Anda dalam satu tempat.</p>
      <ul class="check-list">
        <li>Riwayat pesanan reguler dan custom</li>
        <li>Unggah bukti pembayaran simulasi</li>
        <li>Preview mockup desain sebelum dikirim</li>
      </ul>
    </div>

    <div class="col-12 col-lg-5">
    <div class="panel auth-card">
      <h2>Masuk</h2>
      <div class="alert alert--error" id="login-error" hidden></div>
      <form id="login-form">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input id="login-email" type="email" class="form-control" required autocomplete="email" placeholder="nama@email.com">
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input id="login-password" type="password" class="form-control" required autocomplete="current-password" placeholder="••••••••">
        </div>
        <button type="submit" class="btn btn--promo w-100 mt-s">Masuk</button>
      </form>
      <p class="auth-switch">Belum punya akun? <a class="link" href="<?= base_url('register.php') ?>">Daftar sebagai pembeli</a></p>

      <div class="demo-box">
        <p class="demo-box__title">Akun demo (prototype)</p>
        <div class="d-flex gap-s flex-wrap">
          <button type="button" class="btn btn--outline btn--sm" data-demo-login="buyer">Isi akun pembeli</button>
          <button type="button" class="btn btn--outline btn--sm" data-demo-login="admin">Isi akun admin</button>
        </div>
        <p class="form-hint mt-s">Pembeli: buyer@merchverse.test / buyer123<br>Admin: admin@merchverse.test / admin123</p>
      </div>
    </div>
    </div>
   </div>
  </div>
</section>

<?php include "includes/footer.php"; ?>
