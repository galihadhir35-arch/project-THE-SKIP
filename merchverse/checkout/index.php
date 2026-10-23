<?php
$pageTitle = 'Checkout';
include "../includes/header.php";
?>

<section class="section">
  <div class="container">
    <div class="page-head">
      <div>
        <span class="eyebrow">Langkah 2 dari 2</span>
        <h1>Checkout</h1>
        <p class="muted">Lengkapi alamat dan pilih tarif pengiriman. Total dihitung dari data server (simulasi).</p>
      </div>
      <a href="<?= base_url('cart/index.php') ?>" class="btn btn--outline btn--sm">Kembali ke Keranjang</a>
    </div>

    <div class="empty-state" id="checkout-empty" hidden>
      <div class="empty-state__icon"><?= icon('cart', 'icon icon--lg') ?></div>
      <h3>Keranjang kosong</h3>
      <p>Tambahkan produk terlebih dahulu sebelum checkout.</p>
      <a href="<?= base_url('shop/index.php') ?>" class="btn btn--primary mt-m">Lihat Katalog</a>
    </div>

    <form id="checkout-form" class="checkout-layout" hidden>
      <div class="stack">
        <section class="panel">
          <div class="alert alert--error" id="checkout-error" hidden></div>
          <h2 class="panel__title">Alamat Pengiriman</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="recipient-name">Nama penerima</label>
              <input id="recipient-name" class="form-control" required autocomplete="name">
            </div>
            <div class="form-group">
              <label for="recipient-phone">Nomor kontak</label>
              <input id="recipient-phone" class="form-control" inputmode="tel" placeholder="08xxxxxxxxxx" required autocomplete="tel">
            </div>
          </div>
          <div class="form-group mt-s">
            <label for="recipient-address">Alamat lengkap</label>
            <textarea id="recipient-address" class="form-control" rows="3" required autocomplete="street-address"></textarea>
          </div>
          <div class="form-grid mt-s">
            <div class="form-group">
              <label for="recipient-city">Kota / area</label>
              <input id="recipient-city" class="form-control" required autocomplete="address-level2">
            </div>
            <div class="form-group">
              <label for="recipient-postal">Kode pos</label>
              <input id="recipient-postal" class="form-control" inputmode="numeric" autocomplete="postal-code">
            </div>
          </div>
        </section>

        <section class="panel">
          <h2 class="panel__title">Pengiriman</h2>
          <div class="form-group">
            <label for="shipping-rate">Area &amp; layanan</label>
            <select id="shipping-rate" class="form-control" required></select>
            <p class="form-hint">Tarif dikelola admin tanpa API ekspedisi. Ongkir ditampilkan sebelum pesanan dibuat.</p>
          </div>
        </section>

        <section class="panel">
          <h2 class="panel__title">Metode Pembayaran</h2>
          <div class="payment-method">
            <span class="payment-method__icon"><?= icon('bank') ?></span>
            <div>
              <strong>Transfer (Simulasi)</strong>
              <p class="muted">Pembayaran demo. Unggah bukti simulasi setelah pesanan dibuat; admin akan memverifikasi.</p>
            </div>
          </div>
          <div class="alert alert--info mt-s">Tidak ada transaksi uang sungguhan. Jangan mengunggah kredensial perbankan atau data kartu.</div>
        </section>
      </div>

      <aside class="panel summary-panel">
        <h2 class="panel__title">Ringkasan Pesanan</h2>
        <div class="summary-list" id="checkout-items"></div>
        <div class="summary-row"><span>Subtotal</span><span id="checkout-subtotal">Rp 0</span></div>
        <div class="summary-row"><span>Ongkir</span><span id="checkout-shipping">Rp 0</span></div>
        <div class="summary-row summary-row--total"><span>Total</span><strong id="checkout-total">Rp 0</strong></div>
        <button type="submit" class="btn btn--primary w-100 mt-m">Buat Pesanan</button>
        <p class="form-hint mt-s">Dengan membuat pesanan, Anda menyetujui alur pembayaran simulasi dan kebijakan pengiriman manual.</p>
      </aside>
    </form>
  </div>
</section>

<?php include "../includes/footer.php"; ?>
