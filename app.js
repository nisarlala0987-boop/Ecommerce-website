
const products = [
  { id:1, name:'Nova AirPods Pro', brand:'NOVA Audio', price:89, oldPrice:129, emoji:'🎧', tag:'Bestseller', rating:4.9, reviews:2341 },
  { id:2, name:'UltraSlim Watch X', brand:'Nova Wear', price:199, oldPrice:249, emoji:'⌚', tag:'New', rating:4.8, reviews:893 },
  { id:3, name:'4K Smart Camera', brand:'Nova Lens', price:349, oldPrice:449, emoji:'📷', tag:'Sale', rating:4.7, reviews:567 },
  { id:4, name:'Wireless Keyboard', brand:'Nova Type', price:59, oldPrice:null, emoji:'⌨️', tag:'Popular', rating:4.6, reviews:1204 },
  { id:5, name:'Gaming Mouse Pro', brand:'Nova Game', price:79, oldPrice:99, emoji:'🖱️', tag:'Sale', rating:4.8, reviews:3210 },
  { id:6, name:'Smart LED Lamp', brand:'Nova Light', price:45, oldPrice:null, emoji:'💡', tag:'New', rating:4.5, reviews:445 },
];

let cart = [];

function renderProducts() {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = products.map((p,i) => `
    <div class="product-card reveal" style="transition-delay:${i*0.1}s">
      <div class="product-thumb">
        <div class="product-tag-label${p.tag==='Sale'?' sale':''}">${p.tag}</div>
        <button class="wishlist-btn" onclick="toggleWish(this)" title="Wishlist">🤍</button>
        <span style="font-size:64px;">${p.emoji}</span>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</span>
          <span class="rating-count">${p.rating} (${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-price-row">
          <div>
            <span class="product-price">$${p.price}</span>
            ${p.oldPrice ? `<span class="product-price-old">$${p.oldPrice}</span>` : ''}
          </div>
          <button class="add-cart-btn" onclick="addToCart(${p.id})">Add to Cart +</button>
        </div>
      </div>
    </div>
  `).join('');
  observeReveal();
}

function toggleWish(btn) {
  btn.classList.toggle('active');
  btn.textContent = btn.classList.contains('active') ? '❤️' : '🤍';
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCart();
  showToast(`🛍️ ${p.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCart();
}

function updateCart() {
  const count = cart.reduce((a,x) => a + x.qty, 0);
  document.getElementById('cart-count').textContent = count;

  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛍️</div><p>Your cart is empty.<br>Start shopping!</p></div>`;
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-thumb">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price} × ${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  const total = cart.reduce((a,x) => a + x.price * x.qty, 0);
  document.getElementById('cart-total').textContent = `$${total}`;
}

function toggleCart() {
  document.getElementById('cart-panel').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

function subscribeNL() {
  const email = document.getElementById('nl-email').value;
  if (!email || !email.includes('@')) { showToast('⚠️ Please enter a valid email'); return; }
  document.getElementById('nl-email').value = '';
  showToast('🎉 Subscribed! Check your inbox soon.');
}

// Countdown Timer
function startTimer() {
  let end = new Date().getTime() + (9 * 3600 + 23 * 60 + 45) * 1000;
  function tick() {
    let diff = end - new Date().getTime();
    if (diff < 0) { end = new Date().getTime() + 24 * 3600 * 1000; return; }
    let h = Math.floor(diff / 3600000);
    let m = Math.floor((diff % 3600000) / 60000);
    let s = Math.floor((diff % 60000) / 1000);
    document.getElementById('t-h').textContent = String(h).padStart(2,'0');
    document.getElementById('t-m').textContent = String(m).padStart(2,'0');
    document.getElementById('t-s').textContent = String(s).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}

// Scroll Reveal
function observeReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}
renderProducts();
startTimer();
observeReveal();