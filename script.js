const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const pageTransitionMs = 200;
const revealTargets = document.querySelectorAll(
  ".section, .intro-band, .chapter-intro, .expertise-band, .service-card, .expertise-grid article, .logo-tile, .project-card, .work-category, .work-item"
);

function updateHeader() {
  if (!header) {
    return;
  }
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (window.requestAnimationFrame) {
  document.body.classList.add("is-page-entering");
  window.requestAnimationFrame(() => {
    document.body.classList.add("is-page-entered");
    window.setTimeout(() => {
      document.body.classList.remove("is-page-entering");
    }, pageTransitionMs + 40);
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

if (menuToggle && menu && header) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    header.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      menu.classList.remove("is-open");
      header.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function isPageTransitionLink(anchor, event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false;
  }

  if (anchor.target && anchor.target !== "_self") {
    return false;
  }

  if (anchor.hasAttribute("download")) {
    return false;
  }

  const rawHref = anchor.getAttribute("href");
  if (
    !rawHref ||
    rawHref.startsWith("#") ||
    rawHref.startsWith("mailto:") ||
    rawHref.startsWith("tel:") ||
    rawHref.startsWith("javascript:")
  ) {
    return false;
  }

  let destination;
  try {
    destination = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }

  const current = new URL(window.location.href);
  if (destination.origin !== current.origin) {
    return false;
  }

  const isSameDocument =
    destination.pathname === current.pathname &&
    destination.search === current.search;

  return !isSameDocument;
}

document.addEventListener("click", (event) => {
  const anchor = event.target.closest("a[href]");
  if (!anchor || !isPageTransitionLink(anchor, event)) {
    return;
  }

  event.preventDefault();
  document.body.classList.add("is-page-leaving");

  window.setTimeout(() => {
    window.location.href = anchor.href;
  }, pageTransitionMs);
});
