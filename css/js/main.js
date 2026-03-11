// Active link highlight (for multi-page nav)
(() => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll('nav a[data-page]').forEach(a => {
    if (a.getAttribute("href") === path) a.setAttribute("aria-current", "page");
  });
})();

// Mobile menu toggle
(() => {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileNav");
  if(!btn || !menu) return;

  btn.addEventListener("click", () => {
    menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", menu.classList.contains("open") ? "true" : "false");
  });
})();
