import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
  remove
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6H0JXLi8aV8rApfmkDeZBgFQk2vGHzxM",
  authDomain: "login-form-c178f.firebaseapp.com",
  databaseURL: "https://login-form-c178f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "login-form-c178f",
  storageBucket: "login-form-c178f.firebasestorage.app",
  messagingSenderId: "954559059965",
  appId: "1:954559059965:web:80fa0f124c714d9d1bab94",
  measurementId: "G-GRPE86DBXP"
};

// Avoid re-initializing if already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

// ── ADD PRODUCT ──
export function addProduct(name, price, image) {
  const productsRef = ref(db, "products/");
  return push(productsRef, {
    name,
    price: parseFloat(price),
    image
  });
}

// ── LISTEN TO ALL PRODUCTS (real-time) ──
export function listenProducts(callback) {
  const productsRef = ref(db, "products/");
  onValue(productsRef, (snapshot) => {
    const data = snapshot.val();
    const products = [];
    if (data) {
      Object.entries(data).forEach(([id, val]) => {
        products.push({ id, ...val });
      });
    }
    callback(products);
  });
}

// ── UPDATE PRODUCT ──
export function updateProduct(id, name, price, image) {
  const productRef = ref(db, `products/${id}`);
  return update(productRef, {
    name,
    price: parseFloat(price),
    image
  });
}

// ── DELETE PRODUCT ──
export function deleteProduct(id) {
  const productRef = ref(db, `products/${id}`);
  return remove(productRef);
}