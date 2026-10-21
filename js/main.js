document.addEventListener("DOMContentLoaded", () => {
  if (typeof clinicConfig === "undefined") return;

  const config = clinicConfig;
  const presets = typeof businessPresets !== "undefined" ? businessPresets : {};
  const contact = config.contact || {};

  // Matches a businessType value to a preset key, including its aliases
  function resolveType(value) {
    const type = typeof value === "string" ? value.trim().toLowerCase() : "";
    if (!type) return "";
    if (presets[type]) return type;
    return Object.keys(presets).find(key => (presets[key].aliases || []).includes(type)) || "";
  }

  const businessKey = resolveType(config.businessType) || (presets.medical ? "medical" : Object.keys(presets)[0] || "");
  const preset = presets[businessKey] || {};

  // ---------- Helpers ----------

  // Returns a trimmed string, or the fallback for empty / non-text values
  function text(value, fallback = "") {
    if (typeof value === "number") return String(value);
    if (typeof value !== "string") return fallback;
    return value.trim() || fallback;
  }

  // Returns only arrays of objects; anything else becomes []
  function list(value) {
    return Array.isArray(value) ? value.filter(item => item && typeof item === "object") : [];
  }

  // Allows relative paths and http(s)/mailto/tel links only
  function safeUrl(value) {
    const url = text(value);
    if (!url) return "";
    const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(url);
    return !hasScheme || /^(https?:|mailto:|tel:)/i.test(url) ? url : "";
  }

  // Creates an element safely - all content is set as text, never as HTML
  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (value === undefined || value === null || value === false || value === "") return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key === "dataset") Object.assign(node.dataset, value);
      else node.setAttribute(key, value === true ? "" : value);
    });
    [].concat(children).forEach(child => {
      if (child === null || child === undefined || child === false || child === "") return;
      node.append(child instanceof Node ? child : String(child));
    });
    return node;
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  // Hides a section and every nav link pointing to it
  function hideSection(id) {
    const section = document.getElementById(id);
    if (section) section.hidden = true;
    document.querySelectorAll(`[data-nav="${id}"]`).forEach(link => {
      const item = link.closest("li") || link;
      item.hidden = true;
    });
  }

  // Image with a fallback placeholder when the URL is empty or fails to load
  function imageOrPlaceholder(src, alt, className, placeholder) {
    const url = safeUrl(src);
    if (!url) return placeholder();
    const img = el("img", { src: url, alt, className, loading: "lazy" });
    img.addEventListener("error", () => img.replaceWith(placeholder()), { once: true });
    return img;
  }

  function mediaPlaceholder(label) {
    return el("div", { className: "media-placeholder", role: "img", "aria-label": label }, [
      el("span", { className: "media-placeholder-icon", "aria-hidden": "true", text: text(preset.icon, "✚") }),
      el("span", { className: "media-placeholder-label", text: label })
    ]);
  }

  function formatPrice(price) {
    if (typeof price === "number" && Number.isFinite(price)) {
      return `${text(config.currency)}${price.toLocaleString()}`;
    }
    return text(price);
  }

  function initials(name) {
    return name
      .replace(/^(dr|mr|mrs|ms|prof)\.?\s+/i, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join("");
  }

  // ---------- 1. Theme ----------
  function applyTheme() {
    const root = document.documentElement;
    const theme = config.theme || {};
    root.dataset.theme = resolveType(theme.preset) || businessKey;

    const colorVars = {
      primary: "--color-primary",
      primaryDark: "--color-primary-dark",
      secondary: "--color-secondary",
      background: "--color-bg",
      surface: "--color-surface",
      text: "--color-text",
      textMuted: "--color-text-muted",
      border: "--color-border"
    };
    const colors = theme.colors || {};
    Object.entries(colorVars).forEach(([key, cssVar]) => {
      const value = text(colors[key]);
      if (value && CSS.supports("color", value)) root.style.setProperty(cssVar, value);
    });

    const headingFont = text(theme.headingFont);
    const bodyFont = text(theme.bodyFont);
    if (headingFont) root.style.setProperty("--font-heading", headingFont);
    if (bodyFont) root.style.setProperty("--font-body", bodyFont);
  }

  // ---------- 2. Branding ----------
  function renderBranding() {
    const brandName = text(config.brandName, "Our Clinic");
    const tagline = text(config.tagline);

    document.title = tagline ? `${brandName} - ${tagline}` : brandName;
    const metaDescription = document.getElementById("meta-description");
    if (metaDescription) metaDescription.setAttribute("content", text(config.description, tagline));

    setText("brand-name", brandName);
    const logoMark = document.getElementById("brand-logo-mark");
    if (logoMark) {
      const logoUrl = safeUrl(config.logo);
      logoMark.replaceChildren(logoUrl ? el("img", { src: logoUrl, alt: "" }) : text(preset.icon, "✚"));
    }

    // Booking CTA labels
    const ctaLabel = text(config.booking?.ctaLabel, "Book an Appointment");
    document.querySelectorAll("[data-cta-label]").forEach(btn => { btn.textContent = ctaLabel; });

    setText("footer-brand", brandName);
    setText("footer-tagline", tagline);
    setText("footer-disclaimer", text(config.disclaimer));
    setText("footer-copyright", `© ${new Date().getFullYear()} ${brandName}. Powered by Brandcheers.`);
  }

  // ---------- 3. Hero ----------
  function renderHero() {
    const hero = config.hero || {};
    setText("hero-badge", text(preset.label, "Clinic"));
    setText("hero-title", text(hero.headline, text(config.tagline, text(config.brandName))));
    setText("hero-text", text(hero.description, text(config.description)));

    const callBtn = document.getElementById("hero-call-btn");
    const phone = text(contact.phone);
    if (callBtn && phone) {
      callBtn.href = `tel:${phone.replace(/[^\d+]/g, "")}`;
      callBtn.textContent = `Call ${phone}`;
      callBtn.hidden = false;
    }

    const meta = document.getElementById("hero-meta");
    const firstHours = list(config.workingHours)[0];
    if (meta) {
      if (firstHours && text(firstHours.day)) {
        const hours = firstHours.closed ? "Closed" : text(firstHours.hours);
        meta.append(el("li", {}, [el("span", { "aria-hidden": "true", text: "🕘" }), `${text(firstHours.day)}: ${hours}`]));
      }
      if (text(contact.address)) {
        meta.append(el("li", {}, [el("span", { "aria-hidden": "true", text: "📍" }), text(contact.address)]));
      }
    }

    const media = document.getElementById("hero-media");
    if (media) {
      const brandName = text(config.brandName, "Our Clinic");
      media.append(imageOrPlaceholder(config.images?.heroImage, brandName, "hero-image", () => mediaPlaceholder(brandName)));

      const highlight = list(config.highlights)[0];
      if (highlight && text(highlight.title)) {
        media.append(el("div", { className: "hero-card" }, [
          el("span", { className: "hero-card-icon", "aria-hidden": "true", text: text(highlight.icon, "✓") }),
          el("div", {}, [el("strong", { text: text(highlight.title) }), el("span", { text: text(highlight.text) })])
        ]));
      }
    }
  }

  // ---------- 4. Highlights ----------
  function renderHighlights() {
    const items = list(config.highlights).filter(item => text(item.title));
    const grid = document.getElementById("highlights-grid");
    if (!grid || items.length === 0) return hideSection("highlights");

    items.forEach(item => {
      grid.append(el("div", { className: "highlight-item" }, [
        el("span", { className: "highlight-icon", "aria-hidden": "true", text: text(item.icon, "✓") }),
        el("div", {}, [
          el("h3", { text: text(item.title) }),
          text(item.text) ? el("p", { text: text(item.text) }) : null
        ])
      ]));
    });
  }

  // ---------- 5. About & Facilities ----------
  function renderAbout() {
    const about = config.about || {};
    setText("about-title", text(about.title, `About ${text(config.brandName, "Us")}`));
    setText("about-subtitle", text(about.subtitle));
    setText("about-p1", text(about.paragraph1, text(config.description)));
    setText("about-p2", text(about.paragraph2));

    ["about-subtitle", "about-p1", "about-p2"].forEach(id => {
      const node = document.getElementById(id);
      if (node && !node.textContent) node.hidden = true;
    });

    const stats = list(about.stats).filter(stat => text(stat.value) && text(stat.label));
    const statsContainer = document.getElementById("about-stats");
    if (statsContainer && stats.length) {
      stats.forEach(stat => {
        statsContainer.append(el("div", { className: "stat-item" }, [
          el("strong", { text: text(stat.value) }),
          el("span", { text: text(stat.label) })
        ]));
      });
      statsContainer.hidden = false;
    }

    const media = document.getElementById("about-media");
    if (media) {
      const label = text(about.title, "About us");
      media.append(imageOrPlaceholder(config.images?.aboutImage, label, "about-image", () => mediaPlaceholder(text(preset.label, "Our Clinic"))));
    }

    const facilities = list(config.facilities).filter(item => text(item.label));
    const facilitiesList = document.getElementById("facilities-list");
    if (facilitiesList && facilities.length) {
      facilities.forEach(item => {
        facilitiesList.append(el("li", { className: "facility-item" }, [
          el("span", { className: "facility-icon", "aria-hidden": "true", text: text(item.icon, "✓") }),
          text(item.label)
        ]));
      });
      document.getElementById("facilities").hidden = false;
    }
  }

  // ---------- 6. Services & Category Filters ----------
  function renderServices() {
    const sections = config.sections || {};
    setText("services-title", text(sections.servicesTitle, text(preset.servicesTitle, "Our Services")));
    setText("services-subtitle", text(sections.servicesSubtitle, text(preset.servicesSubtitle)));

    const services = list(config.services).filter(service => text(service.name));
    const grid = document.getElementById("services-grid");
    const filters = document.getElementById("service-filters");
    const status = document.getElementById("services-status");
    if (!grid || services.length === 0) return hideSection("services");

    const serviceCtaLabel = text(config.booking?.serviceCtaLabel, "Book this service");

    function serviceCard(service) {
      const name = text(service.name);
      const price = formatPrice(service.price);
      const duration = text(service.duration);
      const imageUrl = safeUrl(service.image);

      return el("article", { className: "service-card" }, [
        imageUrl ? imageOrPlaceholder(imageUrl, name, "service-image", () => document.createTextNode("")) : null,
        el("div", { className: "service-card-body" }, [
          el("div", { className: "service-card-top" }, [
            !imageUrl ? el("span", { className: "service-icon", "aria-hidden": "true", text: text(service.icon, text(preset.icon, "✚")) }) : null,
            text(service.category) ? el("span", { className: "service-category", text: text(service.category) }) : null
          ]),
          el("h3", { text: name }),
          text(service.description) ? el("p", { className: "service-desc", text: text(service.description) }) : null,
          el("div", { className: "service-card-footer" }, [
            el("div", { className: "service-meta" }, [
              duration ? el("span", { className: "service-duration" }, [el("span", { "aria-hidden": "true", text: "⏱ " }), duration]) : null,
              price ? el("span", { className: "service-price", text: price }) : null
            ]),
            el("button", {
              type: "button",
              className: "btn btn-outline btn-sm",
              "aria-label": `${serviceCtaLabel}: ${name}`,
              dataset: { openBooking: "", service: name },
              text: serviceCtaLabel
            })
          ])
        ])
      ]);
    }

    function showCategory(category) {
      const visible = category === "All" ? services : services.filter(service => text(service.category) === category);
      grid.replaceChildren(...visible.map(serviceCard));
      if (visible.length === 0) {
        grid.append(el("p", { className: "empty-state", text: "No services are listed in this category yet." }));
      }
      if (status) status.textContent = `Showing ${visible.length} service${visible.length === 1 ? "" : "s"}`;
    }

    // Use the configured category order if given, otherwise build it from the services
    const configuredCategories = (Array.isArray(config.serviceCategories) ? config.serviceCategories : [])
      .map(category => text(category))
      .filter(category => category && category !== "All");
    const categories = [...new Set(configuredCategories.length
      ? configuredCategories
      : services.map(service => text(service.category)).filter(Boolean))];
    if (filters && categories.length > 1) {
      ["All", ...categories].forEach(category => {
        const btn = el("button", {
          type: "button",
          className: "filter-btn",
          "aria-pressed": category === "All" ? "true" : "false",
          text: category
        });
        btn.addEventListener("click", () => {
          filters.querySelectorAll(".filter-btn").forEach(b => b.setAttribute("aria-pressed", "false"));
          btn.setAttribute("aria-pressed", "true");
          showCategory(category);
        });
        filters.append(btn);
      });
    } else if (filters) {
      filters.hidden = true;
    }

    showCategory("All");
  }

  // ---------- 7. Practitioners ----------
  function renderTeam() {
    const sections = config.sections || {};
    setText("team-title", text(sections.teamTitle, text(preset.teamTitle, "Our Team")));
    setText("team-subtitle", text(sections.teamSubtitle, text(preset.teamSubtitle)));

    const team = list(config.team).filter(person => text(person.name));
    const grid = document.getElementById("team-grid");
    if (!grid || team.length === 0) return hideSection("team");

    team.forEach(person => {
      const name = text(person.name);
      const details = [
        ["Qualifications", text(person.qualifications)],
        ["Experience", text(person.experience)]
      ].filter(([, value]) => value);

      grid.append(el("article", { className: "team-card" }, [
        imageOrPlaceholder(person.image, name, "team-photo", () =>
          el("div", { className: "team-avatar", "aria-hidden": "true", text: initials(name) || "✚" })
        ),
        el("div", { className: "team-card-body" }, [
          el("h3", { text: name }),
          text(person.role) ? el("p", { className: "team-role", text: text(person.role) }) : null,
          details.length
            ? el("dl", { className: "team-details" }, details.map(([label, value]) =>
                el("div", {}, [el("dt", { text: `${label}: ` }), el("dd", { text: value })])
              ))
            : null,
          text(person.bio) ? el("p", { className: "team-bio", text: text(person.bio) }) : null
        ])
      ]));
    });
  }

  // ---------- 8. Testimonials (only when genuine content exists) ----------
  function renderTestimonials() {
    const testimonials = list(config.testimonials).filter(t => text(t.quote) && text(t.name));
    const grid = document.getElementById("testimonials-grid");
    if (!grid || testimonials.length === 0) return hideSection("testimonials");

    testimonials.forEach(t => {
      grid.append(el("figure", { className: "testimonial-card" }, [
        el("blockquote", {}, [el("p", { text: `"${text(t.quote)}"` })]),
        el("figcaption", { className: "testimonial-author" }, [
          el("strong", { text: text(t.name) }),
          text(t.detail) ? el("span", { text: text(t.detail) }) : null
        ])
      ]));
    });
    document.getElementById("testimonials").hidden = false;
  }

  // ---------- 9. Footer: Contact & Hours ----------
  function renderContact() {
    const phone = text(contact.phone);
    const whatsapp = text(contact.whatsapp).replace(/\D/g, "");
    const email = text(contact.email);
    const address = text(contact.address);
    const mapLink = safeUrl(contact.mapLink);

    const items = [
      phone && { icon: "📞", label: "Phone", value: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` },
      whatsapp && { icon: "💬", label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${whatsapp}`, external: true },
      email && { icon: "✉️", label: "Email", value: email, href: `mailto:${email}` },
      address && { icon: "📍", label: "Address", value: address },
      mapLink && { icon: "🗺️", label: "Directions", value: "View on map", href: mapLink, external: true }
    ].filter(Boolean);

    const footerContact = document.getElementById("footer-contact");
    items.forEach(item => {
      const valueNode = item.href
        ? el("a", {
            href: item.href,
            text: item.value,
            target: item.external ? "_blank" : null,
            rel: item.external ? "noopener noreferrer" : null
          })
        : item.value;
      footerContact.append(el("li", { className: "footer-contact-item" }, [
        el("span", { "aria-hidden": "true", text: item.icon }),
        el("span", {}, [el("span", { className: "visually-hidden", text: `${item.label}: ` }), valueNode])
      ]));
    });

    const hours = list(config.workingHours).filter(row => text(row.day));
    const footerHours = document.getElementById("footer-hours");
    hours.forEach(row => {
      const value = row.closed ? "Closed" : text(row.hours, "By appointment");
      footerHours.append(el("li", {}, [el("strong", { text: `${text(row.day)}: ` }), value]));
    });
  }

  // ---------- 10. Mobile Navigation ----------
  function initNavigation() {
    const toggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");
    if (!toggle || !navLinks) return;

    function setMenu(open) {
      navLinks.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("active")));

    // Close the menu when a link or button inside it is used
    navLinks.querySelectorAll("a, button").forEach(item => {
      item.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Reset when resizing back to desktop
    window.matchMedia("(min-width: 901px)").addEventListener("change", e => {
      if (e.matches) setMenu(false);
    });
  }

  applyTheme();
  renderBranding();
  renderHero();
  renderHighlights();
  renderAbout();
  renderServices();
  renderTeam();
  renderTestimonials();
  renderContact();
  initNavigation();
});
