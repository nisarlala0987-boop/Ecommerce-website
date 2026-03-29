// ─────────────────────────────────────────────
// app.js  —  NOVA Shop
// Products: Firebase Realtime Database (real-time)
// Cart, Toast, Timer, Reveal: unchanged
// ─────────────────────────────────────────────

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6H0JXLi8aV8rApfmkDeZBgFQk2vGHzxM",
  authDomain: "login-form-c178f.firebaseapp.com",
  databaseURL: "https://login-form-c178f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "login-form-c178f",
  storageBucket: "login-form-c178f.firebasestorage.app",
  messagingSenderId: "954559059965",
  appId: "1:954559059965:web:80fa0f124c714d9d1bab94"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db  = getDatabase(app);

// ── REAL-TIME PRODUCTS FROM FIREBASE ──
let firebaseProducts = [];

onValue(ref(db, "products/"), (snapshot) => {
  const data = snapshot.val();
  firebaseProducts = [];

  if (data) {
    Object.entries(data).forEach(([id, val]) => {
      firebaseProducts.push({ id, ...val });
    });
  }

  renderProducts(firebaseProducts);
});

// ── RENDER PRODUCTS ──
function renderProducts(products) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  if (!products || products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#94A3B8;">
        <div style="font-size:48px;margin-bottom:12px;">📦</div>
        <p style="font-size:15px;">No products yet. Check back soon!</p>
      </div>`;
    return;
  }

  grid.innerHTML = products.map((p, i) => {
    const hasImg = p.image && p.image.trim() !== "";
    const thumb  = hasImg
      ? `<img src="${p.image}" alt="${p.name}"
              style="width:100%;height:100%;object-fit:cover;"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : "";
    const emoji  = `<span style="font-size:64px;${hasImg ? 'display:none' : ''}">🛍️</span>`;

    return `
      <div class="product-card reveal" style="transition-delay:${i * 0.08}s">
        <div class="product-thumb">
          <div class="product-tag-label">New</div>
          <button class="wishlist-btn" onclick="toggleWish(this)" title="Wishlist">🤍</button>
          ${thumb}
          ${emoji}
        </div>
        <div class="product-info">
          <div class="product-brand">NOVA Store</div>
          <div class="product-name">${p.name}</div>
          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-count">5.0</span>
          </div>
          <div class="product-price-row">
            <div>
              <span class="product-price">$${parseFloat(p.price).toFixed(2)}</span>
            </div>
            <button class="add-cart-btn" onclick="addToCart('${p.id}')">Add to Cart +</button>
          </div>
        </div>
      </div>`;
  }).join("");

  observeReveal();
}

// ── CART ──
let cart = [];

window.addToCart = function (id) {
  const p = firebaseProducts.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCart();
  showToast(`🛍️ ${p.name} added to cart!`);
};

window.removeFromCart = function (id) {
  cart = cart.filter(x => x.id !== id);
  updateCart();
};

function updateCart() {
  const count = cart.reduce((a, x) => a + x.qty, 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = count;

  const itemsEl  = document.getElementById("cart-items");
  const footerEl = document.getElementById("cart-footer");
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍️</div>
        <p>Your cart is empty.<br>Start shopping!</p>
      </div>`;
    if (footerEl) footerEl.style.display = "none";
    return;
  }

  if (footerEl) footerEl.style.display = "block";
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-thumb">
        ${item.image
          ? `<img src="${item.image}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;" onerror="this.parentElement.textContent='🛍️'">`
          : "🛍️"}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)} × ${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">✕</button>
    </div>
  `).join("");

  const total = cart.reduce((a, x) => a + x.price * x.qty, 0);
  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// ── WISHLIST ──
window.toggleWish = function (btn) {
  btn.classList.toggle("active");
  btn.textContent = btn.classList.contains("active") ? "❤️" : "🤍";
};

// ── CART TOGGLE ──
window.toggleCart = function () {
  document.getElementById("cart-panel")?.classList.toggle("open");
  document.getElementById("cart-overlay")?.classList.toggle("open");
};

// ── TOAST ──
let toastTimer;
window.showToast = function (msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  document.getElementById("toast-msg").textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
};

// ── NEWSLETTER ──
window.subscribeNL = function () {
  const email = document.getElementById("nl-email")?.value;
  if (!email || !email.includes("@")) { showToast("⚠️ Please enter a valid email"); return; }
  document.getElementById("nl-email").value = "";
  showToast("🎉 Subscribed! Check your inbox soon.");
};

// ── COUNTDOWN TIMER ──
function startTimer() {
  let end = new Date().getTime() + (9 * 3600 + 23 * 60 + 45) * 1000;
  function tick() {
    const diff = end - new Date().getTime();
    if (diff < 0) { end = new Date().getTime() + 24 * 3600 * 1000; return; }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const th = document.getElementById("t-h");
    const tm = document.getElementById("t-m");
    const ts = document.getElementById("t-s");
    if (th) th.textContent = String(h).padStart(2, "0");
    if (tm) tm.textContent = String(m).padStart(2, "0");
    if (ts) ts.textContent = String(s).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
}

// ── SCROLL REVEAL ──
function observeReveal() {
  const els = document.querySelectorAll(".reveal:not(.visible)");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ── INIT ──
startTimer();
observeReveal();