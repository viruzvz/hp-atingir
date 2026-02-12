(() => {
  // habilita modo JS pro CSS
  document.documentElement.classList.add("js");

  const nav = document.querySelector("#navigation");
  // Mesmo sem navbar, o reveal deve funcionar
  // então NÃO damos return aqui.

  const headerOffset =
    parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-offset")) || 0;

  // =========================
  // 1) REVEAL (FADE ON SCROLL)
  // =========================
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealAllNow = () => {
    document.querySelectorAll(".reveal, .reveal-item").forEach(el => {
      el.classList.add("is-visible");
      el.style.transitionDelay = "0ms";
    });
  };

  if (prefersReduced) {
    revealAllNow();
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add("is-visible");

        // Composição de itens internos
        const items = el.querySelectorAll(".reveal-item");
        items.forEach((item, i) => {
          item.style.transitionDelay = `${i * 70}ms`;
          item.classList.add("is-visible");
        });

        revealObserver.unobserve(el); // anima só 1x
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    // fallback de segurança: se não existir nenhuma .reveal, não faz nada
  }

  // =========================
  // 2) NAV ACTIVE (SEM SALTOS)
  // =========================
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("a.nav-link"));
  const homeLink =
    links.find(a => (a.dataset.section || "").toLowerCase() === "home") ||
    links.find(a => (a.getAttribute("href") || "") === "#");

  // Mapeia links de seção
  const items = links
    .map(a => {
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#") && href.length > 1) {
        const sec = document.querySelector(href);
        if (sec) return { link: a, section: sec };
      }
      return null;
    })
    .filter(Boolean);

  const setActive = (link) => {
    links.forEach(l => l.classList.toggle("active", l === link));
  };

  // Click: scroll suave com offset
  links.forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";

      // HOME
      if (a === homeLink || href === "#" || href === "") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        history.pushState(null, "", "#");
        if (homeLink) setActive(homeLink);
        return;
      }

      // Seções
      if (href.startsWith("#") && href.length > 1) {
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset + 1;
        window.scrollTo({ top: y, behavior: "smooth" });
        history.pushState(null, "", href);
      }
    });
  });

  // Active por posição (estável)
  const TOP_THRESHOLD = Math.max(10, headerOffset + 10);
  const ACTIVE_LINE = headerOffset + 160; // ajuste fino (80–160)

  const sortItems = () => {
    items.sort((a, b) => a.section.offsetTop - b.section.offsetTop);
  };

  let ticking = false;
  const computeActive = () => {
    const y = window.scrollY;

    if (homeLink && y <= TOP_THRESHOLD) {
      setActive(homeLink);
      return;
    }

    const probe = y + ACTIVE_LINE;

    let current = null;
    for (const it of items) {
      if (it.section.offsetTop <= probe) current = it;
      else break;
    }

    if (!current) {
      if (homeLink) setActive(homeLink);
      return;
    }

    setActive(current.link);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      computeActive();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    sortItems();
    computeActive();
  });

  // Inicial
  sortItems();
  computeActive();
})();
