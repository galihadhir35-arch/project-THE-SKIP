/* ==========================================================================
   MerchVerse — Admin prototype
   Mengelola produk, pesanan, custom request, pembayaran simulasi, dan ongkir.
   Data disimpan di localStorage (simulasi backend). jQuery dipakai untuk
   interaksi modal/tabel pada panel admin.
   ========================================================================== */

/* Guard: halaman admin hanya untuk role admin (simulasi sisi klien). */
(function guardAdmin() {
  if (typeof Auth === "undefined") return;
  Store.ensureSeed();
  Auth.load();
  if (!Auth.user) {
    const next = location.pathname.replace(MV_BASE, "") + location.search;
    location.replace(baseUrl("login.php?next=" + encodeURIComponent(next)));
    return;
  }
  if (!Auth.isAdmin()) {
    alert("Akses admin ditolak. Silakan masuk dengan akun admin demo.");
    location.replace(baseUrl("index.php"));
  }
})();

/* Helper admin: ambil nama pengguna dari ID (digunakan signatur antrean). */
function adminUserName(userId) {
  const user = Store.users().find((u) => u.id === userId);
  return user ? user.name : "Pengguna";
}

function adminTableEmpty(cols, message) {
  return `<tr><td colspan="${cols}" class="table-empty">${escapeHtml(message)}</td></tr>`;
}

function updateAdminBadges() {
  const counts = {
    payments: Store.orders().filter((o) => o.paymentStatus === "pending_verification").length,
    custom: Store.requests().filter((r) => ["submitted", "under_review"].includes(r.status)).length,
    orders: Store.orders().filter((o) => !["completed", "cancelled"].includes(o.status)).length,
  };
  document.querySelectorAll("[data-admin-badge]").forEach((el) => {
    const count = counts[el.dataset.adminBadge] || 0;
    el.textContent = count;
    el.hidden = count === 0;
  });
}

/* ---------- Dashboard ---------- */
/* Statistik admin: jumlah pesanan, pendapatan, pembayaran menunggu verifikasi,
   custom request menunggu, dan jumlah produk. */
function initAdminDashboard() {
  const root = $("#admin-dashboard");
  if (!root) return;

  const orders = Store.orders();
  const requests = Store.requests();
  const products = Store.allProducts();
  const revenue = orders
    .filter((o) => o.paymentStatus === "verified")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const stats = {
    orders: orders.length,
    revenue: formatPrice(revenue),
    pendingPayments: orders.filter((o) => o.paymentStatus === "pending_verification").length,
    pendingCustom: requests.filter((r) => ["submitted", "under_review"].includes(r.status)).length,
    products: products.length,
  };

  $("#stat-orders") && ($("#stat-orders").textContent = stats.orders);
  $("#stat-revenue") && ($("#stat-revenue").textContent = stats.revenue);
  $("#stat-pending-payments") && ($("#stat-pending-payments").textContent = stats.pendingPayments);
  $("#stat-pending-custom") && ($("#stat-pending-custom").textContent = stats.pendingCustom);
  $("#stat-products") && ($("#stat-products").textContent = stats.products);

  const recent = orders
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const recentBody = $("#admin-recent-orders");
  if (recentBody) {
    recentBody.innerHTML = recent.length
      ? recent
          .map(
            (o) => `
            <tr>
              <td><strong>${escapeHtml(o.code)}</strong><br><small class="muted">${adminUserName(o.userId)}</small></td>
              <td>${o.type === "custom" ? "Custom" : "Reguler"}</td>
              <td>${formatPrice(o.total)}</td>
              <td>${statusBadge("payment", o.paymentStatus)}</td>
              <td>${statusBadge("order", o.status)}</td>
              <td><a class="link" href="${baseUrl(`admin/orders.php?highlight=${encodeURIComponent(o.id)}`)}">Kelola</a></td>
            </tr>`
          )
          .join("")
      : adminTableEmpty(6, "Belum ada pesanan.");
  }

  const queue = $("#admin-queue");
  if (queue) {
    const pendingCustom = requests.filter((r) => ["submitted", "under_review"].includes(r.status));
    const pendingPayments = orders.filter((o) => o.paymentStatus === "pending_verification");
    const rows = [];

    pendingCustom.forEach((r) => {
      rows.push(`
        <div class="queue-item">
          <div>
            <strong>${escapeHtml(r.code)} — ${escapeHtml(r.productName)}</strong>
            <p class="muted">${adminUserName(r.userId)} · ${r.quantity} unit · ${formatDateShort(r.createdAt)}</p>
          </div>
          <div class="d-flex gap-s align-center">
            ${statusBadge("custom", r.status)}
            <a class="btn btn--primary btn--sm" href="${baseUrl("admin/custom-requests.php")}">Tinjau</a>
          </div>
        </div>`);
    });

    pendingPayments.forEach((o) => {
      rows.push(`
        <div class="queue-item">
          <div>
            <strong>${escapeHtml(o.code)} — ${formatPrice(o.total)}</strong>
            <p class="muted">Bukti pembayaran dari ${adminUserName(o.userId)} menunggu verifikasi.</p>
          </div>
          <div class="d-flex gap-s align-center">
            ${statusBadge("payment", o.paymentStatus)}
            <a class="btn btn--primary btn--sm" href="${baseUrl("admin/payments.php")}">Verifikasi</a>
          </div>
        </div>`);
    });

    queue.innerHTML = rows.length ? rows.join("") : `<p class="muted">Tidak ada item yang menunggu tindakan.</p>`;
  }
}

/* ---------- Products ---------- */
/* formulir tambah/edit produk dalam modal admin (nama, kategori, tipe, harga,
   gambar, deskripsi, dan daftar varian & stok). */
function productFormHtml(product) {
  const isNew = !product;
  const p = product || {
    id: "",
    name: "",
    category: "apparel",
    product_type: "official",
    price: 0,
    description: "",
    cover: "images/products/tshirt-classic.svg",
    active: true,
    featured: false,
    variants: [{ id: uid("v"), sku: "", size: "—", color: "—", price_adjustment: 0, stock: 0, active: true }],
  };

  const variantRows = p.variants
    .map(
      (v) => `
        <tr>
          <td><input class="form-control form-control--sm" data-variant-field="sku" data-variant-id="${escapeHtml(v.id)}" value="${escapeHtml(v.sku)}"></td>
          <td><input class="form-control form-control--sm" data-variant-field="size" data-variant-id="${escapeHtml(v.id)}" value="${escapeHtml(v.size)}"></td>
          <td><input class="form-control form-control--sm" data-variant-field="color" data-variant-id="${escapeHtml(v.id)}" value="${escapeHtml(v.color)}"></td>
          <td><input type="number" min="0" class="form-control form-control--sm" data-variant-field="stock" data-variant-id="${escapeHtml(v.id)}" value="${v.stock}"></td>
          <td><input type="number" min="0" step="1000" class="form-control form-control--sm" data-variant-field="price_adjustment" data-variant-id="${escapeHtml(v.id)}" value="${v.price_adjustment || 0}"></td>
        </tr>`
    )
    .join("");

  return `
    <h2 class="modal__title">${isNew ? "Tambah Produk" : "Ubah Produk"}</h2>
    <form id="product-form" data-product-id="${escapeHtml(p.id)}">
      <div class="form-group">
        <label for="pf-name">Nama produk</label>
        <input id="pf-name" class="form-control" value="${escapeHtml(p.name)}" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="pf-category">Kategori</label>
          <select id="pf-category" class="form-control">
            ${["apparel", "accessories", "collectibles"].map((c) => `<option value="${c}" ${p.category === c ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label for="pf-type">Tipe</label>
          <select id="pf-type" class="form-control">
            <option value="official" ${p.product_type === "official" ? "selected" : ""}>Resmi</option>
            <option value="custom_base" ${p.product_type === "custom_base" ? "selected" : ""}>Dasar Custom</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="pf-price">Harga dasar (Rp)</label>
          <input id="pf-price" type="number" min="0" step="1000" class="form-control" value="${p.price}" required>
        </div>
        <div class="form-group">
          <label for="pf-featured">Unggulan</label>
          <select id="pf-featured" class="form-control">
            <option value="0" ${!p.featured ? "selected" : ""}>Tidak</option>
            <option value="1" ${p.featured ? "selected" : ""}>Ya</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label for="pf-cover">Path gambar</label>
        <input id="pf-cover" class="form-control" value="${escapeHtml(p.cover)}">
        <p class="form-hint">Contoh: images/products/tshirt-classic.svg</p>
      </div>
      <div class="form-group">
        <label for="pf-description">Deskripsi</label>
        <textarea id="pf-description" class="form-control" rows="3">${escapeHtml(p.description)}</textarea>
      </div>
      <div class="form-group">
        <label>Varian &amp; stok</label>
        <div class="table-wrap">
          <table class="table-compact">
            <thead><tr><th>SKU</th><th>Ukuran</th><th>Warna</th><th>Stok</th><th>+Harga</th></tr></thead>
            <tbody>${variantRows}</tbody>
          </table>
        </div>
        <button type="button" class="btn btn--outline btn--sm mt-s" id="add-variant-btn">+ Tambah Varian</button>
      </div>
      <div class="form-group">
        <label for="pf-active">Status</label>
        <select id="pf-active" class="form-control">
          <option value="1" ${p.active !== false ? "selected" : ""}>Aktif</option>
          <option value="0" ${p.active === false ? "selected" : ""}>Nonaktif</option>
        </select>
      </div>
      <div class="modal__actions">
        <button type="button" class="btn btn--outline" data-close-modal>Batal</button>
        <button type="submit" class="btn btn--primary">Simpan Produk</button>
      </div>
    </form>`;
}

function openProductModal(product) {
  openModal(productFormHtml(product));
  const form = $("#product-form");
  const existing = product ? JSON.parse(JSON.stringify(product)) : null;

  jQuery("#add-variant-btn").on("click", () => {
    const variant = { id: uid("v"), sku: "", size: "—", color: "—", price_adjustment: 0, stock: 0, active: true };
    if (existing) existing.variants.push(variant);
    else if (form._draft) form._draft.variants.push(variant);
    else form._draft = { variants: [variant] };
    const tbody = jQuery("#product-form tbody")[0];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input class="form-control form-control--sm" data-variant-field="sku" data-variant-id="${variant.id}" value=""></td>
      <td><input class="form-control form-control--sm" data-variant-field="size" data-variant-id="${variant.id}" value="—"></td>
      <td><input class="form-control form-control--sm" data-variant-field="color" data-variant-id="${variant.id}" value="—"></td>
      <td><input type="number" min="0" class="form-control form-control--sm" data-variant-field="stock" data-variant-id="${variant.id}" value="0"></td>
      <td><input type="number" min="0" step="1000" class="form-control form-control--sm" data-variant-field="price_adjustment" data-variant-id="${variant.id}" value="0"></td>`;
    tbody.appendChild(tr);
  });

  jQuery(form).on("submit", (e) => {
    e.preventDefault();
    const base = existing || {
      id: uid("p"),
      name: "",
      slug: "",
      category: "apparel",
      product_type: "official",
      description: "",
      cover: "",
      images: [],
      in_stock: true,
      featured: false,
      active: true,
      variants: [],
    };
    const productData = JSON.parse(JSON.stringify(base));
    productData.name = $("#pf-name").value.trim();
    productData.category = $("#pf-category").value;
    productData.product_type = $("#pf-type").value;
    productData.price = Number($("#pf-price").value) || 0;
    productData.featured = $("#pf-featured").value === "1";
    productData.cover = $("#pf-cover").value.trim() || "images/products/tshirt-classic.svg";
    productData.images = [productData.cover];
    productData.description = $("#pf-description").value.trim();
    productData.active = $("#pf-active").value === "1";
    productData.in_stock = true;
    productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const variantMap = new Map();
    $$("#product-form [data-variant-field]").forEach((input) => {
      const id = input.dataset.variantId;
      if (!variantMap.has(id)) {
        const old = (base.variants || []).find((v) => v.id === id) || { id, active: true };
        variantMap.set(id, { ...old });
      }
      const field = input.dataset.variantField;
      variantMap.get(id)[field] = field === "stock" || field === "price_adjustment" ? Number(input.value) || 0 : input.value.trim();
    });
    productData.variants = Array.from(variantMap.values());
    if (!productData.variants.length) {
      toast("Minimal satu varian diperlukan.", "error");
      return;
    }

    if (!productData.name) {
      toast("Nama produk wajib diisi.", "error");
      return;
    }

    Store.saveProduct(productData);
    closeModal();
    toast("Produk tersimpan.");
    setTimeout(() => location.reload(), 400);
  });
}

function initAdminProducts() {
  const body = $("#admin-products-body");
  if (!body) return;

  const search = $("#admin-product-search");

  function render() {
    const term = (search ? search.value : "").trim().toLowerCase();
    let products = Store.allProducts().sort((a, b) => a.name.localeCompare(b.name));
    if (term) {
      products = products.filter((p) =>
        [p.name, p.slug, p.category, p.product_type === "custom_base" ? "custom base" : "official"]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    }
    body.innerHTML = products.length
      ? products
          .map(
            (p) => `
            <tr class="${p.active === false ? "row-muted" : ""}">
              <td><img class="table-thumb" src="${imageUrl(p.cover)}" alt="${escapeHtml(p.name)}"></td>
              <td><strong>${escapeHtml(p.name)}</strong><br><small class="muted">${escapeHtml(p.slug)}</small></td>
              <td>${escapeHtml(p.category)}</td>
              <td>${p.product_type === "custom_base" ? "Custom Base" : "Official"}</td>
              <td>${formatPrice(p.price)}</td>
              <td>${getStock(p)}</td>
              <td>${p.active === false ? '<span class="badge badge--critical">Nonaktif</span>' : '<span class="badge badge--success">Aktif</span>'}</td>
              <td class="table-actions">
                <button type="button" class="btn btn--outline btn--sm" data-edit="${escapeHtml(p.id)}">Ubah</button>
                <button type="button" class="btn btn--outline btn--sm ${p.active === false ? "" : "text-critical"}" data-toggle="${escapeHtml(p.id)}">${p.active === false ? "Aktifkan" : "Nonaktifkan"}</button>
              </td>
            </tr>`
          )
          .join("")
      : adminTableEmpty(8, term ? "Tidak ada produk yang cocok dengan pencarian." : "Belum ada produk.");
  }

  jQuery("#btn-add-product").on("click", () => openProductModal(null));
  if (search) jQuery(search).on("input", render);

  jQuery(body).on("click", (e) => {
    const editBtn = e.target.closest("[data-edit]");
    if (editBtn) {
      openProductModal(Store.getProduct(editBtn.dataset.edit));
      return;
    }
    const toggleBtn = e.target.closest("[data-toggle]");
    if (toggleBtn) {
      const product = Store.getProduct(toggleBtn.dataset.toggle);
      if (!product) return;
      product.active = product.active === false;
      if (!confirm(`${product.active ? "Aktifkan" : "Nonaktifkan"} produk "${product.name}"?`)) return;
      Store.saveProduct(product);
      toast("Status produk diperbarui.");
      render();
      updateAdminBadges();
    }
  });

  render();
}

/* ---------- Orders ---------- */
/* Kelola pesanan: lihat daftar, ubah status, dan verifikasi pembayaran. */
function orderManageModal(order) {
  return `
    <h2 class="modal__title">Kelola Pesanan ${escapeHtml(order.code)}</h2>
    <div class="modal__meta">
      <p><strong>${adminUserName(order.userId)}</strong> · ${order.type === "custom" ? "Custom Merch" : "Reguler"}</p>
      <p class="muted">Total ${formatPrice(order.total)} · ${statusBadge("payment", order.paymentStatus)}</p>
    </div>
    <form id="order-manage-form" data-order-id="${escapeHtml(order.id)}">
      <div class="form-group">
        <label for="of-status">Status pesanan</label>
        <select id="of-status" class="form-control">
          ${Object.entries(MerchData.statusLabels.order)
            .map(([key, label]) => `<option value="${key}" ${order.status === key ? "selected" : ""}>${label}</option>`)
            .join("")}
        </select>
        <p class="form-hint">Status processing/shipped/completed hanya setelah pembayaran terverifikasi.</p>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="of-courier">Kurir / layanan</label>
          <input id="of-courier" class="form-control" value="${escapeHtml(order.courierName || "")}" placeholder="Contoh: JNE Reguler">
        </div>
        <div class="form-group">
          <label for="of-tracking">Nomor resi</label>
          <input id="of-tracking" class="form-control" value="${escapeHtml(order.trackingNumber || "")}" placeholder="Opsional sebelum dikirim">
        </div>
      </div>
      <div class="form-group">
        <label for="of-note">Catatan perubahan status</label>
        <textarea id="of-note" class="form-control" rows="2" placeholder="Contoh: Paket diserahkan ke kurir."></textarea>
      </div>
      <div class="modal__actions">
        <button type="button" class="btn btn--outline" data-close-modal>Batal</button>
        <button type="submit" class="btn btn--primary">Simpan Perubahan</button>
      </div>
    </form>`;
}

function initAdminOrders() {
  const body = $("#admin-orders-body");
  if (!body) return;

  const filter = $("#admin-order-filter");
  const highlight = new URLSearchParams(location.search).get("highlight");

  function render() {
    let orders = Store.orders().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (filter && filter.value !== "all") orders = orders.filter((o) => o.status === filter.value);

    body.innerHTML = orders.length
      ? orders
          .map(
            (o) => `
            <tr class="${highlight === o.id ? "row-highlight" : ""}">
              <td><strong>${escapeHtml(o.code)}</strong><br><small class="muted">${formatDateShort(o.createdAt)}</small></td>
              <td>${escapeHtml(adminUserName(o.userId))}</td>
              <td>${o.type === "custom" ? "Custom" : "Reguler"}</td>
              <td>${formatPrice(o.total)}</td>
              <td>${statusBadge("payment", o.paymentStatus)}</td>
              <td>${statusBadge("order", o.status)}</td>
              <td>${escapeHtml(o.trackingNumber || "—")}</td>
              <td><button type="button" class="btn btn--outline btn--sm" data-manage="${escapeHtml(o.id)}">Kelola</button></td>
            </tr>`
          )
          .join("")
      : adminTableEmpty(8, "Tidak ada pesanan pada filter ini.");
  }

  if (filter) jQuery(filter).on("change", render);

  jQuery(body).on("click", (e) => {
    const btn = e.target.closest("[data-manage]");
    if (!btn) return;
    const order = Store.findOrder(btn.dataset.manage);
    if (!order) return;
    openModal(orderManageModal(order));

    jQuery("#order-manage-form").on("submit", function (ev) {
      ev.preventDefault();
      const current = Store.findOrder(order.id);
      if (!current) return;
      const nextStatus = jQuery("#of-status").val();
      const courier = jQuery("#of-courier").val().trim();
      const tracking = jQuery("#of-tracking").val().trim();
      const note = jQuery("#of-note").val().trim();

      const needsPaid = ["processing", "shipped", "completed"].includes(nextStatus);
      if (needsPaid && current.paymentStatus !== "verified") {
        toast("Pembayaran belum terverifikasi. Verifikasi bukti pembayaran terlebih dahulu.", "error");
        return;
      }

      const orders = Store.orders();
      const target = orders.find((o) => o.id === current.id);
      const now = new Date().toISOString();
      const prevStatus = target.status;

      // Kembalikan stok jika order dibatalkan dan sebelumnya sudah reservasi stok
      if (nextStatus === "cancelled" && !["cancelled", "completed"].includes(prevStatus)) {
        for (const item of target.items) {
          const product = Store.getProduct(item.productId);
          if (!product) continue;
          if (item.variantId) {
            const variant = product.variants.find((v) => v.id === item.variantId);
            if (variant) variant.stock = Number(variant.stock) + Number(item.quantity);
          }
        }
      }

      target.status = nextStatus;
      target.courierName = courier;
      target.trackingNumber = tracking;
      target.updatedAt = now;
      if (nextStatus === "processing" && !target.paidAt) target.paidAt = now;
      if (nextStatus === "shipped") target.shippedAt = now;

      if (prevStatus !== nextStatus) {
        const labels = MerchData.statusLabels.order;
        target.history.push({
          status: nextStatus,
          note: note || `Status diubah admin menjadi ${labels[nextStatus] || nextStatus}.`,
          at: now,
        });
      } else if (note) {
        target.history.push({ status: nextStatus, note, at: now });
      }

      Store.saveOrders(orders);
      closeModal();
      toast("Pesanan diperbarui.");
      render();
      updateAdminBadges();
    });
  });

  render();
  if (highlight) {
    const row = body.querySelector(".row-highlight");
    if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/* ---------- Custom requests ---------- */
/* Review custom request: setujui dengan harga final, minta revisi, atau tolak
   dengan catatan yang ditampilkan kepada pembeli. */
function customReviewModal(request) {
  const preview = request.designData
    ? `<img class="review-preview" src="${request.designData}" alt="Desain custom">`
    : `<div class="design-placeholder">${icon("palette")}<span>${escapeHtml(request.designName || "Tidak ada file")}</span></div>`;

  return `
    <h2 class="modal__title">Tinjauan ${escapeHtml(request.code)}</h2>
    <div class="review-layout">
      <div class="review-preview-wrap">${preview}</div>
      <div>
        <p><strong>${escapeHtml(request.productName)}</strong></p>
        <p class="muted">${escapeHtml(request.size)} · ${escapeHtml(request.color)} · ${request.quantity} unit</p>
        <p class="muted">Pemohon: ${escapeHtml(adminUserName(request.userId))}</p>
        ${request.notes ? `<p class="request-note"><strong>Catatan pembeli:</strong> ${escapeHtml(request.notes)}</p>` : ""}
      </div>
    </div>
    <form id="custom-review-form" data-request-id="${escapeHtml(request.id)}">
      <div class="form-group">
        <label for="cr-status">Keputusan</label>
        <select id="cr-status" class="form-control">
          <option value="under_review" ${request.status === "under_review" ? "selected" : ""}>Sedang Ditinjau</option>
          <option value="approved" ${request.status === "approved" ? "selected" : ""}>Setujui Desain</option>
          <option value="revision_requested" ${request.status === "revision_requested" ? "selected" : ""}>Minta Revisi</option>
          <option value="rejected" ${request.status === "rejected" ? "selected" : ""}>Tolak</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cr-price">Harga final per unit (Rp)</label>
        <input id="cr-price" type="number" min="0" step="1000" class="form-control" value="${request.quotedUnitPrice || ""}" placeholder="Wajib saat menyetujui">
        <p class="form-hint">Harga estimasi studio bukan harga final. Total = harga final × jumlah + ongkir.</p>
      </div>
      <div class="form-group">
        <label for="cr-note">Catatan admin</label>
        <textarea id="cr-note" class="form-control" rows="3" placeholder="Alasan revisi/penolakan atau catatan produksi">${escapeHtml(request.adminNote || "")}</textarea>
      </div>
      <div class="modal__actions">
        <button type="button" class="btn btn--outline" data-close-modal>Batal</button>
        <button type="submit" class="btn btn--primary">Simpan Keputusan</button>
      </div>
    </form>`;
}

function initAdminCustomRequests() {
  const root = $("#admin-custom-requests");
  if (!root) return;
  const filter = $("#admin-custom-filter");

  function render() {
    let requests = Store.requests().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (filter && filter.value !== "all") requests = requests.filter((r) => r.status === filter.value);

    root.innerHTML = requests.length
      ? requests
          .map((r) => {
            const canReview = r.status !== "ordered";
            return `
              <article class="admin-request card">
                <div class="admin-request__preview">
                  ${r.designData ? `<img src="${r.designData}" alt="Desain ${escapeHtml(r.code)}">` : `<div class="design-placeholder">${icon("palette")}<span>${escapeHtml(r.designName || "Tidak ada file")}</span></div>`}
                </div>
                <div class="admin-request__body">
                  <div class="d-flex justify-between gap-s flex-wrap">
                    <div>
                      <p class="eyebrow">${escapeHtml(r.code)} · ${formatDateShort(r.createdAt)}</p>
                      <h3>${escapeHtml(r.productName)}</h3>
                      <p class="muted">${escapeHtml(adminUserName(r.userId))} · ${escapeHtml(r.size)} / ${escapeHtml(r.color)} · ${r.quantity} unit</p>
                    </div>
                    ${statusBadge("custom", r.status)}
                  </div>
                  ${r.notes ? `<p class="request-note"><strong>Catatan pembeli:</strong> ${escapeHtml(r.notes)}</p>` : ""}
                  ${r.adminNote ? `<p class="muted"><strong>Catatan admin:</strong> ${escapeHtml(r.adminNote)}</p>` : ""}
                  ${r.quotedUnitPrice ? `<p><strong>Harga final:</strong> ${formatPrice(r.quotedUnitPrice)} / unit</p>` : ""}
                  <div class="d-flex gap-s flex-wrap mt-s">
                    ${canReview ? `<button type="button" class="btn btn--primary btn--sm" data-review="${escapeHtml(r.id)}">Tinjau / Ubah Keputusan</button>` : `<span class="badge badge--neutral">Sudah menjadi pesanan</span>`}
                  </div>
                </div>
              </article>`;
          })
          .join("")
      : emptyState("palette", "Tidak ada custom request", "Belum ada permintaan pada filter ini.");
  }

  if (filter) jQuery(filter).on("change", render);

  jQuery(root).on("click", (e) => {
    const btn = e.target.closest("[data-review]");
    if (!btn) return;
    const request = Store.findRequest(btn.dataset.review);
    if (!request) return;
    openModal(customReviewModal(request));

    jQuery("#custom-review-form").on("submit", function (ev) {
      ev.preventDefault();
      const status = jQuery("#cr-status").val();
      const price = Number(jQuery("#cr-price").val()) || 0;
      const note = jQuery("#cr-note").val().trim();

      if (status === "approved" && price <= 0) {
        toast("Harga final per unit wajib diisi saat menyetujui desain.", "error");
        return;
      }
      if (["revision_requested", "rejected"].includes(status) && !note) {
        toast("Catatan admin wajib diisi untuk revisi atau penolakan.", "error");
        return;
      }

      Store.updateRequest(request.id, {
        status,
        quotedUnitPrice: status === "approved" ? price : request.quotedUnitPrice || 0,
        adminNote: note,
      });
      closeModal();
      toast("Keputusan custom request disimpan.");
      render();
      updateAdminBadges();
    });
  });

  render();
}

/* ---------- Payments ---------- */
/* Verifikasi atau tolak bukti pembayaran simulasi yang diunggah pembeli. */
function initAdminPayments() {
  const root = $("#admin-payments");
  if (!root) return;

  function render() {
    const orders = Store.orders().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const pending = orders.filter((o) => o.paymentStatus === "pending_verification");
    const rejected = orders.filter((o) => o.paymentStatus === "rejected");
    const awaiting = orders.filter((o) => o.paymentStatus === "awaiting_proof" && o.status !== "cancelled");

    const renderRow = (o) => {
      const proof = o.payment.proof
        ? `<button type="button" class="proof-thumb" data-proof="${escapeHtml(o.id)}"><img src="${o.payment.proof}" alt="Bukti ${escapeHtml(o.code)}"></button>`
        : `<span class="muted">Tidak ada file</span>`;
      const actions =
        o.paymentStatus === "pending_verification"
          ? `<div class="d-flex gap-s flex-wrap">
               <button type="button" class="btn btn--primary btn--sm" data-verify="${escapeHtml(o.id)}">Verifikasi</button>
               <button type="button" class="btn btn--outline btn--sm text-critical" data-reject="${escapeHtml(o.id)}">Tolak</button>
             </div>`
          : `<a class="link" href="${baseUrl(`admin/orders.php?highlight=${encodeURIComponent(o.id)}`)}">Lihat pesanan</a>`;

      return `
        <tr>
          <td><strong>${escapeHtml(o.code)}</strong><br><small class="muted">${adminUserName(o.userId)}</small></td>
          <td>${formatPrice(o.payment.amount || o.total)}</td>
          <td>${proof}</td>
          <td>${formatDateShort(o.payment.submittedAt)}</td>
          <td>${statusBadge("payment", o.paymentStatus)}</td>
          <td>${o.payment.rejectionNote ? `<small class="text-critical">${escapeHtml(o.payment.rejectionNote)}</small>` : actions}</td>
        </tr>`;
    };

    root.innerHTML = `
      <section class="panel">
        <div class="panel__head">
          <h2 class="panel__title">Menunggu Verifikasi (${pending.length})</h2>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Pesanan</th><th>Nominal</th><th>Bukti</th><th>Dikirim</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>${pending.length ? pending.map(renderRow).join("") : adminTableEmpty(6, "Tidak ada pembayaran yang menunggu verifikasi.")}</tbody>
          </table>
        </div>
      </section>
      <section class="panel">
        <h2 class="panel__title">Pembayaran Ditolak (${rejected.length})</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Pesanan</th><th>Nominal</th><th>Bukti</th><th>Dikirim</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>${rejected.length ? rejected.map(renderRow).join("") : adminTableEmpty(6, "Tidak ada pembayaran ditolak.")}</tbody>
          </table>
        </div>
      </section>
      <section class="panel">
        <h2 class="panel__title">Menunggu Bukti dari Pembeli (${awaiting.length})</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Pesanan</th><th>Nominal</th><th>Bukti</th><th>Dikirim</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>${awaiting.length ? awaiting.map(renderRow).join("") : adminTableEmpty(6, "Semua pesanan aktif sudah memiliki bukti.")}</tbody>
          </table>
        </div>
      </section>`;
  }

  jQuery(root).on("click", (e) => {
    const proofBtn = e.target.closest("[data-proof]");
    if (proofBtn) {
      const order = Store.findOrder(proofBtn.dataset.proof);
      if (order && order.payment.proof) {
        openModal(`
          <h2 class="modal__title">Bukti ${escapeHtml(order.code)}</h2>
          <img class="proof-large" src="${order.payment.proof}" alt="Bukti pembayaran">
          <p class="muted mt-s">${escapeHtml(order.payment.proofName || "bukti.jpg")} · ${formatPrice(order.payment.amount)}</p>
          <div class="modal__actions"><button class="btn btn--outline" data-close-modal>Tutup</button></div>`);
      }
      return;
    }

    const verifyBtn = e.target.closest("[data-verify]");
    if (verifyBtn) {
      const order = Store.findOrder(verifyBtn.dataset.verify);
      if (!order) return;
      if (!confirm(`Verifikasi pembayaran simulasi ${order.code} sebesar ${formatPrice(order.total)}?`)) return;
      const orders = Store.orders();
      const target = orders.find((o) => o.id === order.id);
      const now = new Date().toISOString();
      target.payment.status = "verified";
      target.payment.verifiedAt = now;
      target.payment.rejectionNote = "";
      target.paymentStatus = "verified";
      target.status = "processing";
      target.paidAt = now;
      target.updatedAt = now;
      target.history.push({ status: "processing", note: "Pembayaran simulasi diverifikasi admin.", at: now });
      Store.saveOrders(orders);
      toast("Pembayaran terverifikasi. Pesanan masuk tahap pemrosesan.");
      render();
      updateAdminBadges();
      return;
    }

    const rejectBtn = e.target.closest("[data-reject]");
    if (rejectBtn) {
      const order = Store.findOrder(rejectBtn.dataset.reject);
      if (!order) return;
      openModal(`
        <h2 class="modal__title">Tolak Pembayaran ${escapeHtml(order.code)}</h2>
        <form id="reject-payment-form">
          <div class="form-group">
            <label for="reject-note">Alasan penolakan (terlihat pembeli)</label>
            <textarea id="reject-note" class="form-control" rows="3" required placeholder="Contoh: Bukti tidak jelas, mohon unggah ulang."></textarea>
          </div>
          <div class="modal__actions">
            <button type="button" class="btn btn--outline" data-close-modal>Batal</button>
            <button type="submit" class="btn btn--primary">Tolak Pembayaran</button>
          </div>
        </form>`);

      jQuery("#reject-payment-form").on("submit", function (ev) {
        ev.preventDefault();
        const note = jQuery("#reject-note").val().trim();
        if (!note) return;
        const allOrders = Store.orders();
        const target = allOrders.find((o) => o.id === order.id);
        const now = new Date().toISOString();
        target.payment.status = "rejected";
        target.payment.rejectionNote = note;
        target.payment.verifiedAt = null;
        target.paymentStatus = "rejected";
        target.status = "awaiting_payment";
        target.updatedAt = now;
        target.history.push({ status: "awaiting_payment", note: `Bukti pembayaran ditolak: ${note}`, at: now });
        Store.saveOrders(allOrders);
        closeModal();
        toast("Pembayaran ditolak. Pembeli dapat mengunggah bukti baru.");
        render();
        updateAdminBadges();
      });
    }
  });

  render();
}

/* ---------- Shipping rates ---------- */
/* CRUD tarif pengiriman: area, layanan, dan biaya (simulasi tanpa API). */
function initAdminShipping() {
  const body = $("#admin-shipping-body");
  if (!body) return;

  function rateModal(rate) {
    const isNew = !rate;
    const r = rate || { id: "", area: "", service: "", fee: 0, active: true };
    return `
      <h2 class="modal__title">${isNew ? "Tambah Tarif Ongkir" : "Ubah Tarif Ongkir"}</h2>
      <form id="rate-form" data-rate-id="${escapeHtml(r.id)}">
        <div class="form-group">
          <label for="rf-area">Area</label>
          <input id="rf-area" class="form-control" value="${escapeHtml(r.area)}" required placeholder="Contoh: Jakarta">
        </div>
        <div class="form-group">
          <label for="rf-service">Kurir / layanan</label>
          <input id="rf-service" class="form-control" value="${escapeHtml(r.service)}" required placeholder="Contoh: JNE Reguler">
        </div>
        <div class="form-group">
          <label for="rf-fee">Tarif (Rp)</label>
          <input id="rf-fee" type="number" min="0" step="1000" class="form-control" value="${r.fee}" required>
        </div>
        <div class="form-group">
          <label for="rf-active">Status</label>
          <select id="rf-active" class="form-control">
            <option value="1" ${r.active !== false ? "selected" : ""}>Aktif</option>
            <option value="0" ${r.active === false ? "selected" : ""}>Nonaktif</option>
          </select>
        </div>
        <div class="modal__actions">
          <button type="button" class="btn btn--outline" data-close-modal>Batal</button>
          <button type="submit" class="btn btn--primary">Simpan Tarif</button>
        </div>
      </form>`;
  }

  function render() {
    const rates = Store.shippingRates();
    body.innerHTML = rates.length
      ? rates
          .map(
            (r) => `
            <tr class="${r.active === false ? "row-muted" : ""}">
              <td>${escapeHtml(r.area)}</td>
              <td>${escapeHtml(r.service)}</td>
              <td>${formatPrice(r.fee)}</td>
              <td>${r.active === false ? '<span class="badge badge--critical">Nonaktif</span>' : '<span class="badge badge--success">Aktif</span>'}</td>
              <td class="table-actions">
                <button type="button" class="btn btn--outline btn--sm" data-edit-rate="${escapeHtml(r.id)}">Ubah</button>
                <button type="button" class="btn btn--outline btn--sm text-critical" data-delete-rate="${escapeHtml(r.id)}">Hapus</button>
              </td>
            </tr>`
          )
          .join("")
      : adminTableEmpty(5, "Belum ada tarif pengiriman.");
  }

  jQuery("#btn-add-rate").on("click", () => {
    openModal(rateModal(null));
    jQuery("#rate-form").on("submit", function (e) {
      e.preventDefault();
      const rates = Store.shippingRates();
      rates.push({
        id: uid("r"),
        area: jQuery("#rf-area").val().trim(),
        service: jQuery("#rf-service").val().trim(),
        fee: Number(jQuery("#rf-fee").val()) || 0,
        active: jQuery("#rf-active").val() === "1",
      });
      Store.saveShippingRates(rates);
      closeModal();
      toast("Tarif ongkir ditambahkan.");
      render();
    });
  });

  jQuery(body).on("click", (e) => {
    const editBtn = e.target.closest("[data-edit-rate]");
    if (editBtn) {
      const rate = Store.findShippingRate(editBtn.dataset.editRate);
      if (!rate) return;
      openModal(rateModal(rate));
      jQuery("#rate-form").on("submit", function (ev) {
        ev.preventDefault();
        const rates = Store.shippingRates();
        const target = rates.find((r) => r.id === rate.id);
        target.area = jQuery("#rf-area").val().trim();
        target.service = jQuery("#rf-service").val().trim();
        target.fee = Number(jQuery("#rf-fee").val()) || 0;
        target.active = jQuery("#rf-active").val() === "1";
        Store.saveShippingRates(rates);
        closeModal();
        toast("Tarif ongkir diperbarui.");
        render();
      });
      return;
    }

    const deleteBtn = e.target.closest("[data-delete-rate]");
    if (deleteBtn) {
      const rate = Store.findShippingRate(deleteBtn.dataset.deleteRate);
      if (!rate || !confirm(`Hapus tarif ${rate.area} — ${rate.service}?`)) return;
      Store.saveShippingRates(Store.shippingRates().filter((r) => r.id !== rate.id));
      toast("Tarif ongkir dihapus.");
      render();
    }
  });

  render();
}

/* ---------- Responsive tables ---------- */
/* Tabel admin diubah menjadi kartu bertumpuk di layar kecil. Label sel
   diambil dari header tabel agar tetap terbaca tanpa header. */
function initResponsiveTableLabels() {
  function labelTables() {
    $$(".table-wrap table").forEach((table) => {
      const headers = $$("thead th", table).map((th) => th.textContent.trim());
      if (!headers.length) return;
      $$("tbody tr", table).forEach((tr) => {
        const cells = $$("td", tr);
        if (cells.length === 1 && cells[0].hasAttribute("colspan")) {
          cells[0].removeAttribute("data-label");
          return;
        }
        cells.forEach((cell, index) => {
          cell.setAttribute("data-label", headers[index] || "");
        });
      });
    });
  }

  labelTables();
  let frame = null;
  const observer = new MutationObserver(() => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      labelTables();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ---------- Init ---------- */
/* Inisialisasi semua halaman admin setelah memuat: guard role, badge, dan
   pemicu modul yang ada pada halaman tersebut. */
jQuery(() => {
  updateAdminBadges();
  initAdminDashboard();
  initAdminProducts();
  initAdminOrders();
  initAdminCustomRequests();
  initAdminPayments();
  initAdminShipping();
  initResponsiveTableLabels();
});
