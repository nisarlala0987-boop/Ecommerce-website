import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
import { getAuth, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6H0JXLi8aV8rApfmkDeZBgFQk2vGHzxM",
  authDomain: "login-form-c178f.firebaseapp.com",
  databaseURL:"https://login-form-c178f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "login-form-c178f",
  storageBucket: "login-form-c178f.firebasestorage.app",
  messagingSenderId: "954559059965",
  appId: "1:954559059965:web:80fa0f124c714d9d1bab94",
  measurementId: "G-GRPE86DBXP"
};

// ── Agar already initialize ho chuka hai toh dobara mat karo ──
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const analytics = getAnalytics(app);
const auth = getAuth(app);

// ── Signup page elements ──
var no    = document.getElementById("place");
var nom   = document.getElementById("pss");
var nisra = document.getElementById("pass");
if (nisra) nisra.addEventListener("click", signup);

var authcon = document.getElementById("auth");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // user logged in
  } else {
    if (authcon) authcon.style.display = "block";
    if (no)  no.value  = "";
    if (nom) nom.value = "";
  }
});

function signup() {
  createUserWithEmailAndPassword(auth, no.value, nom.value)
    .then((userCredential) => {
      no.value  = "";
      nom.value = "";
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.log(error.message);
    });
}

// ── Login page elements ──
var pasw  = document.getElementById("pasw");
var lala  = document.getElementById("lala");
var nisar = document.getElementById("login");
if (nisar) nisar.addEventListener("click", login);

function login() {
  signInWithEmailAndPassword(auth, lala.value, pasw.value)
    .then((userCredential) => {
      lala.value = "";
      pasw.value = "";
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.log("Login failed:", error.message);
    });
}

// ── Logout ──
var logoutBtn = document.getElementById("logout");
if (logoutBtn) logoutBtn.addEventListener("click", logouts);

function logouts() {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.log(error);
    });
}

// ── Google Sign In ──
var googleb = document.getElementById("google");
if (googleb) googleb.addEventListener("click", googlesign);

const provider = new GoogleAuthProvider();

function googlesign() {
  signInWithPopup(auth, provider)
    .then((result) => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.log("Google error:", error.message);
    });
}