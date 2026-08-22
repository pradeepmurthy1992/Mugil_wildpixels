// Wild Pixels_kmv — shared site behaviour

/* Rotating hero backgrounds — a different strong shot each page load.
   Runs immediately (script tag is after the hero markup) so the swap
   happens before paint rather than flashing the fallback image. */
(() => {
  const HERO_POOL = [
    "tiger-golden-light.jpg",
    "tiger-forest-track.jpg",
    "tiger-resting-02.jpg",
    "tiger-approaching-02.jpg",
    "leopard-undergrowth.jpg",
    "owl-canopy.jpg",
    "crested-serpent-eagle.jpg",
    "flamingo-flock-sunrise.jpg",
    "flamingo-golden-hour.jpg",
    "flamingo-sunset.jpg",
    "white-throated-kingfisher.jpg",
    "blue-tailed-bee-eater.jpg",
    "golden-oriole-02.jpg",
    "red-junglefowl.jpg",
    "bts-sunrise.jpg",
    "bts-field-01.jpg",
  ];
  const heroEls = document.querySelectorAll("[data-random-hero]");
  if (!heroEls.length) return;
  const used = [];
  heroEls.forEach((el) => {
    const pool = HERO_POOL.filter((f) => !used.includes(f));
    const pick = (pool.length ? pool : HERO_POOL)[
      Math.floor(Math.random() * (pool.length ? pool.length : HERO_POOL.length))
    ];
    used.push(pick);
    el.style.backgroundImage = `url('assets/img/${pick}')`;
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  /* Sticky header background on scroll */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile nav toggle */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  /* Reveal-on-scroll */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* Gallery filter */
  const filterBar = document.querySelector(".filter-bar");
  if (filterBar) {
    const buttons = filterBar.querySelectorAll("button");
    const figures = document.querySelectorAll(".gallery-grid figure");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.filter;
        figures.forEach((fig) => {
          const show = cat === "all" || fig.dataset.cat === cat;
          fig.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* Lightbox */
  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const lbImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");
    const items = Array.from(document.querySelectorAll("[data-lightbox] img"));
    let current = 0;

    const show = (i) => {
      current = (i + items.length) % items.length;
      lbImg.src = items[current].currentSrc || items[current].src;
      lbImg.alt = items[current].alt || "";
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    };

    items.forEach((img, i) => {
      img.closest("[data-lightbox]").addEventListener("click", (e) => {
        e.preventDefault();
        show(i);
      });
    });
    closeBtn && closeBtn.addEventListener("click", close);
    prevBtn && prevBtn.addEventListener("click", () => show(current - 1));
    nextBtn && nextBtn.addEventListener("click", () => show(current + 1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
  }
});
