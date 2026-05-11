const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const railLinks = document.querySelectorAll("[data-rail-link]");
const workItems = Array.from(document.querySelectorAll(".work-item"));
const workToggle = document.querySelector("[data-work-toggle]");
const workInitialCount = 12;
const revealTargets = document.querySelectorAll(
  ".section, .intro-band, .expertise-band, .service-card, .expertise-grid article, .logo-tile, .project-card, .work-item"
);

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

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

if ("IntersectionObserver" in window && railLinks.length > 0) {
  const sectionTargets = railLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const currentId = `#${entry.target.id}`;
        railLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === currentId);
        });
      });
    },
    { threshold: 0.45 }
  );

  sectionTargets.forEach((section) => sectionObserver.observe(section));
}

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

if (workItems.length > workInitialCount && workToggle) {
  workItems.forEach((item, index) => {
    if (index >= workInitialCount) {
      item.classList.add("is-collapsed");
    }
  });

  workToggle.addEventListener("click", () => {
    const isExpanded = workToggle.getAttribute("aria-expanded") === "true";
    const nextExpanded = !isExpanded;

    workItems.forEach((item, index) => {
      if (index >= workInitialCount) {
        item.classList.toggle("is-collapsed", !nextExpanded);
      }
    });

    workToggle.setAttribute("aria-expanded", String(nextExpanded));
    workToggle.textContent = nextExpanded ? "Show less work" : "Show all work";
  });
} else if (workToggle) {
  workToggle.style.display = "none";
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const message = data.get("message").trim();
  const subject = encodeURIComponent(`Project enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

  window.location.href = `mailto:aacwltech@gmail.com?subject=${subject}&body=${body}`;
  formNote.textContent = "Your email app is ready with the message.";
});
