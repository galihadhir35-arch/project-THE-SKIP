/* ==========================================================================
   MerchVerse — App prototype (fase pra-UTS)
   Logic sisi klien: autentikasi demo, katalog, keranjang, checkout simulasi,
   pesanan, custom studio + preview mockup, dan custom request.
   Data master: data.js. Data transaksi: localStorage (simulasi backend).
   ========================================================================== */

const MV_BASE = window.MV_BASE || '/';
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
/* Pengikat event berbasis jQuery (rubrik: interaksi memakai jQuery).
   Handler tetap menerima native Event (e.target, e.key, dst. sama). */
const bind = (target, type, handler) => jQuery(target).on(type, (ev) => handler(ev.originalEvent || ev));

function baseUrl(path = '') {
  return MV_BASE + String(path).replace(/^\/+/, '');
}

function assetUrl(path = '') {
  return baseUrl('assets/' + String(path).replace(/^\/+/, ''));
}

function imageUrl(path) {
  if (!path) return assetUrl('images/products/placeholder.svg');
  if (/^(https?:|data:|\/)/.test(path)) return path;
  if (path.startsWith('assets/')) return baseUrl(path);
  return assetUrl(path);
}

function formatPrice(n) {
  return MerchData.formatPrice(n);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch (e) {
    return iso;
  }
}

function formatDateShort(iso) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(iso));
  } catch (e) {
    return iso;
  }
}

/* ---------- Local storage store ---------- */
/* Simpanan transaksi di localStorage (simulasi backend, dicatat di README):
   mv_auth, mv_users, mv_cart, mv_orders, mv_requests, mv_shipping,
   mv_products, mv_seeded_v1. */
const KEYS = {
  auth: "mv_auth",
  users: "mv_users",
  cart: "mv_cart",
  orders: "mv_orders",
  requests: "mv_requests",
  shipping: "mv_shipping",
  products: "mv_products",
  seeded: "mv_seeded_v1",
};

function cartLabel(count) {
  return `Keranjang, jumlah ${count} item`;
}
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    toast("Penyimpanan browser penuh. Hapus beberapa bukti pembayaran lama.", "error");
    return false;
  }
}

function uid(prefix) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

function orderCode(prefix) {
  const year = String(new Date().getFullYear()).slice(-2);
  let code;
  let attempts = 0;
  do {
    const seq = String(Math.floor(Math.random() * 900000) + 100000);
    code = `${prefix}-${year}${seq}`;
    attempts++;
    if (attempts > 100) throw new Error("Gagal menghasilkan kode order unik.");
  } while (
    Store.orders().some((o) => o.code === code) ||
    Store.requests().some((r) => r.code === code)
  );
  return code;
}

/* Store — akses data transaksi di localStorage: pesanan (mv_orders),
   custom request (mv_requests), ongkir (mv_shipping), dan produk yang
   diedit admin melalui panel (mv_products). */
const Store = {
  ensureSeed() {
    if (localStorage.getItem(KEYS.seeded)) return;
    writeJSON(KEYS.orders, MerchData.seedOrders.slice());
    writeJSON(KEYS.requests, MerchData.seedRequests.slice());
    writeJSON(KEYS.shipping, MerchData.shipping_rates.slice());
    localStorage.setItem(KEYS.seeded, "1");
  },

  users() {
    const local = readJSON(KEYS.users, []);
    const all = MerchData.demoUsers.concat(local);
    return all;
  },

  addUser(user) {
    const local = readJSON(KEYS.users, []);
    local.push(user);
    writeJSON(KEYS.users, local);
  },

  orders() {
    return readJSON(KEYS.orders, []);
  },
  saveOrders(list) {
    writeJSON(KEYS.orders, list);
  },
  ordersFor(userId) {
    return this.orders().filter((o) => o.userId === userId);
  },
  findOrder(id) {
    return this.orders().find((o) => o.id === id) || null;
  },
  updateOrder(id, patch, historyNote) {
    const orders = this.orders();
    const order = orders.find((o) => o.id === id);
    if (!order) return null;
    const prevStatus = order.status;
    Object.assign(order, patch);
    order.updatedAt = new Date().toISOString();
    const statusChanged = patch.status && patch.status !== prevStatus;
    if (historyNote && statusChanged) {
      order.history = order.history || [];
      order.history.push({ status: patch.status, note: historyNote, at: order.updatedAt });
    }
    this.saveOrders(orders);
    return order;
  },

  requests() {
    return readJSON(KEYS.requests, []);
  },
  saveRequests(list) {
    writeJSON(KEYS.requests, list);
  },
  requestsFor(userId) {
    return this.requests().filter((r) => r.userId === userId);
  },
  findRequest(id) {
    return this.requests().find((r) => r.id === id) || null;
  },
  updateRequest(id, patch) {
    const requests = this.requests();
    const request = requests.find((r) => r.id === id);
    if (!request) return null;
    Object.assign(request, patch);
    request.updatedAt = new Date().toISOString();
    this.saveRequests(requests);
    return request;
  },

  shippingRates() {
    const stored = readJSON(KEYS.shipping, null);
    return stored || MerchData.shipping_rates.slice();
  },
  saveShippingRates(rates) {
    writeJSON(KEYS.shipping, rates);
  },
  activeShippingRates() {
    return this.shippingRates().filter((r) => r.active !== false);
  },
  findShippingRate(id) {
    return this.shippingRates().find((r) => r.id === id) || null;
  },

  productOverrides() {
    return readJSON(KEYS.products, []);
  },
  allProducts() {
    const overrides = this.productOverrides();
    const merged = MerchData.products.map((p) => {
      const override = overrides.find((o) => o.id === p.id);
      return override ? { ...p, ...override } : { ...p };
    });
    overrides.forEach((o) => {
      if (!MerchData.products.some((p) => p.id === o.id)) merged.push({ ...o });
    });
    return merged;
  },
  getProduct(id) {
    return this.allProducts().find((p) => p.id === id) || null;
  },
  officialProducts() {
    return this.allProducts().filter((p) => p.product_type === "official" && p.active !== false);
  },
  customProducts() {
    return this.allProducts().filter((p) => p.product_type === "custom_base" && p.active !== false);
  },
  saveProduct(product) {
    const overrides = this.productOverrides();
    const idx = overrides.findIndex((o) => o.id === product.id);
    if (idx >= 0) overrides[idx] = product;
    else overrides.push(product);
    writeJSON(KEYS.products, overrides);
  },

  createOrder({ type, items, shippingRate, recipient, customRequestId }) {
    if (!items || !items.length) return null;
    // Validasi dan kurangi stok untuk setiap item (hanya order reguler dengan variantId)
    for (const item of items) {
      if (!item.variantId) continue; // custom order tidak pakai variant id langsung
      const product = Store.getProduct(item.productId);
      if (!product) return null;
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) return null;
      if (variant.active === false || variant.stock < item.quantity) return null;
    }
    // Kurangi stok
    for (const item of items) {
      if (!item.variantId) continue;
      const product = Store.getProduct(item.productId);
      const variant = product.variants.find((v) => v.id === item.variantId);
      variant.stock = Number(variant.stock) - Number(item.quantity);
    }
    const subtotal = items.reduce((sum, item) => sum + Number(item.unitPrice) * Number(item.quantity), 0);
    const fee = Number(shippingRate.fee) || 0;
    const now = new Date().toISOString();
    const order = {
      id: uid("o"),
      code: orderCode("MV"),
      userId: Auth.user ? Auth.user.id : null,
      type: type || "official",
      customRequestId: customRequestId || null,
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId || null,
        name: item.name,
        size: item.size,
        color: item.color,
        unitPrice: Number(item.unitPrice),
        quantity: Number(item.quantity),
      })),
      subtotal,
      shippingFee: fee,
      shippingService: `${shippingRate.service} · ${shippingRate.area}`,
      total: subtotal + fee,
      status: "awaiting_payment",
      paymentStatus: "awaiting_proof",
      recipient,
      courierName: "",
      trackingNumber: "",
      payment: {
        method: "Transfer (Simulasi)",
        status: "awaiting_proof",
        amount: subtotal + fee,
        proof: null,
        proofName: "",
        submittedAt: null,
        verifiedAt: null,
        rejectionNote: "",
      },
      history: [{ status: "awaiting_payment", note: "Pesanan dibuat.", at: now }],
      createdAt: now,
      updatedAt: now,
      paidAt: null,
      shippedAt: null,
    };
    const orders = this.orders();
    orders.unshift(order);
    this.saveOrders(orders);
    return order;
  },

  createOrderFromCart(recipient, shippingRate) {
    const items = Cart.itemsDetail().map(({ product, variant, quantity }) => ({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      size: variant.size,
      color: variant.color,
      unitPrice: product.price + (variant.price_adjustment || 0),
      quantity,
    }));
    return this.createOrder({ type: "official", items, shippingRate, recipient });
  },

  createCustomOrder(request, shippingRate) {
    const product = Store.getProduct(request.productId);
    const variant = product ? product.variants.find((v) => v.size === request.size && v.color === request.color) : null;
    const items = [
      {
        productId: request.productId,
        variantId: variant ? variant.id : null,
        name: `${request.productName} — Custom`,
        size: request.size,
        color: request.color,
        unitPrice: Number(request.quotedUnitPrice),
        quantity: Number(request.quantity),
      },
    ];
    const order = this.createOrder({
      type: "custom",
      items,
      shippingRate,
      recipient: {
        name: Auth.user.name,
        phone: "-",
        address: "Alamat belum diisi — lengkapi melalui konfirmasi admin.",
        city: "-",
        postal: "-",
      },
      customRequestId: request.id,
    });
    this.updateRequest(request.id, { status: "ordered" });
    return order;
  },
};

/* ---------- Auth demo ---------- */
/* Login / daftar / keluar akun demo karena backend belum ada: sesi disimpan
   di mv_auth (localStorage). Terdapat dua role: pembeli dan admin. */
const Auth = {
  user: null,

  load() {
    this.user = readJSON(KEYS.auth, null);
    return this.user;
  },
  login(email, password) {
    const user = Store.users().find(
      (u) => u.email.toLowerCase() === String(email).trim().toLowerCase() && u.password === password
    );
    if (!user) return null;
    this.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    writeJSON(KEYS.auth, this.user);
    return this.user;
  },
  register(name, email, password) {
    const normalized = String(email).trim().toLowerCase();
    if (Store.users().some((u) => u.email.toLowerCase() === normalized)) return null;
    const user = {
      id: uid("u"),
      name: String(name).trim(),
      email: normalized,
      password: password,
      role: "buyer",
    };
    Store.addUser(user);
    this.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    writeJSON(KEYS.auth, this.user);
    return this.user;
  },
  logout() {
    this.user = null;
    localStorage.removeItem(KEYS.auth);
  },
  isAdmin() {
    return !!this.user && this.user.role === "admin";
  },
  isBuyer() {
    return !!this.user && this.user.role === "buyer";
  },
  requireRole(role) {
    if (!this.user) {
      const next = location.pathname.replace(MV_BASE, "") + location.search;
      location.href = baseUrl("login.php?next=" + encodeURIComponent(next));
      return false;
    }
    if (role && this.user.role !== role && !(role === "buyer" && this.user.role === "admin")) {
      location.href = baseUrl("index.php");
      return false;
    }
    return true;
  },
};

/* ---------- Cart (localStorage) ---------- */
/* Keranjang pembeli: daftar {productId, variantId, quantity} disimpan langsung
   di mv_cart dan ditulis ulang ke localStorage setelah setiap perubahan. */
const Cart = {
  items: [],

  load() {
    this.items = readJSON(KEYS.cart, []);
  },
  save() {
    writeJSON(KEYS.cart, this.items);
  },
  add(productId, variantId, quantity = 1) {
    const product = Store.getProduct(productId);
    if (!product) return false;
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant || variant.active === false || variant.stock < quantity) return false;

    const existing = this.items.find((i) => i.productId === productId && i.variantId === variantId);
    if (existing) {
      if (existing.quantity + quantity > variant.stock) return false;
      existing.quantity += quantity;
    } else {
      this.items.push({ productId, variantId, quantity });
    }
    this.save();
    this.dispatch();
    return true;
  },
  setQuantity(productId, variantId, quantity) {
    const item = this.items.find((i) => i.productId === productId && i.variantId === variantId);
    if (!item) return false;
    const product = Store.getProduct(productId);
    const variant = product && product.variants.find((v) => v.id === variantId);
    if (!variant) return false;
    if (quantity < 1) {
      this.remove(productId, variantId);
      return true;
    }
    if (quantity > variant.stock) return false;
    item.quantity = quantity;
    this.save();
    this.dispatch();
    return true;
  },
  remove(productId, variantId) {
    this.items = this.items.filter((i) => !(i.productId === productId && i.variantId === variantId));
    this.save();
    this.dispatch();
  },
  clear() {
    this.items = [];
    this.save();
    this.dispatch();
  },
  count() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  },
  subtotal() {
    return this.itemsDetail().reduce((sum, i) => sum + i.unit * i.quantity, 0);
  },
  itemsDetail() {
    const out = [];
    this.items.forEach((item) => {
      const product = Store.getProduct(item.productId);
      if (!product) return;
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) return;
      out.push({
        product,
        variant,
        quantity: item.quantity,
        unit: product.price + (variant.price_adjustment || 0),
      });
    });
    return out;
  },
  dispatch() {
    document.dispatchEvent(new CustomEvent("mv:cart-changed", { detail: { count: this.count() } }));
    const el = $("#cart-count");
    const label = cartLabel(this.count());
    if (el) { el.textContent = this.count(); el.parentElement.setAttribute("aria-label", label); }
  },
};

/* ---------- UI helpers ---------- */
/* Helper tampilan: badge status (teks diambil dari data.js agar konsisten),
   toast notifikasi, modal global, dan kompresi gambar unggahan (maks. 5 MB
   melalui canvas agar tidak membebani localStorage). */
function statusBadge(kind, status) {
  const labels = MerchData.statusLabels[kind] || {};
  const tone = MerchData.statusTone[status] || "neutral";
  const label = labels[status] || status || "—";
  return `<span class="status-pill status-pill--${tone}">${escapeHtml(label)}</span>`;
}

function toast(message, type = "success") {
  let $el = jQuery("#mv-toast");
  if (!$el.length) $el = jQuery('<div id="mv-toast" class="toast"></div>').appendTo("body");
  $el
    .attr("class", "toast is-visible " + (type === "error" ? "toast--error" : "toast--success"))
    .text(message);
  clearTimeout($el.data("timer"));
  $el.data("timer", setTimeout(() => $el.removeClass("is-visible"), 2600));
}

function openModal(html) {
  const $modal = jQuery("#app-modal");
  if (!$modal.length) return;
  jQuery("#app-modal-content").html(html);
  bootstrap.Modal.getOrCreateInstance($modal[0]).show();
}

function closeModal() {
  const $modal = jQuery("#app-modal");
  if (!$modal.length) return;
  bootstrap.Modal.getOrCreateInstance($modal[0]).hide();
}

function compressImage(file, maxDim = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) {
      reject(new Error("Format file tidak didukung."));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Ukuran file maksimal 5 MB."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gambar tidak dapat dibaca."));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function getStock(product) {
  return (product.variants || []).reduce((sum, v) => sum + (v.active === false ? 0 : Number(v.stock) || 0), 0);
}

function isInStock(product) {
  return product && product.in_stock !== false && (product.variants || []).some((v) => v.active !== false && v.stock > 0);
}

function categoryLabel(id) {
  const map = { apparel: "Apparel", accessories: "Accessories", collectibles: "Collectibles", custom: "Custom" };
  return map[id] || id;
}

function emptyState(iconName, title, text, actionHtml = "") {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">${icon(iconName, "icon icon--lg")}</div>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
      ${actionHtml}
    </div>`;
}

/* ---------- Product card ---------- */
/* Kartu produk dirender sepenuhnya di sini (HTML via JS). Nama class tidak
   diubah agar konsisten dengan pemilihan elemen di bagian lain aplikasi. */
function productCard(product) {
  const stock = getStock(product);
  const available = isInStock(product);
  const isCustom = product.product_type === "custom_base";
  const stockBadge = available
    ? `<span class="card__stock card__stock--ok">Tersedia · ${stock} unit</span>`
    : `<span class="card__stock card__stock--out">Stok habis</span>`;
  const tag = isCustom ? "Custom" : categoryLabel(product.category);
  const tagClass = isCustom ? "card__tag card__tag--custom" : "card__tag";
  const action = isCustom
    ? `<a href="${baseUrl("custom/studio.php")}" class="btn btn--dark btn--sm w-100">Buat Custom</a>`
    : available
      ? `<button class="btn btn--primary btn--sm w-100" data-action="add-to-cart" data-id="${escapeHtml(product.id)}">Tambah ke Keranjang</button>`
      : `<button class="btn btn--outline btn--sm w-100" disabled>Stok Habis</button>`;
  return `
    <div class="col-6 col-md-4 col-xl-3 d-flex">
    <article class="card product-card w-100" data-id="${escapeHtml(product.id)}"${isCustom ? ' data-product-type="custom_base"' : ""}>
      <a class="card__media" href="${baseUrl("shop/detail.php?id=" + encodeURIComponent(product.id))}" aria-label="Lihat ${escapeHtml(product.name)}">
        <img src="${imageUrl(product.cover)}" alt="${escapeHtml(product.name)}" loading="lazy">
        <span class="${escapeHtml(tagClass)}">${escapeHtml(tag)}</span>
      </a>
      <div class="card__body">
        <h3 class="card__title">
          <a href="${baseUrl("shop/detail.php?id=" + encodeURIComponent(product.id))}">${escapeHtml(product.name)}</a>
        </h3>
        <div class="card__price">${formatPrice(product.price)}</div>
        ${stockBadge}
      </div>
      <div class="card__actions">${action}</div>
    </article>
    </div>`;
}

function bindQuickAdd(root = document) {
  jQuery(root).on("click", '[data-action="add-to-cart"]', function () {
    const $btn = jQuery(this);
    if ($btn.prop("disabled")) return;
    const product = Store.getProduct($btn.data("id"));
    if (!product) return;
    if (product.product_type !== "official") {
      toast("Produk custom dipesan melalui Custom Studio.", "info");
      return;
    }
    const variant = product.variants.find((v) => v.active !== false && v.stock > 0);
    if (!variant) {
      toast("Stok tidak mencukupi.", "error");
      return;
    }
    if (Cart.add(product.id, variant.id, 1)) {
      toast(`${product.name} ditambahkan ke keranjang.`);
      const original = $btn.text();
      $btn.text("Ditambahkan ✓").prop("disabled", true);
      setTimeout(() => $btn.text(original).prop("disabled", false), 1000);
    } else {
      toast("Stok tidak mencukupi.", "error");
    }
  });
}

/* ---------- Header / nav ---------- */
/* Inisialisasi header: menu burger, nama akun & keluar, tautan admin (hanya
   admin), dan badge jumlah item keranjang di pojok kanan. */
function initHeader() {
  const $burger = jQuery("#burger");
  const $menu = jQuery("#nav-menu");
  if ($burger.length && $menu.length) {
    $burger.on("click", () => {
      const open = $menu.toggleClass("is-open").hasClass("is-open");
      $burger.attr("aria-expanded", open);
      jQuery("body").toggleClass("nav-open", open);
    });
    $menu.find("a").on("click", () => {
      $menu.removeClass("is-open");
      $burger.attr("aria-expanded", "false");
      jQuery("body").removeClass("nav-open");
    });
  }

  const logout = () => {
    Auth.logout();
    toast("Anda telah keluar.");
    setTimeout(() => (location.href = baseUrl("index.php")), 400);
  };
  const firstName = Auth.user ? escapeHtml(Auth.user.name.split(" ")[0]) : "";
  const loginBtn = (extra = "") =>
    `<a href="${baseUrl("login.php")}" class="btn btn--outline btn--sm" ${extra}>Masuk</a>`;

  if (Auth.user) {
    jQuery("#nav-account")
      .html(`<a class="nav-link nav-user" href="${baseUrl("orders/index.php")}">Halo, ${firstName}</a>
        <button class="nav-link nav-logout" id="logout-btn" type="button">Keluar</button>`)
      .find("#logout-btn").on("click", logout);
    jQuery("#nav-account-mobile")
      .html(`<span class="nav-user">Halo, ${firstName}</span>
        <button class="nav-link nav-logout" id="logout-btn-mobile" type="button">Keluar</button>`)
      .find("#logout-btn-mobile").on("click", logout);
  } else {
    jQuery("#nav-account").html(loginBtn());
    jQuery("#nav-account-mobile").html(loginBtn('style="width:100%;text-align:left;"'));
  }

  jQuery("#nav-admin, #footer-admin-link").prop("hidden", !Auth.isAdmin());

  Cart.load();
  Cart.dispatch();
}

/* ---------- Home page ---------- */
/* Beranda: render produk unggulan (featured) dari data master di grid beranda. */
function initHome() {
  const $grid = jQuery("#featured-grid");
  if (!$grid.length) return;
  const featured = Store.officialProducts().filter((p) => p.featured).slice(0, 4);
  $grid.html(featured.map(productCard).join(""));
  bindQuickAdd($grid[0]);
  jQuery("#home-product-count").text(Store.officialProducts().length);
}

/* ---------- Catalog ---------- */
/* Katalog: mencari produk, memfilter menurut kategori, dan mengurutkan hasil. */
function initCatalog() {
  const $grid = jQuery("#product-grid");
  if (!$grid.length) return;

  const $search = jQuery("#search-input");
  const $sort = jQuery("#sort-select");
  const $chips = jQuery(".filter-chip[data-category]");
  const $count = jQuery("#results-count");
  const $empty = jQuery("#empty-state");

  const params = new URLSearchParams(location.search);
  const initialCategory = params.get("category");
  const valid = $chips.filter((_, c) => c.dataset.category === initialCategory).length > 0;
  let category = initialCategory && valid ? initialCategory : "all";
  if (params.get("q")) $search.val(params.get("q"));
  $chips.each((_, c) => jQuery(c).toggleClass("active", c.dataset.category === category));

  function render() {
    let products = Store.officialProducts();
    if (category === "all") products = products.concat(Store.customProducts());
    else products = products.filter((p) => p.category === category);

    const query = ($search.val() || "").trim().toLowerCase();
    if (query) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    const sortValue = $sort.val() || "featured";
    if (sortValue === "price-asc") products.sort((a, b) => a.price - b.price);
    else if (sortValue === "price-desc") products.sort((a, b) => b.price - a.price);
    else if (sortValue === "name") products.sort((a, b) => a.name.localeCompare(b.name));
    else products.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

    $grid.html(products.map(productCard).join(""));
    $count.text(`${products.length} produk ditemukan`);
    $empty.prop("hidden", products.length > 0).css("display", products.length ? "none" : "block");
  }

  $chips.on("click", function () {
    $chips.removeClass("active");
    jQuery(this).addClass("active");
    category = this.dataset.category;
    render();
  });

  let timer;
  $search.on("input", () => {
    clearTimeout(timer);
    timer = setTimeout(render, 200);
  });
  $sort.on("change", render);

  render();
  bindQuickAdd($grid[0]);
}

/* ---------- Product detail ---------- */
/* Detail produk: galeri gambar, pilihan varian, kuantitas, dan tombol tambah
   ke keranjang. */
function initProductDetail() {
  const root = $("#product-detail-root");
  if (!root) return;

  const id = new URLSearchParams(location.search).get("id");
  const product = id ? Store.getProduct(id) : null;
  if (!product) {
    root.innerHTML = emptyState(
      "alert",
      "Produk tidak ditemukan",
      "Produk yang Anda cari tidak tersedia atau sudah dihapus.",
      `<a href="${baseUrl("shop/index.php")}" class="btn btn--primary mt-m">Kembali ke Katalog</a>`
    );
    return;
  }

  const available = isInStock(product);
  const activeVariants = product.variants.filter((v) => v.active !== false);
  const images = product.images && product.images.length ? product.images : [product.cover];

  const thumbs = images
    .map(
      (img, i) => `
        <button type="button" class="gallery__thumb ${i === 0 ? "is-active" : ""}" data-src="${imageUrl(img)}" aria-label="Gambar ${i + 1}">
          <img src="${imageUrl(img)}" alt="${escapeHtml(product.name)} ${i + 1}">
        </button>`
    )
    .join("");

  const variantOptions = activeVariants
    .map((v, i) => {
      const unit = product.price + (v.price_adjustment || 0);
      return `
        <label class="variant-option ${v.stock < 1 ? "is-disabled" : ""}">
          <input type="radio" name="variant" value="${escapeHtml(v.id)}" ${i === 0 ? "checked" : ""} ${v.stock < 1 ? "disabled" : ""}>
          <span class="variant-option__main">
            <strong>${escapeHtml(v.size)} · ${escapeHtml(v.color)}</strong>
            <small>SKU ${escapeHtml(v.sku)} · Stok ${v.stock}</small>
          </span>
          <span class="variant-option__price">${formatPrice(unit)}</span>
        </label>`;
    })
    .join("");

  const related = Store.officialProducts()
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  root.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="${baseUrl("index.php")}">Home</a> / <a href="${baseUrl("shop/index.php")}">Shop</a> / <span>${escapeHtml(product.name)}</span>
    </nav>
    <div class="detail-grid row g-4 align-items-start">
      <div class="col-12 col-lg-6">
      <div class="gallery card">
        <div class="gallery__main">
          <img id="gallery-main" src="${imageUrl(images[0])}" alt="${escapeHtml(product.name)}">
        </div>
        ${images.length > 1 ? `<div class="gallery__thumbs">${thumbs}</div>` : ""}
      </div>
      </div>
      <div class="col-12 col-lg-6">
      <div class="panel detail-panel">
        <span class="detail-cat">${escapeHtml(categoryLabel(product.category))}</span>
        <h1>${escapeHtml(product.name)}</h1>
        <div class="detail-price" id="variant-price">${formatPrice(product.price)}</div>
        ${available ? `<span class="badge badge--success">Tersedia</span>` : `<span class="badge badge--critical">Stok Habis</span>`}
        <p class="detail-desc">${escapeHtml(product.description)}</p>

        <form id="detail-form">
          <div class="form-group">
            <label>Varian</label>
            <div class="variant-list">${variantOptions}</div>
          </div>
          <div class="form-group">
            <label for="quantity">Kuantitas</label>
            <div class="qty-control qty-control--sm">
              <button type="button" class="qty-btn" data-qty="-1" aria-label="Kurangi">−</button>
              <input type="number" id="quantity" value="1" min="1" max="${Math.min(activeVariants[0] ? activeVariants[0].stock : 1, 99)}">
              <button type="button" class="qty-btn" data-qty="1" aria-label="Tambah">+</button>
            </div>
            <p class="form-hint" id="variant-stock">Stok tersedia: ${activeVariants[0] ? activeVariants[0].stock : 0}</p>
          </div>
          <button type="button" class="btn btn--primary w-100" id="add-to-cart-detail" data-id="${escapeHtml(product.id)}" ${available ? "" : "disabled"}>
            ${available ? "Tambah ke Keranjang" : "Stok Habis"}
          </button>
        </form>

        <div class="detail-meta">
          <p><strong>Total stok:</strong> ${getStock(product)} unit</p>
          <p><strong>Pengiriman:</strong> dihitung saat checkout dari tarif yang tersedia.</p>
          <p><strong>Pembayaran:</strong> simulasi transfer, diverifikasi admin.</p>
        </div>
      </div>
      </div>
    </div>
    ${related.length ? `<section class="section section--tight"><div class="toolbar"><h2>Produk Serupa</h2></div><div class="product-grid row g-3">${related.map(productCard).join("")}</div></section>` : ""}
  `;

  $$(".gallery__thumb", root).forEach((thumb) => {
    bind(thumb, "click", () => {
      $$(".gallery__thumb", root).forEach((t) => t.classList.remove("is-active"));
      thumb.classList.add("is-active");
      $("#gallery-main").src = thumb.dataset.src;
    });
  });

  /* ---------- Zoom lightbox ---------- */
  const galleryMain = $("#gallery-main");
  const lightbox = $("#product-lightbox");
  const lightboxImg = $("#lightbox-img");
  const lightboxClose = $("#lightbox-close");

    const lightboxCaption = $("#lightbox-caption");
    if (galleryMain && lightbox && lightboxImg && lightboxClose && lightboxCaption) {
      const openLightbox = () => {
        lightboxImg.src = galleryMain.src;
        lightboxCaption.textContent = galleryMain.alt || "";
        lightbox.classList.add("is-visible");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      };
      const closeLightbox = () => {
        lightbox.classList.remove("is-visible");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      };

      galleryMain.style.cursor = "zoom-in";
    bind(galleryMain, "click", openLightbox);
    bind(lightboxClose, "click", closeLightbox);
    bind(lightbox, "click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    bind(document, "keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-visible")) closeLightbox();
    });
  }

  const form = $("#detail-form");
  const qtyInput = $("#quantity");
  const addBtn = $("#add-to-cart-detail");
  const priceEl = $("#variant-price");
  const stockEl = $("#variant-stock");

  function selectedVariant() {
    const checked = form.querySelector('input[name="variant"]:checked');
    return checked ? activeVariants.find((v) => v.id === checked.value) : null;
  }

  function updateVariantUI() {
    const variant = selectedVariant();
    if (!variant) return;
    if (priceEl) priceEl.textContent = formatPrice(product.price + (variant.price_adjustment || 0));
    const max = Math.min(variant.stock, 99);
    if (qtyInput) {
      qtyInput.max = Math.max(1, max);
      if (parseInt(qtyInput.value, 10) > max) qtyInput.value = max;
      if (parseInt(qtyInput.value, 10) < 1) qtyInput.value = 1;
    }
    if (stockEl) stockEl.textContent = variant.stock > 0 ? `Stok tersedia: ${variant.stock}` : "Stok habis";
    if (addBtn) addBtn.disabled = variant.stock < 1;
  }

  bind(form, "change", updateVariantUI);
  $$(".qty-btn", form).forEach((btn) => {
    bind(btn, "click", () => {
      const max = parseInt(qtyInput.max, 10) || 1;
      let value = (parseInt(qtyInput.value, 10) || 1) + Number(btn.dataset.qty);
      value = Math.max(1, Math.min(max, value));
      qtyInput.value = value;
    });
  });
  updateVariantUI();

  bind(addBtn, "click", () => {
    const variant = selectedVariant();
    if (!variant) return;
    const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    if (Cart.add(product.id, variant.id, qty)) {
      toast(`${qty} × ${product.name} ditambahkan ke keranjang.`);
      addBtn.textContent = "Ditambahkan ✓";
      setTimeout(() => (addBtn.textContent = "Tambah ke Keranjang"), 1100);
    } else {
      toast("Gagal menambahkan. Periksa stok yang tersedia.", "error");
    }
  });

  const relatedGrid = $(".section .product-grid", root);
  if (relatedGrid) bindQuickAdd(relatedGrid);
}

/* ---------- Cart page ---------- */
/* Halaman keranjang: ubah jumlah item, hapus item, dan lanjut ke halaman
   pembayaran. */
function initCartPage() {
  const $container = jQuery("#cart-items");
  if (!$container.length) return;
  const $summaryItems = jQuery("#cart-summary-items");
  const $subtotals = jQuery("[data-cart-subtotal]");
  const $empty = jQuery("#cart-empty");
  const $body = jQuery("#cart-body");

  function render() {
    const items = Cart.itemsDetail();
    if (!items.length) {
      $container.empty();
      $empty.prop("hidden", false);
      $body.prop("hidden", true);
      $subtotals.text(formatPrice(0));
      return;
    }
    $empty.prop("hidden", true);
    $body.prop("hidden", false);

    $container.html(
      items
        .map(({ product, variant, quantity, unit }) => {
          const ids = `data-pid="${escapeHtml(product.id)}" data-vid="${escapeHtml(variant.id)}"`;
          const href = baseUrl("shop/detail.php?id=" + encodeURIComponent(product.id));
          return `
        <div class="cart-item card">
          <a class="cart-item__media" href="${href}">
            <img src="${imageUrl(product.cover)}" alt="${escapeHtml(product.name)}">
          </a>
          <div class="cart-item__info">
            <a class="cart-item__title" href="${href}">${escapeHtml(product.name)}</a>
            <p class="muted">${escapeHtml(variant.size)} · ${escapeHtml(variant.color)} · ${escapeHtml(variant.sku)}</p>
            <p class="cart-item__unit">${formatPrice(unit)} / item</p>
            ${product.product_type === "custom_base" ? `<span class="badge badge--info badge--compact">Custom</span>` : ""}
            <button type="button" class="link-danger" data-action="cart-remove" ${ids}>Hapus</button>
          </div>
          <div class="cart-item__qty">
            <div class="qty-control">
              <button type="button" class="qty-btn" data-action="cart-dec" ${ids} aria-label="Kurangi">−</button>
              <input type="number" value="${quantity}" min="1" max="${variant.stock}" ${ids} aria-label="Kuantitas">
              <button type="button" class="qty-btn" data-action="cart-inc" ${ids} aria-label="Tambah">+</button>
            </div>
            <span class="muted">Stok ${variant.stock}</span>
          </div>
          <div class="cart-item__total">${formatPrice(unit * quantity)}</div>
        </div>`;
        })
        .join("")
    );

    $subtotals.text(formatPrice(Cart.subtotal()));
    $summaryItems.text(`${Cart.count()} item`);
  }

  $container.on("click", "button[data-action]", function () {
    const $btn = jQuery(this);
    const pid = String($btn.data("pid"));
    const vid = String($btn.data("vid"));
    const item = Cart.items.find((i) => i.productId === pid && i.variantId === vid);
    if (!item) return;

    const action = $btn.data("action");
    if (action === "cart-inc") {
      if (!Cart.setQuantity(pid, vid, item.quantity + 1)) toast("Kuantitas melebihi stok.", "error");
    } else if (action === "cart-dec") {
      Cart.setQuantity(pid, vid, item.quantity - 1);
    } else if (action === "cart-remove") {
      Cart.remove(pid, vid);
      toast("Item dihapus dari keranjang.");
    }
  });

  $container.on("change", "input[data-pid]", function () {
    const $input = jQuery(this);
    const qty = parseInt($input.val(), 10) || 1;
    if (!Cart.setQuantity(String($input.data("pid")), String($input.data("vid")), qty)) {
      toast("Kuantitas melebihi stok tersedia.", "error");
    }
  });

  jQuery("#to-checkout").on("click", () => {
    if (!Cart.items.length) {
      toast("Keranjang masih kosong.", "error");
      return;
    }
    if (!Auth.user) {
      location.href = baseUrl("login.php?next=" + encodeURIComponent("checkout/index.php"));
      return;
    }
    location.href = baseUrl("checkout/index.php");
  });

  jQuery(document).on("mv:cart-changed", render);
  render();
}

/* ---------- Checkout ---------- */
/* Checkout: formulir alamat penerima, pilihan tarif ongkir, dan membuat
   pesanan (simulasi, data tersimpan di localStorage). */
function initCheckout() {
  const $form = jQuery("#checkout-form");
  if (!$form.length) return;
  if (!Auth.requireRole("buyer")) return;

  const $items = jQuery("#checkout-items");
  const $empty = jQuery("#checkout-empty");
  const $shipping = jQuery("#shipping-rate");
  const $subtotal = jQuery("#checkout-subtotal");
  const $shippingFee = jQuery("#checkout-shipping");
  const $total = jQuery("#checkout-total, #checkout-total-mobile");
  const $errorBox = jQuery("#checkout-error");
  const $name = jQuery("#recipient-name");
  const $phone = jQuery("#recipient-phone");
  const $address = jQuery("#recipient-address");
  const $city = jQuery("#recipient-city");
  const $postal = jQuery("#recipient-postal");

  const params = new URLSearchParams(location.search);
  const customId = params.get("custom");
  const customRequest = customId ? Store.findRequest(customId) : null;
  const customMode = !!customId;

  let items = [];
  if (customMode) {
    const invalid =
      !customRequest ||
      customRequest.userId !== Auth.user.id ||
      customRequest.status !== "approved" ||
      !customRequest.quotedUnitPrice;
    if (invalid) {
      {
        $empty.prop("hidden", false).html(emptyState(
          "alert",
          "Penawaran tidak dapat diproses",
          "Custom request tidak ditemukan, bukan milik Anda, atau belum disetujui admin.",
          `<a href="${baseUrl("custom/status.php")}" class="btn btn--primary mt-m">Lihat Status Custom</a>`
        ));
      }
      $form.prop("hidden", true);
      return;
    }
    items = [
      {
        productId: customRequest.productId,
        name: `${customRequest.productName} — Custom`,
        size: customRequest.size,
        color: customRequest.color,
        quantity: Number(customRequest.quantity),
        unit: Number(customRequest.quotedUnitPrice),
      },
    ];
  } else {
    items = Cart.itemsDetail().map(({ product, variant, quantity, unit }) => ({
      productId: product.id,
      name: product.name,
      size: variant.size,
      color: variant.color,
      quantity,
      unit,
    }));
  }

  if (!items.length) {
    $empty.prop("hidden", false);
    $form.prop("hidden", true);
    return;
  }
  $empty.prop("hidden", true);
  $form.prop("hidden", false);

  $shipping.html('<option value="">Pilih area & layanan…</option>');
  Store.activeShippingRates().forEach((rate) => {
    jQuery("<option>", { value: rate.id, text: `${rate.area} — ${rate.service} (${formatPrice(rate.fee)})` }).appendTo($shipping);
  });
  const requestedRate = params.get("rate");
  const preferredRate = Store.findShippingRate(requestedRate) || Store.activeShippingRates()[0];
  if (preferredRate) $shipping.val(preferredRate.id);

  function currentRate() {
    return Store.findShippingRate($shipping.val()) || { fee: 0 };
  }

  function subtotalValue() {
    return items.reduce((sum, item) => sum + item.unit * item.quantity, 0);
  }

  function renderSummary() {
    $items.html(items
      .map((item) => `
        <div class="summary-row">
          <span>${escapeHtml(item.name)}<br><small class="muted">${escapeHtml(item.size)} · ${escapeHtml(item.color)} · ${item.quantity}×</small></span>
          <strong>${formatPrice(item.unit * item.quantity)}</strong>
        </div>`)
      .join(""));
    const subtotal = subtotalValue();
    const shipping = Number(currentRate().fee) || 0;
    $subtotal.text(formatPrice(subtotal));
    $shippingFee.text(formatPrice(shipping));
    $total.text(formatPrice(subtotal + shipping));
  }

  if (Auth.user) $name.val(Auth.user.name);
  $shipping.on("change", renderSummary);
  renderSummary();

  $form.on("submit", (e) => {
    e.preventDefault();
    const recipient = {
      name: $name.val().trim(),
      phone: $phone.val().trim(),
      address: $address.val().trim(),
      city: $city.val().trim(),
      postal: $postal.val().trim(),
    };
    const rate = Store.findShippingRate($shipping.val());

    const errors = [];
    if (recipient.name.length < 2) errors.push("Nama penerima wajib diisi.");
    if (!/^[0-9+\-\s]{8,20}$/.test(recipient.phone)) errors.push("Nomor kontak tidak valid (8–20 digit).");
    if (recipient.address.length < 8) errors.push("Alamat pengiriman terlalu singkat.");
    if (recipient.city.length < 2) errors.push("Kota/area wajib diisi.");
    if (!rate || rate.active === false) errors.push("Pilih tarif pengiriman yang tersedia.");
    if (!items.length) errors.push("Tidak ada item untuk diproses.");

    if (errors.length) {
      $errorBox
        .prop("hidden", false)
        .html(`<strong>Periksa kembali data Anda:</strong><ul>${errors.map((er) => `<li>${escapeHtml(er)}</li>`).join("")}</ul>`);
      $errorBox[0].scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    let order = null;
    if (customMode) {
      order = Store.createOrder({
        type: "custom",
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          size: item.size,
          color: item.color,
          unitPrice: item.unit,
          quantity: item.quantity,
        })),
        shippingRate: rate,
        recipient,
        customRequestId: customRequest.id,
      });
      if (order) Store.updateRequest(customRequest.id, { status: "ordered" });
    } else {
      order = Store.createOrderFromCart(recipient, rate);
    }

    if (!order) {
      toast("Gagal membuat pesanan. Coba lagi.", "error");
      return;
    }
    if (!customMode) Cart.clear();
    toast("Pesanan berhasil dibuat. Silakan kirim bukti pembayaran simulasi.");
    setTimeout(() => {
      location.href = baseUrl(`orders/detail.php?id=${encodeURIComponent(order.id)}&created=1`);
    }, 500);
  });
}

/* ---------- Orders list ---------- */
/* Daftar riwayat pesanan pembeli dengan filter status (semua, menunggu
   pembayaran, dan seterusnya). */
function initOrdersPage() {
  const root = $("#orders-list");
  if (!root) return;
  if (!Auth.requireRole("buyer")) return;

  const orders = (Auth.isAdmin() ? Store.orders() : Store.ordersFor(Auth.user.id)).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const filterEl = $("#order-filter");
  const emptyEl = $("#orders-empty");

  function render() {
    const filter = filterEl ? filterEl.value : "all";
    const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
    if (!filtered.length) {
      root.innerHTML = "";
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    root.innerHTML = filtered
      .map((order) => `
        <article class="order-card card">
          <div class="order-card__head">
            <div>
              <p class="order-code">${escapeHtml(order.code)}</p>
              <p class="muted">${formatDate(order.createdAt)} · ${order.type === "custom" ? "Custom Merch" : "Merchandise Reguler"}</p>
            </div>
            <div class="order-card__status">
              ${statusBadge("order", order.status)}
              ${statusBadge("payment", order.paymentStatus)}
            </div>
          </div>
          <div class="order-card__items">
            ${order.items
              .map(
                (it) => `<div class="summary-row"><span>${escapeHtml(it.name)}<br><small class="muted">${escapeHtml(it.size || "")} · ${escapeHtml(it.color || "")} · ${it.quantity}×</small></span><strong>${formatPrice(it.unitPrice * it.quantity)}</strong></div>`
              )
              .join("")}
            ${order.type === "custom" ? `<p class="muted" style="margin-top: 0.5rem"><span class="badge badge--info">Custom</span> · <a href="${baseUrl("custom/status.php")}" class="link">Lihat status permintaan ${escapeHtml(order.customRequestId || "")}</a></p>` : ""}
          </div>
          <div class="order-card__foot">
            <div>
              <span class="muted">Total</span>
              <div class="order-total">${formatPrice(order.total)}</div>
            </div>
            <a href="${baseUrl(`orders/detail.php?id=${encodeURIComponent(order.id)}`)}" class="btn btn--primary btn--sm">Lihat Detail</a>
          </div>
        </article>`)
      .join("");
  }

  if (filterEl) bind(filterEl, "change", render);
  render();
}

/* ---------- Order detail ---------- */
/* Detail pesanan: item, alamat pengiriman, formulir bukti pembayaran, dan
   timeline riwayat status pesanan. */
function initOrderDetail() {
  const root = $("#order-detail-root");
  if (!root) return;
  if (!Auth.requireRole("buyer")) return;

  const id = new URLSearchParams(location.search).get("id");
  const order = id ? Store.findOrder(id) : null;

  if (!order) {
    root.innerHTML = emptyState(
      "alert",
      "Pesanan tidak ditemukan",
      "Pesanan yang Anda cari tidak tersedia.",
      `<a href="${baseUrl("orders/index.php")}" class="btn btn--primary mt-m">Kembali ke Riwayat</a>`
    );
    return;
  }

  if (order.userId !== Auth.user.id && !Auth.isAdmin()) {
    root.innerHTML = emptyState(
      "lock",
      "Akses ditolak",
      "Anda tidak memiliki akses ke pesanan milik pengguna lain.",
      `<a href="${baseUrl("orders/index.php")}" class="btn btn--primary mt-m">Kembali</a>`
    );
    return;
  }

  const payment = order.payment || {};
  const canUpload = order.paymentStatus !== "verified" && order.status !== "cancelled";
  const isNew = new URLSearchParams(location.search).get("created") === "1";

  const paymentPanel = (() => {
    if (order.paymentStatus === "verified") {
      return `
        <div class="payment-panel payment-panel--success">
          <h3>Pembayaran Terverifikasi</h3>
          <p>Pembayaran simulasi telah diverifikasi admin pada ${formatDate(payment.verifiedAt)}.</p>
          <p class="muted">Metode: ${escapeHtml(payment.method || "Transfer (Simulasi)")} · Nominal ${formatPrice(payment.amount)}</p>
        </div>`;
    }
    if (order.status === "cancelled") {
      return `<div class="payment-panel payment-panel--muted"><h3>Pesanan Dibatalkan</h3><p>Pembayaran tidak diproses untuk pesanan ini.</p></div>`;
    }
    if (order.paymentStatus === "pending_verification") {
      return `
        <div class="payment-panel payment-panel--warning">
          <h3>Bukti Pembayaran Menunggu Verifikasi</h3>
          <p>Bukti simulasi dikirim pada ${formatDate(payment.submittedAt)}. Admin akan memverifikasi sebelum produksi/pengiriman.</p>
          <p class="muted">Nominal: ${formatPrice(payment.amount)}</p>
        </div>`;
    }
    return `
      <div class="payment-panel">
        <h3>Pembayaran Simulasi</h3>
        <p class="muted">Transfer simulasi sebesar <strong>${formatPrice(payment.amount)}</strong>. Unggah bukti demo (bukan data rekening nyata).</p>
        ${order.paymentStatus === "rejected" && payment.rejectionNote
          ? `<div class="alert alert--error">Ditolak admin: ${escapeHtml(payment.rejectionNote)}</div>`
          : ""}
        <form id="proof-form">
          <div class="form-group">
            <label for="proof-file">Bukti Pembayaran (JPEG/PNG/WebP, maks. 5 MB)</label>
            <input type="file" id="proof-file" accept="image/jpeg,image/png,image/webp" class="file-input">
            <p class="form-hint">Gunakan gambar demo. Jangan mengunggah data keuangan sungguhan.</p>
          </div>
          <div class="proof-preview" id="proof-preview" hidden><img alt="Pratinjau bukti pembayaran"></div>
          <button type="submit" class="btn btn--primary" id="submit-proof" disabled>Kirim Bukti Pembayaran</button>
        </form>
      </div>`;
  })();

  root.innerHTML = `
    <nav class="breadcrumb"><a href="${baseUrl("orders/index.php")}">Riwayat Pesanan</a> / <span>${escapeHtml(order.code)}</span></nav>
    ${isNew ? `<div class="alert alert--success">Pesanan berhasil dibuat. Status saat ini: menunggu pembayaran. Silakan kirim bukti pembayaran simulasi di bawah.</div>` : ""}
    <div class="order-detail-head">
      <div>
        <h1>${escapeHtml(order.code)}</h1>
        <p class="muted">Dibuat ${formatDate(order.createdAt)} · ${order.type === "custom" ? "Custom Merch" : "Merchandise Reguler"}</p>
      </div>
      <div class="d-flex gap-s flex-wrap">${statusBadge("order", order.status)} ${statusBadge("payment", order.paymentStatus)}</div>
    </div>

    <div class="detail-grid order-detail-grid row g-4 align-items-start">
      <div class="col-12 col-lg-8">
      <div class="stack">
        <section class="panel">
          <h2 class="panel__title">Item Pesanan</h2>
          <div class="summary-list">
            ${order.items
              .map(
                (it) => `<div class="summary-row"><span>${escapeHtml(it.name)}<br><small class="muted">${escapeHtml(it.size || "—")} · ${escapeHtml(it.color || "—")} · ${it.quantity}×</small></span><strong>${formatPrice(it.unitPrice * it.quantity)}</strong></div>`
              )
              .join("")}
          </div>
          <div class="summary-total">
            <div class="summary-row"><span>Subtotal</span><span>${formatPrice(order.subtotal)}</span></div>
            <div class="summary-row"><span>Ongkir (${escapeHtml(order.shippingService)})</span><span>${formatPrice(order.shippingFee)}</span></div>
            <div class="summary-row summary-row--total"><span>Total</span><strong>${formatPrice(order.total)}</strong></div>
          </div>
        </section>

        ${paymentPanel}
      </div>
      </div>

      <div class="col-12 col-lg-4">
      <aside class="stack">
        <section class="panel">
          <h2 class="panel__title">Alamat Pengiriman</h2>
          <p><strong>${escapeHtml(order.recipient.name)}</strong><br>${escapeHtml(order.recipient.phone)}</p>
          <p class="muted">${escapeHtml(order.recipient.address)}<br>${escapeHtml(order.recipient.city)} ${escapeHtml(order.recipient.postal || "")}</p>
          <hr>
          <p><strong>Kurir:</strong> ${escapeHtml(order.courierName || "Belum ditentukan")}</p>
          <p><strong>Resi:</strong> ${escapeHtml(order.trackingNumber || "Belum tersedia")}</p>
          ${order.type === "custom" && order.customRequestId ? `<p class="mt-s"><a class="link" href="${baseUrl("custom/status.php")}">Lihat Custom Request</a></p>` : ""}
          ${order.status === "shipped" ? `<button class="btn btn--outline btn--sm mt-s" id="mark-completed" data-id="${escapeHtml(order.id)}">Saya Sudah Menerima</button>` : ""}
        </section>

        <section class="panel">
          <h2 class="panel__title">Riwayat Status</h2>
          <ol class="timeline">
            ${(order.history || [])
              .slice()
              .reverse()
              .map(
                (h) => `<li><span class="timeline__dot"></span><div><strong>${escapeHtml((MerchData.statusLabels.order || {})[h.status] || h.status)}</strong><p>${escapeHtml(h.note || "")}</p><small class="muted">${formatDate(h.at)}</small></div></li>`
              )
              .join("")}
          </ol>
        </section>
      </aside>
      </div>
    </div>`;

  const proofInput = $("#proof-file");
  const preview = $("#proof-preview");
  const submitProof = $("#submit-proof");
  let proofData = null;

  if (proofInput) {
    bind(proofInput, "change", async () => {
      const file = proofInput.files[0];
      if (!file) return;
      try {
        proofData = await compressImage(file, 900, 0.7);
        const img = preview.querySelector("img");
        img.src = proofData;
        preview.hidden = false;
        submitProof.disabled = false;
      } catch (err) {
        toast(err.message || "File tidak valid.", "error");
        proofInput.value = "";
        submitProof.disabled = true;
      }
    });
  }

  const proofForm = $("#proof-form");
  if (proofForm) {
    bind(proofForm, "submit", (e) => {
      e.preventDefault();
      if (!proofData) {
        toast("Unggah bukti pembayaran terlebih dahulu.", "error");
        return;
      }
      const now = new Date().toISOString();
      const orders = Store.orders();
      const current = orders.find((o) => o.id === order.id);
      if (!current) return;
      current.payment.proof = proofData;
      current.payment.proofName = proofInput.files[0] ? proofInput.files[0].name : "bukti.jpg";
      current.payment.status = "pending_verification";
      current.payment.submittedAt = now;
      current.payment.rejectionNote = "";
      current.payment.amount = current.total;
      current.paymentStatus = "pending_verification";
      current.status = "payment_review";
      current.updatedAt = now;
      current.history.push({ status: "payment_review", note: "Bukti pembayaran simulasi dikirim pembeli.", at: now });
      Store.saveOrders(orders);
      toast("Bukti pembayaran terkirim. Menunggu verifikasi admin.");
      setTimeout(() => location.reload(), 700);
    });
  }

  const markBtn = $("#mark-completed");
  if (markBtn) {
    bind(markBtn, "click", () => {
      if (!confirm("Tandai pesanan ini sebagai selesai diterima?")) return;
      const orders = Store.orders();
      const current = orders.find((o) => o.id === order.id);
      if (!current) return;
      const now = new Date().toISOString();
      current.status = "completed";
      current.updatedAt = now;
      current.history.push({ status: "completed", note: "Pembeli menandai pesanan selesai diterima.", at: now });
      Store.saveOrders(orders);
      toast("Pesanan ditandai selesai.");
      setTimeout(() => location.reload(), 500);
    });
  }
}

/* ---------- Custom Studio ---------- */
function initCustomStudio() {
  const productSelect = $("#custom-product");
  if (!productSelect) return;

  const sizeWrap = $("#size-chips");
  const colorWrap = $("#color-chips");
  const qtyInput = $("#custom-qty");
  const notesInput = $("#custom-notes");
  const designInput = $("#design-file");
  const previewArt = $("#mockup-art");
  const previewEmpty = $("#mockup-empty");
  const mockupBase = $("#mockup-base");
  const estimateEl = $("#custom-estimate");
  const variantInfo = $("#custom-variant-info");
  const submitBtn = $("#submit-custom");
  const loginNotice = $("#studio-login-notice");

  let selectedProductId = "";
  let selectedVariant = null;
  let designData = null;
  let designName = "";

  const products = Store.customProducts();
  if (!products.length) {
    productSelect.innerHTML = '<option value="">Tidak ada produk custom aktif</option>';
    submitBtn.disabled = true;
    return;
  }

  productSelect.innerHTML = products
    .map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)} — ${formatPrice(p.price)}</option>`)
    .join("");
  selectedProductId = products[0].id;

  if (loginNotice) loginNotice.hidden = !!Auth.user;

  function product() {
    return Store.getProduct(selectedProductId);
  }

  function unitPrice() {
    if (!product()) return 0;
    return product().price + (selectedVariant ? selectedVariant.price_adjustment || 0 : 0);
  }

  function renderChips() {
    const p = product();
    if (!p) return;
    const variants = p.variants.filter((v) => v.active !== false);
    const sizes = [...new Set(variants.map((v) => v.size))];
    const colors = [...new Set(variants.map((v) => v.color))];

    const currentSize = selectedVariant ? selectedVariant.size : sizes[0];
    sizeWrap.innerHTML = sizes
      .map((size) => `<button type="button" class="filter-chip ${size === currentSize ? "active" : ""}" data-size="${escapeHtml(size)}">${escapeHtml(size)}</button>`)
      .join("");

    const availableColors = variants.filter((v) => v.size === currentSize).map((v) => v.color);
    const currentColor = selectedVariant && availableColors.includes(selectedVariant.color) ? selectedVariant.color : availableColors[0];
    colorWrap.innerHTML = colors
      .map(
        (color) =>
          `<button type="button" class="filter-chip ${color === currentColor ? "active" : ""} ${availableColors.includes(color) ? "" : "is-disabled"}" data-color="${escapeHtml(color)}" ${availableColors.includes(color) ? "" : "disabled"}>${escapeHtml(color)}</button>`
      )
      .join("");

    selectedVariant = variants.find((v) => v.size === currentSize && v.color === currentColor) || variants[0];
    updateVariantInfo();
  }

  function updateVariantInfo() {
    const p = product();
    if (!p || !selectedVariant) return;
    if (variantInfo) {
      variantInfo.textContent = `Varian terpilih: ${selectedVariant.size} · ${selectedVariant.color} — stok ${selectedVariant.stock} unit (${selectedVariant.sku})`;
    }
    if (qtyInput) {
      qtyInput.max = Math.max(1, selectedVariant.stock);
      if (parseInt(qtyInput.value, 10) > selectedVariant.stock) qtyInput.value = selectedVariant.stock;
    }
    if (mockupBase) mockupBase.src = imageUrl(p.cover);
    updateEstimate();
  }

  function updateEstimate() {
    const p = product();
    if (!p) return;
    const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    const basePrice = p.price + (selectedVariant ? selectedVariant.price_adjustment || 0 : 0);
    const perUnit = basePrice + MerchData.customPrintFee;
    estimateEl.innerHTML = `
      <div><span>Estimasi per unit</span><strong>${formatPrice(perUnit)}</strong></div>
      <div><span>Total estimasi (${qty} unit, belum termasuk ongkir)</span><strong>${formatPrice(perUnit * qty)}</strong></div>
      <div><span class="muted" style="font-size: 0.8125rem">Dasar ${formatPrice(basePrice)} + biaya cetak ${formatPrice(MerchData.customPrintFee)} per unit</span></div>`;
  }

  bind(productSelect, "change", () => {
    selectedProductId = productSelect.value;
    selectedVariant = null;
    renderChips();
    studioSetStep(2);
  });

  bind(sizeWrap, "click", (e) => {
    const chip = e.target.closest("[data-size]");
    if (!chip) return;
    const p = product();
    const variant = p.variants.find((v) => v.size === chip.dataset.size && v.active !== false);
    if (!variant) return;
    selectedVariant = variant;
    renderChips();
  });

  bind(colorWrap, "click", (e) => {
    const chip = e.target.closest("[data-color]");
    if (!chip || chip.disabled) return;
    const p = product();
    const variant = p.variants.find(
      (v) => v.size === selectedVariant.size && v.color === chip.dataset.color && v.active !== false
    );
    if (!variant) return;
    selectedVariant = variant;
    renderChips();
  });

  bind(qtyInput, "input", updateEstimate);
  bind(qtyInput, "change", updateEstimate);

  async function handleDesignFile(file) {
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      toast("Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.", "error");
      return;
    }
    try {
      designData = await compressImage(file, 1400, 0.82);
      designName = file.name;
      showDesignSelected(file.name, designData);
      previewArt.src = designData;
      previewArt.hidden = false;
      previewEmpty.hidden = true;
      toast("Desain berhasil dimuat. Periksa preview mockup.");
      studioSetStep(3);
    } catch (err) {
      designData = null;
      designName = "";
      showDesignEmpty();
      previewArt.hidden = true;
      previewEmpty.hidden = false;
      designInput.value = "";
      toast(err.message || "File desain tidak valid.", "error");
    }
  }

  /* Stepper studio: 1 pilih produk → 2 unggah desain → 3 kirim ditinjau → 4 penawaran & bayar. */
  const studioStepperEl = $("#studio-stepper");
  let studioStepCur = 1;
  function studioSetStep(k) {
    if (k < studioStepCur || !studioStepperEl) return;
    studioStepCur = k;
    $$(".studio-stepper__step", studioStepperEl).forEach((el, i) => {
      const n = i + 1;
      el.classList.toggle("studio-stepper__step--done", n < k);
      el.classList.toggle("studio-stepper__step--active", n === k);
    });
  }

  function showDesignSelected(name, dataUrl) {
    const target = $("#design-drop-target");
    const selected = $("#design-selected");
    const nameEl = $("#design-name");
    const thumb = $("#design-thumbnail");
    if (target) target.hidden = true;
    if (selected) selected.hidden = false;
    if (nameEl) nameEl.textContent = name;
    if (thumb && dataUrl) { thumb.src = dataUrl; thumb.hidden = false; }
  }

  function showDesignEmpty() {
    const target = $("#design-drop-target");
    const selected = $("#design-selected");
    const thumb = $("#design-thumbnail");
    if (target) target.hidden = false;
    if (selected) selected.hidden = true;
    if (thumb) { thumb.src = ""; thumb.hidden = true; }
  }

  bind(designInput, "change", () => {
    handleDesignFile(designInput.files[0]);
  });

  /* Kotak unggah: bisa Pakai papan kunci (Enter/Spasi) serta seret-lempar file. */
  const dropTarget = $("#design-drop-target");
  const dropZone = $("#design-drop");
  if (dropTarget) {
    bind(dropTarget, "click", () => designInput.click());
    bind(dropTarget, "keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        designInput.click();
      }
    });
  }
  if (dropZone) {
    ["dragenter", "dragover"].forEach((evt) => {
      bind(dropZone, evt, (e) => {
        e.preventDefault();
        dropZone.classList.add("is-dragover");
      });
    });
    ["dragleave", "drop"].forEach((evt) => {
      bind(dropZone, evt, (e) => {
        e.preventDefault();
        dropZone.classList.remove("is-dragover");
      });
    });
    bind(dropZone, "drop", (e) => {
      handleDesignFile(e.dataTransfer.files[0]);
    });
  }

  const replaceBtn = $("#design-replace");
  if (replaceBtn) {
    bind(replaceBtn, "click", () => {
      designInput.value = "";
      designData = null;
      designName = "";
      showDesignEmpty();
      previewArt.hidden = true;
      previewEmpty.hidden = false;
    });
  }

  bind(submitBtn, "click", () => {
    if (!Auth.user) {
      location.href = baseUrl("login.php?next=" + encodeURIComponent("custom/studio.php"));
      return;
    }
    if (!designData) {
      toast("Unggah berkas desain terlebih dahulu.", "error");
      designInput.focus();
      return;
    }
    const p = product();
    if (!selectedVariant || selectedVariant.stock < 1) {
      toast("Varian terpilih tidak tersedia.", "error");
      return;
    }
    const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    if (qty > selectedVariant.stock) {
      toast("Jumlah melebihi stok yang tersedia.", "error");
      return;
    }

    const requests = Store.requests();
    const now = new Date().toISOString();
    const request = {
      id: uid("cr"),
      code: orderCode("CR"),
      userId: Auth.user.id,
      productId: p.id,
      productName: p.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      quantity: qty,
      notes: notesInput.value.trim(),
      designData: designData,
      designName: designName,
      status: "submitted",
      quotedUnitPrice: 0,
      adminNote: "",
      createdAt: now,
      updatedAt: now,
    };
    requests.unshift(request);
    Store.saveRequests(requests);
    toast("Permintaan custom dikirim. Menunggu tinjauan admin.");
    studioSetStep(4);
    setTimeout(() => (location.href = baseUrl("custom/status.php?created=1")), 600);
  });

  renderChips();
}

/* ---------- Custom status ---------- */
/* Status custom request: melihat penawaran harga admin, menerima/menolak
   penawaran, dan mengunggah ulang desain revisi. */
function initCustomStatus() {
  const root = $("#custom-request-list");
  if (!root) return;
  if (!Auth.requireRole("buyer")) return;

  const requests = Store.requestsFor(Auth.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const created = new URLSearchParams(location.search).get("created") === "1";
  const alertEl = $("#custom-status-alert");

  if (created && alertEl) {
    alertEl.hidden = false;
    alertEl.textContent = "Permintaan custom berhasil dikirim. Admin akan meninjau desain lalu menetapkan harga final.";
  }

  if (!requests.length) {
    root.innerHTML = emptyState(
      "palette",
      "Belum ada permintaan custom",
      "Mulai dari Custom Studio: pilih produk, unggah desain, lalu kirim untuk ditinjau admin.",
      `<a href="${baseUrl("custom/studio.php")}" class="btn btn--primary mt-m">Buka Custom Studio</a>`
    );
    return;
  }

  function render() {
    root.innerHTML = requests
      .map((r) => {
        const linkedOrder = Store.orders().find((o) => o.customRequestId === r.id);
        const preview = r.designData
          ? `<img src="${r.designData}" alt="Desain ${escapeHtml(r.designName || r.code)}">`
          : `<div class="design-placeholder">${icon("palette", "icon")}<span>${escapeHtml(r.designName || "Desain tersimpan")}</span></div>`;

        let actionHtml = "";
        if (r.status === "approved") {
          actionHtml = `
            <div class="request-action">
              <p class="request-price">Harga final: <strong>${formatPrice(r.quotedUnitPrice)}</strong> / unit · Total ${formatPrice(r.quotedUnitPrice * r.quantity)} (belum ongkir)</p>
              <div class="form-group">
                <label for="rate-${escapeHtml(r.id)}">Pilih pengiriman</label>
                <select id="rate-${escapeHtml(r.id)}" class="form-control" data-request-rate="${escapeHtml(r.id)}">
                  ${Store.activeShippingRates()
                    .map((rate) => `<option value="${escapeHtml(rate.id)}">${escapeHtml(rate.area)} — ${escapeHtml(rate.service)} (${formatPrice(rate.fee)})</option>`)
                    .join("")}
                </select>
              </div>
              <div class="d-flex gap-s flex-wrap">
                <button type="button" class="btn btn--primary btn--sm" data-accept="${escapeHtml(r.id)}">Terima Penawaran &amp; Bayar</button>
                <button type="button" class="btn btn--outline btn--sm" data-decline="${escapeHtml(r.id)}">Tolak Penawaran</button>
              </div>
            </div>`;
        } else if (r.status === "revision_requested") {
          actionHtml = `
            <div class="request-action">
              <p class="form-hint">Unggah desain baru untuk request yang sama, lalu kirim ulang.</p>
              <input type="file" class="file-input" accept="image/jpeg,image/png,image/webp" data-revision-file="${escapeHtml(r.id)}">
              <button type="button" class="btn btn--primary btn--sm mt-s" data-revision-submit="${escapeHtml(r.id)}" disabled>Kirim Ulang Desain</button>
            </div>`;
        } else if (r.status === "ordered" && linkedOrder) {
          actionHtml = `<div class="request-action"><a class="btn btn--primary btn--sm" href="${baseUrl(`orders/detail.php?id=${encodeURIComponent(linkedOrder.id)}`)}">Lihat Pesanan ${escapeHtml(linkedOrder.code)}</a></div>`;
        } else if (r.status === "rejected") {
          actionHtml = `<div class="request-action"><a class="btn btn--outline btn--sm" href="${baseUrl("custom/studio.php")}">Buat Permintaan Baru</a></div>`;
        }

        return `
          <article class="request-card card">
            <div class="request-card__preview">${preview}</div>
            <div class="request-card__body">
              <div class="request-card__head">
                <div>
                  <p class="eyebrow">${escapeHtml(r.code)}</p>
                  <h3>${escapeHtml(r.productName)}</h3>
                  <p class="muted">${escapeHtml(r.size)} · ${escapeHtml(r.color)} · ${r.quantity} unit · ${formatDate(r.createdAt)}</p>
                </div>
                ${statusBadge("custom", r.status)}
              </div>
              ${r.notes ? `<p class="request-note"><strong>Catatan Anda:</strong> ${escapeHtml(r.notes)}</p>` : ""}
              ${r.adminNote ? `<div class="alert alert--info"><strong>Catatan admin:</strong> ${escapeHtml(r.adminNote)}</div>` : ""}
              ${actionHtml}
            </div>
          </article>`;
      })
      .join("");
  }

  bind(root, "click", (e) => {
    const acceptBtn = e.target.closest("[data-accept]");
    if (acceptBtn) {
      const id = acceptBtn.dataset.accept;
      const request = Store.findRequest(id);
      const select = root.querySelector(`[data-request-rate="${id}"]`);
      const rate = select ? Store.findShippingRate(select.value) : null;
      if (!request || !rate) {
        toast("Pilih tarif pengiriman terlebih dahulu.", "error");
        return;
      }
      if (!confirm("Terima penawaran ini dan lanjut ke checkout pembayaran penuh?")) return;
      location.href = baseUrl(
        `checkout/index.php?custom=${encodeURIComponent(request.id)}&rate=${encodeURIComponent(rate.id)}`
      );
      return;
    }

    const declineBtn = e.target.closest("[data-decline]");
    if (declineBtn) {
      if (!confirm("Tolak penawaran harga ini? Request tidak akan diproses.")) return;
      Store.updateRequest(declineBtn.dataset.decline, {
        status: "rejected",
        adminNote: "Pembeli menolak penawaran harga final.",
      });
      toast("Penawaran ditolak.");
      location.reload();
      return;
    }

    const revisionBtn = e.target.closest("[data-revision-submit]");
    if (revisionBtn && !revisionBtn.disabled) {
      const id = revisionBtn.dataset.revisionSubmit;
      const input = root.querySelector(`[data-revision-file="${id}"]`);
      if (!input || !input.files[0]) return;
      compressImage(input.files[0], 1400, 0.82)
        .then((data) => {
          Store.updateRequest(id, {
            designData: data,
            designName: input.files[0].name,
            status: "submitted",
          });
          toast("Desain revisi terkirim. Menunggu tinjauan ulang admin.");
          setTimeout(() => location.reload(), 600);
        })
        .catch((err) => toast(err.message, "error"));
    }
  });

  bind(root, "change", (e) => {
    const input = e.target.closest("[data-revision-file]");
    if (!input) return;
    const btn = root.querySelector(`[data-revision-submit="${input.dataset.revisionFile}"]`);
    if (btn) btn.disabled = !input.files.length;
  });

  render();
}

/* ---------- Auth forms ---------- */
/* Formulir masuk dan daftar, termasuk tombol isi otomatis akun demo untuk
   mempercepat pengujian prototype. */
function initAuthForms() {
  const $login = jQuery("#login-form");
  if ($login.length) {
    const $error = jQuery("#login-error");
    jQuery("[data-demo-login]").on("click", function () {
      const admin = jQuery(this).data("demoLogin") === "admin";
      jQuery("#login-email").val(admin ? "admin@merchverse.test" : "buyer@merchverse.test");
      jQuery("#login-password").val(admin ? "admin123" : "buyer123");
    });

    $login.on("submit", (e) => {
      e.preventDefault();
      const user = Auth.login(jQuery("#login-email").val().trim(), jQuery("#login-password").val());
      if (!user) {
        $error.prop("hidden", false).text("Email atau password salah. Gunakan akun demo di bawah bila perlu.");
        return;
      }
      const next = new URLSearchParams(location.search).get("next");
      const dest = next
        ? baseUrl(next)
        : user.role === "admin"
        ? baseUrl("admin/dashboard.php")
        : baseUrl("index.php");
      toast(`Selamat datang, ${user.name}.`);
      setTimeout(() => (location.href = dest), 400);
    });
  }

  const $register = jQuery("#register-form");
  if ($register.length) {
    $register.on("submit", (e) => {
      e.preventDefault();
      const $error = jQuery("#register-error");
      const name = jQuery("#register-name").val().trim();
      const email = jQuery("#register-email").val().trim();
      const password = jQuery("#register-password").val();
      const confirm = jQuery("#register-confirm").val();
      const errors = [];
      if (name.length < 2) errors.push("Nama minimal 2 karakter.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Format email tidak valid.");
      if (password.length < 6) errors.push("Password minimal 6 karakter.");
      if (password !== confirm) errors.push("Konfirmasi password tidak sama.");
      if (Store.users().some((u) => u.email.toLowerCase() === email.toLowerCase()))
        errors.push("Email sudah terdaftar. Silakan masuk.");

      if (errors.length) {
        $error.prop("hidden", false).html(errors.map((er) => `<div>${escapeHtml(er)}</div>`).join(""));
        return;
      }
      const user = Auth.register(name, email, password);
      if (!user) {
        toast("Registrasi gagal. Coba email lain.", "error");
        return;
      }
      toast("Akun berhasil dibuat. Selamat berbelanja!");
      setTimeout(() => (location.href = baseUrl("index.php")), 500);
    });
  }
}

/* ---------- Promosi produk dasar custom di beranda ---------- */
/* Mengisi kotak produk dasar (kaos/hoodie) di blok promosiCustom merch. Nama
   dan harga dasar diambil dari data.js (customPrintFee + product_type "custom_base"), tidak ditulis manual. */
function initCustomPromo() {
  const grid = $("#custom-base-grid");
  if (!grid) return;
  const products = Store.customProducts();
  if (!products.length) {
    grid.hidden = true;
    return;
  }
  grid.innerHTML = products
    .map((p) => {
      const unit = formatPrice(p.price);
      const fee = formatPrice(MerchData.customPrintFee);
      return `
        <article class="base-option">
          <div class="base-option__thumb"><img src="${imageUrl(p.cover)}" alt="${escapeHtml(p.name)}"></div>
          <div>
            <strong>${escapeHtml(p.name)}</strong>
            <span class="base-option__price">${unit} <small style="opacity: 0.8">· biaya cetak ${fee}</small></span>
          </div>
        </article>`;
    })
    .join("");
}

/* ---------- Global bindings ---------- */
bind(document, "click", (e) => {
  if (e.target.closest("[data-close-modal]")) closeModal();
});
bind(document, "mv:cart-changed", () => {
  const el = $("#cart-count");
  if (el) el.textContent = Cart.count();
});

/* ---------- Init ---------- */
/* Pemicu global (tutup modal, tombol Escape) dan inisialisasi semua modul saat
   DOM siap: autentikasi, keranjang, dan setiap halaman yang aktif. */
jQuery(() => {
  Store.ensureSeed();
  Auth.load();
  Cart.load();

  initHeader();
  initHome();
  initCatalog();
  initProductDetail();
  initCartPage();
  initCheckout();
  initOrdersPage();
  initOrderDetail();
  initCustomStudio();
  initCustomStatus();
  initCustomPromo();
  initAuthForms();

  Cart.dispatch();
});
