<?php
$pageTitle = 'Daftar Akun';
include "includes/header.php";
?>

<section class="section auth-section">
  <div class="container auth-layout">
    <div class="auth-copy">
      <h1>Buat akun pembeli</h1>
      <p class="lead">Registrasi publik hanya membuat akun pembeli. Akun admin dikelola terpisah melalui seed database.</p>
      <ul class="check-list">
        <li>Email harus unik</li>
        <li>Password minimal 6 karakter</li>
        <li>Data hanya dipakai untuk akun dan pesanan</li>
      </ul>
    </div>

    <div class="panel auth-card">
      <h2>Daftar</h2>
      <div class="alert alert--error" id="register-error" hidden></div>
      <form id="register-form">
        <div class="form-group">
          <label for="register-name">Nama lengkap</label>
          <input id="register-name" class="form-control" required autocomplete="name" placeholder="Nama Anda">
        </div>
        <div class="form-group">
          <label for="register-email">Email</label>
          <input id="register-email" type="email" class="form-control" required autocomplete="email" placeholder="nama@email.com">
        </div>
        <div class="form-group">
          <label for="register-password">Password</label>
          <input id="register-password" type="password" class="form-control" required minlength="6" autocomplete="new-password" placeholder="Minimal 6 karakter">
        </div>
        <div class="form-group">
          <label for="register-confirm">Konfirmasi password</label>
          <input id="register-confirm" type="password" class="form-control" required autocomplete="new-password" placeholder="Ulangi password">
        </div>
        <button type="submit" class="btn btn--promo w-100 mt-s">Daftar Sekarang</button>
      </form>
      <p class="auth-switch">Sudah punya akun? <a class="link" href="<?= base_url('login.php') ?>">Masuk di sini</a></p>
      <p class="form-hint">Prototype akademik: akun disimpan di localStorage browser, bukan database MySQL.</p>
    </div>
  </div>
</section>

<?php include "includes/footer.php"; ?>
