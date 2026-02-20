// ===============================
// Menu lateral (Hambúrguer) — Portal VMO
// Abre/fecha no clique, fecha no overlay, ESC e ao clicar em links.
// Se não existir <nav class="nav"> no HTML, ele cria automaticamente.
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle") || document.querySelector(".hamburger");
  if (!menuToggle) return;

  // Tenta pegar nav/overlay já existentes (caso você tenha colocado no HTML)
  let nav = document.getElementById("navMenu") || document.querySelector(".nav");
  let overlay = document.getElementById("navOverlay") || document.querySelector(".nav-overlay");

  // Se não existir, cria automaticamente
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    overlay.id = "navOverlay";
    document.body.appendChild(overlay);
  }

  if (!nav) {
    nav = document.createElement("nav");
    nav.className = "nav";
    nav.id = "navMenu";
    nav.setAttribute("aria-label", "Menu do Portal");
    document.body.appendChild(nav);

    // Itens do menu (mesmos links dos cards)
    const items = [
      { text: "Relatórios Diários", href: "relatorios.html" },
      { text: "Confirmações Neo Energia", href: "neo.html" },
      { text: "Confirmações Ecomp", href: "ecomp.html" },
      { text: "Controle de KM", href: "km.html" },
      { text: "Orientações da área", href: "orientacoes.html" },
      { text: "POPS", href: "pops.html" },
    ];

    nav.innerHTML = items
      .map(i => `<a href="${i.href}">${i.text}</a>`)
      .join("");
  }

  // Acessibilidade no botão
  menuToggle.setAttribute("role", "button");
  menuToggle.setAttribute("tabindex", "0");
  menuToggle.setAttribute("aria-controls", "navMenu");
  menuToggle.setAttribute("aria-expanded", "false");

  const openMenu = () => {
    nav.classList.add("open");
    overlay.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    nav.classList.remove("open");
    overlay.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    nav.classList.contains("open") ? closeMenu() : openMenu();
  };

  // Clique no hambúrguer abre/fecha
  menuToggle.addEventListener("click", toggleMenu);

  // Enter/Espaço também abre/fecha
  menuToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Clicar no overlay fecha
  overlay.addEventListener("click", closeMenu);

  // Clicar em um item fecha e navega
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", closeMenu);
  });

  // ESC fecha
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
});