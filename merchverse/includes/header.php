<?php
require_once __DIR__ . '/helpers.php';
$pageTitle = $pageTitle ?? 'MerchVerse';
$activeNav = $activeNav ?? '';
$bodyClass = $bodyClass ?? '';
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e($pageTitle) ?> · MerchVerse</title>
  <meta name="description" content="Official merchandise store dan Custom Merch Studio untuk THE SKIP.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=New+Rocker&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="<?= asset_url('css/style.css') ?>">
</head>
<body class="<?= e($bodyClass) ?>">
<script>window.MV_BASE = <?= json_encode(base_url()) ?>;</script>

<header class="site-header">
  <div class="container navbar">
    <a href="<?= base_url('index.php') ?>" class="brand">
      <span class="brand__mark">THE SKIP</span>
      <span class="brand__sub">MerchVerse</span>
    </a>

    <button class="burger" aria-label="Buka menu" aria-expanded="false" id="burger">
      <span></span><span></span><span></span>
    </button>

    <nav class="nav-menu" id="nav-menu">
      <a href="<?= base_url('shop/index.php') ?>" class="nav-link <?= $activeNav === 'shop' ? 'is-active' : '' ?>">Shop</a>
      <a href="<?= base_url('custom/studio.php') ?>" class="nav-link <?= $activeNav === 'custom' ? 'is-active' : '' ?>">Custom Studio</a>
      <a href="<?= base_url('orders/index.php') ?>" class="nav-link <?= $activeNav === 'orders' ? 'is-active' : '' ?>">Pesanan Saya</a>
      <a href="<?= base_url('admin/dashboard.php') ?>" class="nav-link nav-admin-link" id="nav-admin" hidden>Admin</a>
      <div class="nav-account-mobile" id="nav-account-mobile"></div>
    </nav>

    <div class="nav-actions">
      <div class="nav-account" id="nav-account"></div>
      <a href="<?= base_url('cart/index.php') ?>" class="nav-link cart-badge" title="Keranjang">
        <span class="cart-label">Keranjang</span>
        <span class="cart-count" id="cart-count">0</span>
      </a>
    </div>
  </div>
</header>

<main>
