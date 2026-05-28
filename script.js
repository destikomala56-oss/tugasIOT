const storageKeys = {
  customProducts: "airguard_custom_products",
  cart: "airguard_cart",
  adminSession: "airguard_admin_session"
};

const adminCredentials = {
  username: "admin",
  password: "admin123"
};

const defaultProducts = [
  {
    id: "mini",
    name: "AirGuard Mini",
    badge: "Compact",
    description: "Untuk kamar, meja kerja, dan ruangan kecil.",
    price: 599000,
    specs: ["PM2.5", "Suhu", "RH"],
    tone: "mini",
    stock: 14
  },
  {
    id: "core",
    name: "AirGuard Core",
    badge: "Best seller",
    description: "Model utama untuk rumah dan ruang keluarga.",
    price: 899000,
    specs: ["PM2.5", "CO2", "App"],
    tone: "core",
    stock: 22,
    featured: true
  },
  {
    id: "pro",
    name: "AirGuard Pro",
    badge: "Advanced",
    description: "Untuk pengguna yang butuh data sensor lebih lengkap.",
    price: 1299000,
    specs: ["VOC", "CO2", "Trend"],
    tone: "pro",
    stock: 11
  },
  {
    id: "outdoor",
    name: "AirGuard Outdoor",
    badge: "Outdoor",
    description: "Untuk teras, balkon, halaman, dan area semi-terbuka.",
    price: 1599000,
    specs: ["Weather", "Dust", "IP54"],
    tone: "outdoor",
    stock: 9
  },
  {
    id: "space",
    name: "AirGuard Space Pack",
    badge: "Bundle",
    description: "Paket 4 node untuk kelas, studio, atau kantor kecil.",
    price: 2499000,
    specs: ["4 node", "Laporan", "Support"],
    tone: "space",
    stock: 6,
    featured: true
  }
];

const scenes = {
  home: {
    title: "Ruang keluarga dalam mode aman",
    copy: "Ventilasi masih cukup, partikel halus rendah, dan CO2 berada di zona nyaman.",
    status: "Baik",
    insight: "Udara aman. Pertahankan sirkulasi.",
    aqi: 38,
    pm: 12,
    co2: 482,
    temp: 27,
    humidity: 61
  },
  class: {
    title: "Kelas mulai padat aktivitas",
    copy: "CO2 naik karena ruangan terisi banyak orang. AirGuard menyarankan ventilasi tambahan.",
    status: "Waspada",
    insight: "Buka jendela 10 menit atau aktifkan exhaust.",
    aqi: 72,
    pm: 21,
    co2: 844,
    temp: 29,
    humidity: 66
  },
  office: {
    title: "Kantor stabil setelah jam makan siang",
    copy: "Partikel turun dan kelembapan masih nyaman untuk bekerja beberapa jam ke depan.",
    status: "Stabil",
    insight: "Kondisi baik untuk produktivitas.",
    aqi: 46,
    pm: 15,
    co2: 615,
    temp: 26,
    humidity: 58
  }
};

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
};

const formatDateTime = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
};

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const escapeHTML = (value) => {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };

  return String(value).replace(/[&<>"']/g, (char) => entities[char]);
};

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Static preview can still run if browser storage is blocked.
  }
};

const readSession = (key) => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeSession = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Login still works for the current interaction if session storage is blocked.
  }
};

const removeSession = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Nothing else to clean up.
  }
};

const header = qs("[data-header]");
const menuToggle = qs("[data-menu-toggle]");
const navLinks = qs("[data-nav-links]");
const productGrid = qs("#productGrid");
const inventoryList = qs("#inventoryList");
const inventoryCount = qs("#inventoryCount");
const adminLoginForm = qs("#adminLoginForm");
const adminLoginMessage = qs("#adminLoginMessage");
const adminLocked = qs("#adminLocked");
const adminSession = qs("#adminSession");
const adminBoard = qs("#adminBoard");
const adminLogoutButton = qs("#adminLogoutButton");
const adminProductForm = qs("#adminProductForm");
const adminStatus = qs("#adminStatus");
const cartOverlay = qs("#cartOverlay");
const cartPanel = qs(".cart-panel");
const cartItems = qs("#cartItems");
const cartEmpty = qs("#cartEmpty");
const cartItemCount = qs("#cartItemCount");
const cartTotal = qs("#cartTotal");
const checkoutButton = qs("#checkoutButton");
const orderOverlay = qs("#orderOverlay");
const orderPanel = qs(".order-panel");
const orderForm = qs("#orderForm");
const orderSuccess = qs("#orderSuccess");
const checkoutItemCount = qs("#checkoutItemCount");
const checkoutCartList = qs("#checkoutCartList");
const summaryPackage = qs("#summaryPackage");
const summarySubtotal = qs("#summarySubtotal");
const summaryPayment = qs("#summaryPayment");
const summaryTotal = qs("#summaryTotal");
const successMessage = qs("#successMessage");
const receiptOrderId = qs("#receiptOrderId");
const receiptDate = qs("#receiptDate");
const receiptLines = qs("#receiptLines");
const receiptTotal = qs("#receiptTotal");
const receiptName = qs("#receiptName");
const receiptPayment = qs("#receiptPayment");
const receiptAddress = qs("#receiptAddress");
const trackingStatus = qs("#trackingStatus");
const trackingCard = qs(".tracking-card");
const advanceTrackingButton = qs("#advanceTrackingButton");
const whatsappSupport = qs("#whatsappSupport");

const storedCustomProducts = readStorage(storageKeys.customProducts, []);
const storedCart = readStorage(storageKeys.cart, []);

let customProducts = Array.isArray(storedCustomProducts) ? storedCustomProducts : [];
let products = [...defaultProducts, ...customProducts];
let cart = Array.isArray(storedCart) ? storedCart : [];
let lastFocusedElement = null;
let revealObserver = null;
let isAdminLoggedIn = readSession(storageKeys.adminSession) === "active";

const getProduct = (productId) => products.find((product) => product.id === productId);

const getCartDetails = () => {
  return cart
    .map((item) => {
      const product = getProduct(item.id);
      if (!product) return null;
      const qty = Math.max(1, Math.min(product.stock, Number(item.qty) || 1));
      return {
        product,
        qty,
        subtotal: product.price * qty
      };
    })
    .filter(Boolean);
};

const getCartTotals = () => {
  const details = getCartDetails();
  return {
    details,
    count: details.reduce((total, item) => total + item.qty, 0),
    total: details.reduce((total, item) => total + item.subtotal, 0)
  };
};

const saveCart = () => {
  writeStorage(storageKeys.cart, cart);
};

const normalizeCart = () => {
  cart = getCartDetails().map((item) => ({
    id: item.product.id,
    qty: item.qty
  }));
  saveCart();
};

const syncBodyScroll = () => {
  const cartOpen = cartOverlay && !cartOverlay.hidden;
  const orderOpen = orderOverlay && !orderOverlay.hidden;
  document.body.classList.toggle("no-scroll", cartOpen || orderOpen);
};

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

const closeMobileMenu = () => {
  if (!menuToggle || !navLinks) return;
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("is-open");
};

const productCardTemplate = (product) => {
  const specs = product.specs
    .map((spec) => `<span>${escapeHTML(spec)}</span>`)
    .join("");
  const buttonClass = product.featured ? "btn btn-primary full" : "btn btn-secondary full";
  const cardClass = [
    "product-card",
    `tone-${escapeHTML(product.tone)}`,
    product.featured ? "featured" : "",
    "reveal",
    "is-visible"
  ].filter(Boolean).join(" ");

  return `
    <article class="${cardClass}" data-product-card="${escapeHTML(product.id)}">
      <div class="product-visual" aria-hidden="true">
        <span class="device-core"></span>
        <span class="device-ring"></span>
      </div>
      <p class="badge">${escapeHTML(product.badge)}</p>
      <h3>${escapeHTML(product.name)}</h3>
      <p class="price-note">${escapeHTML(product.description)}</p>
      <div class="product-meta">${specs}</div>
      <p class="stock-line">${product.stock} stok tersedia</p>
      <div class="price">${formatRupiah(product.price)}</div>
      <button class="${buttonClass}" type="button" data-add-cart="${escapeHTML(product.id)}">Tambah ke Keranjang</button>
    </article>
  `;
};

const renderProducts = () => {
  if (!productGrid) return;
  products = [...defaultProducts, ...customProducts];
  productGrid.innerHTML = products.map(productCardTemplate).join("");
};

const inventoryItemTemplate = (product) => {
  const canRemove = product.id.startsWith("custom-");
  const action = canRemove
    ? `<button type="button" data-remove-product="${escapeHTML(product.id)}">Hapus</button>`
    : "<small>Default</small>";

  return `
    <div class="inventory-item">
      <div>
        <strong>${escapeHTML(product.name)}</strong>
        <span>${formatRupiah(product.price)} - ${product.stock} stok</span>
      </div>
      ${action}
    </div>
  `;
};

const renderInventory = () => {
  if (!inventoryList || !inventoryCount) return;
  inventoryCount.textContent = `${products.length} model`;
  inventoryList.innerHTML = products.map(inventoryItemTemplate).join("");
};

const renderAdminAccess = (message = "") => {
  if (adminBoard) adminBoard.hidden = !isAdminLoggedIn;
  if (adminSession) adminSession.hidden = !isAdminLoggedIn;
  if (adminLocked) adminLocked.hidden = isAdminLoggedIn;
  if (adminLoginForm) adminLoginForm.hidden = isAdminLoggedIn;

  if (adminLoginMessage) {
    adminLoginMessage.textContent = message;
    adminLoginMessage.classList.toggle("is-success", isAdminLoggedIn && Boolean(message));
  }

  if (isAdminLoggedIn) {
    renderInventory();
  }
};

const renderCart = () => {
  normalizeCart();
  const { details, count, total } = getCartTotals();

  qsa("[data-cart-count]").forEach((counter) => {
    counter.textContent = count;
  });

  if (cartItemCount) cartItemCount.textContent = count;
  if (cartTotal) cartTotal.textContent = formatRupiah(total);
  if (checkoutButton) checkoutButton.disabled = count === 0;

  if (!cartItems || !cartEmpty) return;

  cartItems.hidden = count === 0;
  cartEmpty.classList.toggle("is-visible", count === 0);
  cartItems.innerHTML = details.map(({ product, qty, subtotal }) => `
    <div class="cart-row tone-${escapeHTML(product.tone)}">
      <div class="cart-thumb" aria-hidden="true"><span></span></div>
      <div class="cart-detail">
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.badge)} - ${formatRupiah(product.price)}</p>
        <strong>${formatRupiah(subtotal)}</strong>
      </div>
      <div class="cart-controls">
        <div class="cart-stepper" aria-label="Jumlah ${escapeHTML(product.name)}">
          <button type="button" data-cart-action="minus" data-product-id="${escapeHTML(product.id)}">-</button>
          <span>${qty}</span>
          <button type="button" data-cart-action="plus" data-product-id="${escapeHTML(product.id)}">+</button>
        </div>
        <button class="remove-item" type="button" data-cart-action="remove" data-product-id="${escapeHTML(product.id)}">Hapus</button>
      </div>
    </div>
  `).join("");
};

const renderCheckoutSummary = () => {
  const { details, count, total } = getCartTotals();
  const payment = qs("input[name='payment']:checked", orderForm);
  const paymentLabel = payment ? payment.value : "Belum dipilih";

  if (checkoutItemCount) checkoutItemCount.textContent = `${count} item`;
  if (checkoutCartList) {
    checkoutCartList.innerHTML = details.map(({ product, qty, subtotal }) => `
      <div>
        <span>${escapeHTML(product.name)} x ${qty}</span>
        <strong>${formatRupiah(subtotal)}</strong>
      </div>
    `).join("");
  }

  if (summaryPackage) summaryPackage.textContent = count ? `${details.length} model / ${count} item` : "Belum ada item";
  if (summarySubtotal) summarySubtotal.textContent = formatRupiah(total);
  if (summaryPayment) summaryPayment.textContent = paymentLabel;
  if (summaryTotal) summaryTotal.textContent = formatRupiah(total);
};

const openCart = () => {
  if (!cartOverlay) return;
  lastFocusedElement = document.activeElement;
  renderCart();
  cartOverlay.hidden = false;
  closeMobileMenu();
  syncBodyScroll();
  setTimeout(() => checkoutButton && checkoutButton.focus(), 80);
};

const closeCart = () => {
  if (!cartOverlay) return;
  cartOverlay.hidden = true;
  syncBodyScroll();
  if (lastFocusedElement) lastFocusedElement.focus();
};

const openCheckout = () => {
  const { count } = getCartTotals();
  if (!count || !orderOverlay || !orderForm || !orderSuccess) return;

  if (cartOverlay) cartOverlay.hidden = true;
  orderSuccess.hidden = true;
  orderForm.hidden = false;
  orderForm.classList.remove("was-validated");
  orderOverlay.hidden = false;
  renderCheckoutSummary();
  syncBodyScroll();
  setTimeout(() => qs("input[name='name']", orderForm).focus(), 80);
};

const closeOrder = () => {
  if (!orderOverlay || !orderForm) return;
  orderOverlay.hidden = true;
  orderForm.classList.remove("was-validated");
  syncBodyScroll();
  if (lastFocusedElement) lastFocusedElement.focus();
};

const addToCart = (productId) => {
  const product = getProduct(productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty = Math.min(product.stock, existing.qty + 1);
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart();
  renderCart();
  openCart();
};

const updateCartItem = (productId, action) => {
  const product = getProduct(productId);
  const existing = cart.find((item) => item.id === productId);
  if (!product || !existing) return;

  if (action === "plus") {
    existing.qty = Math.min(product.stock, existing.qty + 1);
  }

  if (action === "minus") {
    existing.qty -= 1;
  }

  if (action === "remove" || existing.qty < 1) {
    cart = cart.filter((item) => item.id !== productId);
  }

  saveCart();
  renderCart();
  renderCheckoutSummary();
};

const buildOrderId = () => {
  const fragment = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `AG-${new Date().getFullYear()}-${fragment}`;
};

const setTrackingStatus = (status) => {
  const isSent = status === "sent";
  const packedStep = qs("[data-track-step='packed']");
  const sentStep = qs("[data-track-step='sent']");

  if (trackingStatus) trackingStatus.textContent = isSent ? "Diantar" : "Dikemas";
  if (trackingCard) trackingCard.classList.toggle("is-sent", isSent);

  if (packedStep) {
    packedStep.classList.toggle("is-active", !isSent);
    packedStep.classList.toggle("is-complete", isSent);
  }

  if (sentStep) {
    sentStep.classList.toggle("is-active", isSent);
    sentStep.classList.toggle("is-complete", isSent);
  }

  if (advanceTrackingButton) {
    advanceTrackingButton.disabled = isSent;
    advanceTrackingButton.textContent = isSent ? "Status: Diantar" : "Update ke Diantar";
  }
};

const renderReceipt = ({ orderId, details, total, formData, createdAt }) => {
  const address = `${formData.get("address")}, ${formData.get("city")}`;
  const payment = String(formData.get("payment"));

  if (receiptOrderId) receiptOrderId.textContent = orderId;
  if (receiptDate) receiptDate.textContent = formatDateTime(createdAt);
  if (receiptTotal) receiptTotal.textContent = formatRupiah(total);
  if (receiptName) receiptName.textContent = String(formData.get("name"));
  if (receiptPayment) receiptPayment.textContent = payment;
  if (receiptAddress) receiptAddress.textContent = address;

  if (receiptLines) {
    receiptLines.innerHTML = details.map(({ product, qty, subtotal }) => `
      <div class="receipt-line">
        <div>
          <strong>${escapeHTML(product.name)}</strong>
          <span>${qty} x ${formatRupiah(product.price)}</span>
        </div>
        <strong>${formatRupiah(subtotal)}</strong>
      </div>
    `).join("");
  }
};

const submitOrder = (event) => {
  event.preventDefault();
  if (!orderForm || !orderSuccess) return;
  orderForm.classList.add("was-validated");

  if (!orderForm.checkValidity()) {
    orderForm.reportValidity();
    return;
  }

  const { details, count, total } = getCartTotals();
  if (!count) {
    closeOrder();
    openCart();
    return;
  }

  const formData = new FormData(orderForm);
  const orderId = buildOrderId();
  const createdAt = new Date();
  const itemNames = details.map(({ product, qty }) => `${product.name} x ${qty}`).join(", ");
  const payment = String(formData.get("payment"));
  const paymentNote = payment === "COD"
    ? "Pembayaran COD dilakukan saat paket tiba di alamatmu."
    : "Detail pembayaran akan dikonfirmasi oleh tim AirGuard.";
  const supportText = encodeURIComponent(`Halo CS AirGuard, saya ingin menanyakan pesanan ${orderId}.`);

  orderForm.hidden = true;
  orderSuccess.hidden = false;
  successMessage.textContent = `Terima kasih, ${formData.get("name")}. Pesanan ${orderId} berisi ${itemNames} sudah berakhir/selesai dan barang akan segera dikirim. ${paymentNote}`;
  renderReceipt({ orderId, details, total, formData, createdAt });
  setTrackingStatus("packed");

  if (whatsappSupport) {
    whatsappSupport.href = `https://wa.me/6282135366596?text=${supportText}`;
  }

  cart = [];
  saveCart();
  renderCart();
};

const loginAdmin = (event) => {
  event.preventDefault();
  if (!adminLoginForm) return;

  const formData = new FormData(adminLoginForm);
  const username = String(formData.get("username")).trim();
  const password = String(formData.get("password"));
  const isValid = username === adminCredentials.username && password === adminCredentials.password;

  if (!isValid) {
    isAdminLoggedIn = false;
    removeSession(storageKeys.adminSession);
    renderAdminAccess("Username atau sandi salah.");
    return;
  }

  isAdminLoggedIn = true;
  writeSession(storageKeys.adminSession, "active");
  adminLoginForm.reset();
  renderAdminAccess("Login berhasil. Admin Studio terbuka.");

  if (adminStatus) {
    adminStatus.textContent = "Mode admin aktif";
    setTimeout(() => {
      adminStatus.textContent = "Siap input";
    }, 2200);
  }
};

const logoutAdmin = () => {
  isAdminLoggedIn = false;
  removeSession(storageKeys.adminSession);
  renderAdminAccess("Sesi admin ditutup.");
};

const addAdminProduct = (event) => {
  event.preventDefault();
  if (!adminProductForm) return;

  if (!isAdminLoggedIn) {
    renderAdminAccess("Login admin diperlukan untuk menambah produk.");
    return;
  }

  if (!adminProductForm.checkValidity()) {
    adminProductForm.reportValidity();
    return;
  }

  const formData = new FormData(adminProductForm);
  const specs = String(formData.get("specs"))
    .split(",")
    .map((spec) => spec.trim())
    .filter(Boolean)
    .slice(0, 4);

  const product = {
    id: `custom-${Date.now()}`,
    name: String(formData.get("name")).trim(),
    badge: String(formData.get("badge")).trim(),
    description: String(formData.get("description")).trim(),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    specs: specs.length ? specs : ["PM2.5", "CO2"],
    tone: String(formData.get("tone"))
  };

  customProducts = [product, ...customProducts];
  writeStorage(storageKeys.customProducts, customProducts);
  renderProducts();
  renderInventory();
  renderCart();
  adminProductForm.reset();

  if (adminStatus) {
    adminStatus.textContent = "Model ditambahkan";
    setTimeout(() => {
      adminStatus.textContent = "Siap input";
    }, 2200);
  }
};

const removeAdminProduct = (productId) => {
  if (!isAdminLoggedIn) {
    renderAdminAccess("Login admin diperlukan untuk menghapus produk.");
    return;
  }

  customProducts = customProducts.filter((product) => product.id !== productId);
  cart = cart.filter((item) => item.id !== productId);
  writeStorage(storageKeys.customProducts, customProducts);
  saveCart();
  renderProducts();
  renderInventory();
  renderCart();
};

const resetCatalog = () => {
  if (!isAdminLoggedIn) {
    renderAdminAccess("Login admin diperlukan untuk reset katalog.");
    return;
  }

  customProducts = [];
  cart = cart.filter((item) => defaultProducts.some((product) => product.id === item.id));
  writeStorage(storageKeys.customProducts, customProducts);
  saveCart();
  renderProducts();
  renderInventory();
  renderCart();

  if (adminStatus) {
    adminStatus.textContent = "Katalog default";
    setTimeout(() => {
      adminStatus.textContent = "Siap input";
    }, 2200);
  }
};

const animateNumber = (element, target, duration = 900) => {
  if (!element) return;
  const start = Number(element.textContent) || 0;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(start + (target - start) * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const setDashboard = (sceneKey) => {
  const scene = scenes[sceneKey] || scenes.home;
  const aqiCircle = qs("#aqiCircle");

  qs("#sceneTitle").textContent = scene.title;
  qs("#sceneCopy").textContent = scene.copy;
  qs("#appStatus").textContent = scene.status;
  qs("#appInsight").textContent = scene.insight;
  qs("#heroAqi").textContent = scene.aqi;

  animateNumber(qs("#aqiValue"), scene.aqi);
  animateNumber(qs("#pmValue"), scene.pm);
  animateNumber(qs("#co2Value"), scene.co2);
  animateNumber(qs("#tempValue"), scene.temp);
  animateNumber(qs("#humidityValue"), scene.humidity);

  if (aqiCircle) {
    const percentage = Math.min(scene.aqi, 100);
    aqiCircle.style.background = `
      radial-gradient(circle, white 52%, transparent 53%),
      conic-gradient(var(--teal) 0 ${percentage}%, #d9eae4 ${percentage}% 100%)
    `;
  }
};

const randomLivePulse = () => {
  const base = scenes.home;
  const live = {
    aqi: base.aqi + Math.floor(Math.random() * 7) - 3,
    pm: base.pm + Math.floor(Math.random() * 5) - 2,
    co2: base.co2 + Math.floor(Math.random() * 31) - 15,
    temp: base.temp + Math.floor(Math.random() * 3) - 1,
    humidity: base.humidity + Math.floor(Math.random() * 5) - 2
  };

  animateNumber(qs("#aqiValue"), live.aqi, 600);
  animateNumber(qs("#pmValue"), live.pm, 600);
  animateNumber(qs("#co2Value"), live.co2, 600);
  animateNumber(qs("#tempValue"), live.temp, 600);
  animateNumber(qs("#humidityValue"), live.humidity, 600);

  const heroAqi = qs("#heroAqi");
  if (heroAqi) heroAqi.textContent = live.aqi;
};

const setupReveal = () => {
  const items = qsa(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((item) => revealObserver.observe(item));
};

const setupCounters = () => {
  const counters = qsa("[data-count]");

  if (!("IntersectionObserver" in window)) {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.count;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumber(entry.target, Number(entry.target.dataset.count), 1000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.65 });

  counters.forEach((counter) => observer.observe(counter));
};

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    navLinks.classList.toggle("is-open", isOpen);
  });

  qsa("a", navLinks).forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-cart]");
  const openCartButton = event.target.closest("[data-open-cart]");
  const closeCartButton = event.target.closest("[data-close-cart]");
  const cartActionButton = event.target.closest("[data-cart-action]");
  const closeOrderButton = event.target.closest("[data-close-order]");
  const removeProductButton = event.target.closest("[data-remove-product]");
  const resetButton = event.target.closest("[data-reset-products]");

  if (addButton) {
    addToCart(addButton.dataset.addCart);
  }

  if (openCartButton) {
    openCart();
  }

  if (closeCartButton) {
    closeCart();
  }

  if (cartActionButton) {
    updateCartItem(cartActionButton.dataset.productId, cartActionButton.dataset.cartAction);
  }

  if (closeOrderButton) {
    closeOrder();
  }

  if (removeProductButton) {
    removeAdminProduct(removeProductButton.dataset.removeProduct);
  }

  if (resetButton) {
    resetCatalog();
  }
});

if (checkoutButton) {
  checkoutButton.addEventListener("click", openCheckout);
}

if (cartOverlay && cartPanel) {
  cartOverlay.addEventListener("click", (event) => {
    if (!cartPanel.contains(event.target)) {
      closeCart();
    }
  });
}

if (orderOverlay && orderPanel) {
  orderOverlay.addEventListener("click", (event) => {
    if (!orderPanel.contains(event.target)) {
      closeOrder();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (orderOverlay && !orderOverlay.hidden) {
    closeOrder();
    return;
  }
  if (cartOverlay && !cartOverlay.hidden) {
    closeCart();
  }
});

if (orderForm) {
  orderForm.addEventListener("submit", submitOrder);
  qsa("input[name='payment']", orderForm).forEach((input) => {
    input.addEventListener("change", renderCheckoutSummary);
  });
}

if (adminProductForm) {
  adminProductForm.addEventListener("submit", addAdminProduct);
}

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", loginAdmin);
}

if (adminLogoutButton) {
  adminLogoutButton.addEventListener("click", logoutAdmin);
}

if (advanceTrackingButton) {
  advanceTrackingButton.addEventListener("click", () => setTrackingStatus("sent"));
}

qsa("[data-scene]").forEach((tab) => {
  tab.addEventListener("click", () => {
    qsa("[data-scene]").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    setDashboard(tab.dataset.scene);
  });
});

window.addEventListener("scroll", updateHeader, { passive: true });

renderProducts();
renderInventory();
renderCart();
renderAdminAccess();
renderCheckoutSummary();
updateHeader();
setupReveal();
setupCounters();

setInterval(() => {
  const activeScene = qs("[data-scene].active");
  const cartClosed = !cartOverlay || cartOverlay.hidden;
  const orderClosed = !orderOverlay || orderOverlay.hidden;

  if (activeScene && activeScene.dataset.scene === "home" && cartClosed && orderClosed) {
    randomLivePulse();
  }
}, 4200);
