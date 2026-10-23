</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-brand">MERCHVERSE</div>
        <p class="footer-text">Official merchandise store dan Custom Merch Studio untuk THE SKIP.</p>
      </div>
      <div>
        <h3 class="footer-heading">Toko</h3>
        <ul class="footer-links">
          <li><a href="<?= base_url('shop/index.php') ?>">Katalog Produk</a></li>
          <li><a href="<?= base_url('custom/studio.php') ?>">Custom Studio</a></li>
          <li><a href="<?= base_url('cart/index.php') ?>">Keranjang</a></li>
        </ul>
      </div>
      <div>
        <h3 class="footer-heading">Akun</h3>
        <ul class="footer-links">
          <li><a href="<?= base_url('login.php') ?>">Masuk</a></li>
          <li><a href="<?= base_url('register.php') ?>">Daftar</a></li>
          <li><a href="<?= base_url('orders/index.php') ?>">Riwayat Pesanan</a></li>
        </ul>
      </div>
      <div>
        <h3 class="footer-heading">Bantuan</h3>
        <ul class="footer-links">
          <li><a href="<?= base_url('custom/status.php') ?>">Status Custom Request</a></li>
          <li><a href="<?= base_url('admin/dashboard.php') ?>">Panel Admin (Demo)</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-copy">
      © 2026 MerchVerse · THE SKIP. Prototype akademik — pembayaran simulasi, tidak ada transaksi uang sungguhan.
    </div>
  </div>
</footer>

<div class="overlay" id="app-modal" aria-hidden="true">
  <div class="modal" id="app-modal-content" role="dialog" aria-modal="true"></div>
</div>

<!-- Lightbox untuk zoom gambar produk -->
<div class="lightbox" id="product-lightbox" aria-hidden="true">
  <button class="lightbox__close" id="lightbox-close" aria-label="Tutup zoom">&times;</button>
  <img id="lightbox-img" src="" alt="Pratinjau besar">
  <p id="lightbox-caption" class="lightbox__caption"></p>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="<?= asset_url('js/icons.js') ?>"></script>
<script src="<?= asset_url('js/data.js') ?>"></script>
<script src="<?= asset_url('js/app.js') ?>"></script>
<?php if (!empty($isAdminPage)): ?>
<script src="<?= asset_url('js/admin.js') ?>"></script>
<?php endif; ?>
</body>
</html>
