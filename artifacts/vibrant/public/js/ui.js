// Dynamic UI elements and theme manager

const initTheme = () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
};

const updateThemeIcon = (theme) => {
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (!themeBtn) return;
  
  if (theme === "dark") {
    // Sun icon for toggle to light
    themeBtn.innerHTML = `
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  } else {
    // Moon icon for toggle to dark
    themeBtn.innerHTML = `
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }
};

// Toggle password visibility
const togglePasswordVisibility = (e) => {
  const btn = e.currentTarget;
  const input = btn.previousElementSibling;
  if (!input) return;
  const type = input.type === "password" ? "text" : "password";
  input.type = type;
  // Switch icon
  btn.innerHTML = type === "password"
    ? `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
    : `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
};

// Attach eye toggle listeners
const attachEyeToggle = () => {
  document.querySelectorAll('.eye-toggle').forEach(btn => {
    btn.addEventListener('click', togglePasswordVisibility);
  });
};

// Global Toast System (Q4)
const showToast = (message) => {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  toastContainer.innerHTML = `
    <div class="toast">
      <span class="toast-icon">
        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </span>
      <span>${message}</span>
    </div>
  `;

  // Trigger animation entry
  setTimeout(() => {
    toastContainer.classList.add("active");
  }, 10);

  // Auto dismissal after 3.5s
  setTimeout(() => {
    toastContainer.classList.remove("active");
  }, 3500);
};

// Sync navigation user context state
const updateNavbarAuth = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const authLink = document.getElementById("nav-auth-link");
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (authLink) {
        if (user.role === "admin") {
          authLink.innerHTML = `<span class="uppercase-label font-bold" style="color: var(--pink); font-weight: 700;">Dashboard</span>`;
          authLink.href = "/admin.html";
        } else {
          authLink.innerHTML = `
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          `;
          authLink.href = "/profile.html";
        }
      }
    } catch (e) {
      // token malformed or missing — treat as logged out
    }
  } else {
    if (authLink) {
      authLink.innerHTML = `
        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
      `;
      authLink.href = "/auth.html";
    }
  }
};

// Check database cart length dynamically
const updateCartBadge = () => {
  const cartBadge = document.getElementById("cart-badge");
  if (!cartBadge) return;

  const token = localStorage.getItem("token");
  if (!token) {
    cartBadge.style.display = "none";
    return;
  }

  fetch("/api/cart", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(cart => {
      if (cart && cart.items && cart.items.length > 0) {
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.innerText = totalItems;
        cartBadge.style.display = "flex";
      } else {
        cartBadge.style.display = "none";
      }
    })
    .catch(err => {
      console.warn("Cart check failed or unauthenticated:", err.message);
      cartBadge.style.display = "none";
    });
};

// Wire placeholder buttons to notify "Coming Soon" toast (Q4)
const initPlaceholders = () => {
  document.body.addEventListener("click", (e) => {
    const target = e.target.closest(".coming-soon");
    if (target) {
      e.preventDefault();
      showToast("VIBRANT: This feature is coming soon!");
    }
  });
};

// Track mouse position to control dynamic background parallax
const initMouseTracker = () => {
  if (window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      document.documentElement.style.setProperty("--mouse-x", x.toFixed(3));
      document.documentElement.style.setProperty("--mouse-y", y.toFixed(3));
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateNavbarAuth();
  updateCartBadge();
  initPlaceholders();
  initMouseTracker();
  // Initialize eye toggle buttons for password fields
  attachEyeToggle();

  const themeToggle = document.getElementById("theme-toggle-btn");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
});

// Expose globally so inline scripts or other modules can trigger alerts
window.showToast = showToast;
window.updateCartBadge = updateCartBadge;
window.updateNavbarAuth = updateNavbarAuth;
