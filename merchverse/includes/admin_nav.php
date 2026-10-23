<?php
$adminNav = $adminNav ?? '';
$adminTabs = [
    'dashboard' => ['label' => 'Dashboard', 'href' => 'admin/dashboard.php'],
    'products' => ['label' => 'Produk', 'href' => 'admin/products.php'],
    'orders' => ['label' => 'Pesanan', 'href' => 'admin/orders.php'],
    'custom' => ['label' => 'Custom Request', 'href' => 'admin/custom-requests.php'],
    'payments' => ['label' => 'Pembayaran', 'href' => 'admin/payments.php'],
    'shipping' => ['label' => 'Ongkir', 'href' => 'admin/shipping.php'],
];
?>
<div class="admin-bar">
  <div class="container admin-bar__inner">
    <div class="admin-bar__title">
      <span class="badge badge--attention">Admin</span>
      <span>Panel Pengelolaan</span>
    </div>
    <nav class="admin-nav" aria-label="Navigasi admin">
      <?php foreach ($adminTabs as $key => $tab): ?>
        <a href="<?= base_url($tab['href']) ?>" class="admin-nav__link <?= $adminNav === $key ? 'is-active' : '' ?>">
          <?= e($tab['label']) ?>
          <span class="admin-nav__badge" data-admin-badge="<?= e($key) ?>" hidden></span>
        </a>
      <?php endforeach; ?>
    </nav>
  </div>
</div>
