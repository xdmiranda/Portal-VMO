document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // Menu lateral (Hambúrguer)
  // ===============================
  const menuToggle = document.getElementById("menuToggle") || document.querySelector(".hamburger");

  // Não travar o restante do portal caso alguma página não tenha menu
  const nav = document.getElementById("navMenu") || document.querySelector(".nav");
  let overlay = document.getElementById("navOverlay") || document.querySelector(".nav-overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    overlay.id = "navOverlay";
    document.body.appendChild(overlay);
  }

  if (menuToggle && nav) {
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

    menuToggle.addEventListener("click", toggleMenu);
    menuToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });

    overlay.addEventListener("click", closeMenu);
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // ===============================
  // Carrossel (mostra N, avança N, loop infinito com repetição)
  // ===============================
  const INTERVAL = 4000;

  const getVisibleFromCSS = () => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--visible-count")
      .trim();
    const n = parseInt(raw || "3", 10);
    return Number.isFinite(n) && n > 0 ? n : 3;
  };

  const createCarousel = (root) => {
    const track = root.querySelector(".carousel-track");
    const viewport = root.querySelector(".carousel-viewport");
    const btnPrev = root.querySelector(".carousel-btn.prev");
    const btnNext = root.querySelector(".carousel-btn.next");

    if (!track || !viewport || !btnPrev || !btnNext) return;

    const originals = Array.from(track.children);
    const originalCount = originals.length;
    if (originalCount === 0) return;

    const before = originals.map((el) => el.cloneNode(true));
    const after = originals.map((el) => el.cloneNode(true));

    track.innerHTML = "";
    before.forEach((el) => track.appendChild(el));
    originals.forEach((el) => track.appendChild(el));
    after.forEach((el) => track.appendChild(el));

    let index = originalCount;
    let timer = null;
    let isSnapping = false;

    const getGap = () => {
      const styles = getComputedStyle(track);
      const gap = styles.gap || styles.columnGap || "0px";
      return parseFloat(gap) || 0;
    };

    const getStepPx = () => {
      const first = track.children[0];
      if (!first) return 0;
      return first.getBoundingClientRect().width + getGap();
    };

    const applyTransform = (withTransition = true) => {
      track.style.transition = withTransition ? "transform .35s ease" : "none";
      const offset = getStepPx() * index;
      track.style.transform = `translateX(${-offset}px)`;
    };

    const normalize = () => {
      if (isSnapping) return;

      const min = originalCount;
      const max = originalCount * 2;

      if (index >= max) {
        isSnapping = true;
        index -= originalCount;
        applyTransform(false);
        track.offsetHeight; // força reflow
        track.style.transition = "transform .35s ease";
        isSnapping = false;
      } else if (index < min) {
        isSnapping = true;
        index += originalCount;
        applyTransform(false);
        track.offsetHeight; // força reflow
        track.style.transition = "transform .35s ease";
        isSnapping = false;
      }
    };

    const movePage = (dir, manual = false) => {
      const visible = getVisibleFromCSS();
      const step = visible;
      index += dir * step;
      applyTransform(true);
      if (manual) resetAuto();
    };

    const startAuto = () => {
      stopAuto();
      timer = setInterval(() => movePage(1, false), INTERVAL);
    };

    const stopAuto = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const resetAuto = () => startAuto();

    btnPrev.addEventListener("click", () => movePage(-1, true));
    btnNext.addEventListener("click", () => movePage(1, true));

    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);
    root.addEventListener("focusin", stopAuto);
    root.addEventListener("focusout", startAuto);

    track.addEventListener("transitionend", normalize);

    window.addEventListener("resize", () => {
      applyTransform(false);
      track.offsetHeight;
      track.style.transition = "transform .35s ease";
    });

    applyTransform(false);
    track.offsetHeight;
    track.style.transition = "transform .35s ease";
    startAuto();
  };

  document.querySelectorAll("[data-carousel]").forEach(createCarousel);
});
