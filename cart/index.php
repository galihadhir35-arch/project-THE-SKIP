<?php
$pageTitle = 'Keranjang Belanja';
include "../includes/header.php";
?>

<section class="section">
  <div class="container">
    <div class="page-head">
      <div>
        <span class="eyebrow">Langkah 1 dari 2</span>
        <h1>Keranjang Belanja</h1>
        <p class="muted">Periksa varian dan jumlah sebelum melanjutkan ke checkout.</p>
      </div>
      <a href="<?= base_url('shop/index.php') ?>" class="btn btn--outline btn--sm">Lanjut Belanja</a>
    </div>

    <div class="empty-state" id="cart-empty" hidden>
      <div class="empty-state__icon"><?= icon('cart', 'icon icon--lg') ?></div>
      <h3>Keranjang masih kosong</h3>
      <p>Pilih merchandise favorit Anda di katalog.</p>
      <a href="<?= base_url('shop/index.php') ?>" class="btn btn--primary mt-m">Lihat Katalog</a>
    </div>

    <div class="cart-layout row g-4 align-items-start" id="cart-body" hidden>
      <div class="col-12 col-lg-8">
        <div class="stack" id="cart-items"></div>
      </div>
      <div class="col-12 col-lg-4 summary-col">
      <aside class="panel summary-panel">
        <h2 class="panel__title">Ringkasan</h2>
        <div class="summary-row"><span>Jumlah item</span><span id="cart-summary-items">0 item</span></div>
        <div class="summary-row"><span>Subtotal</span><span data-cart-subtotal>Rp 0</span></div>
        <div class="summary-row"><span>Ongkir</span><span class="muted">Dihitung saat checkout</span></div>
        <div class="summary-row summary-row--total"><span>Total sementara</span><strong data-cart-subtotal>Rp 0</strong></div>
        <button type="button" class="btn btn--primary w-100 mt-m" id="to-checkout">Lanjut ke Pembayaran</button>
        <p class="form-hint mt-s">Anda akan diminta masuk atau mendaftar sebelum checkout.</p>
      </aside>
      </div>
    </div>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
