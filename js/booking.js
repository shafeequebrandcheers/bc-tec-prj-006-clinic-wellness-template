document.addEventListener("DOMContentLoaded", () => {
  if (typeof clinicConfig === "undefined") return;

  const config = clinicConfig;
  const booking = config.booking || {};
  const contact = config.contact || {};

  const modal = document.getElementById("booking-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const form = document.getElementById("booking-form");
  const formView = document.getElementById("booking-form-view");
  const successView = document.getElementById("booking-success");
  const formError = document.getElementById("form-error");
  const serviceSelect = document.getElementById("book-service");
  const dateInput = document.getElementById("book-date");
  if (!modal || !form) return;

  const fields = {
    name: document.getElementById("book-name"),
    phone: document.getElementById("book-phone"),
    email: document.getElementById("book-email"),
    service: serviceSelect,
    date: dateInput,
    message: document.getElementById("book-message")
  };

  function text(value, fallback = "") {
    if (typeof value === "number") return String(value);
    if (typeof value !== "string") return fallback;
    return value.trim() || fallback;
  }

  const brandName = text(config.brandName, "the clinic");
  const whatsappNumber = text(contact.whatsapp).replace(/\D/g, "");
  const email = text(contact.email);
  const phone = text(contact.phone);

  // Only keep methods that have the contact detail they need
  const methods = (Array.isArray(booking.methods) ? booking.methods : ["whatsapp"])
    .filter(method => (method === "whatsapp" && whatsappNumber) || (method === "email" && email));
  const methodLabels = { whatsapp: "WhatsApp", email: "Email" };

  let lastFocused = null;

  // ---------- Setup: labels, services, method choice ----------
  function setup() {
    document.getElementById("booking-title").textContent = text(booking.modalTitle, "Request an Appointment");
    document.getElementById("booking-intro").textContent = text(booking.modalIntro, "Share a few details and we'll contact you to confirm a suitable time.");
    document.getElementById("booking-submit").textContent = text(booking.submitLabel, "Send Appointment Request");

    // Service dropdown
    serviceSelect.append(new Option("Select a service", ""));
    const services = (Array.isArray(config.services) ? config.services : [])
      .map(service => text(service && service.name))
      .filter(Boolean);
    [...new Set(services)].forEach(name => serviceSelect.append(new Option(name, name)));
    serviceSelect.append(new Option("Not sure - please advise", "Not sure - please advise"));

    // Earliest selectable date is today (local time)
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    dateInput.min = today.toISOString().split("T")[0];

    // Method choice is shown only when more than one method is available
    const methodGroup = document.getElementById("method-group");
    const methodOptions = document.getElementById("method-options");
    const defaultMethod = methods.includes(booking.defaultMethod) ? booking.defaultMethod : methods[0];
    if (methods.length > 1) {
      methods.forEach(method => {
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "method";
        input.value = method;
        input.defaultChecked = method === defaultMethod; // survives form.reset()
        const label = document.createElement("label");
        label.className = "method-option";
        label.append(input, methodLabels[method]);
        methodOptions.append(label);
      });
      methodGroup.hidden = false;
    }

    updatePrivacyNote(selectedMethod());
    form.addEventListener("change", e => {
      if (e.target.name === "method") updatePrivacyNote(e.target.value);
    });
  }

  function selectedMethod() {
    const checked = form.querySelector('input[name="method"]:checked');
    return checked ? checked.value : methods[0];
  }

  function updatePrivacyNote(method) {
    const note = document.getElementById("privacy-note");
    if (!method) {
      note.textContent = "";
      note.hidden = true;
      return;
    }
    const service = method === "whatsapp" ? "WhatsApp" : "your email app";
    note.hidden = false;
    note.textContent = `Your details are not stored on this website. Submitting opens ${service} with your request so you can review and send it to ${brandName}. WhatsApp and email are external services with their own privacy policies.`;
  }

  // ---------- Modal open / close ----------
  function openModal(serviceName) {
    lastFocused = document.activeElement;
    resetForm();

    if (serviceName && [...serviceSelect.options].some(opt => opt.value === serviceName)) {
      serviceSelect.value = serviceName;
    }

    modal.classList.add("active");
    document.body.classList.add("modal-open");
    setTimeout(() => fields.name.focus(), 50);
  }

  function closeModal() {
    if (!modal.classList.contains("active")) return;
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function resetForm() {
    form.reset();
    Object.keys(fields).forEach(key => setFieldError(key, ""));
    formError.hidden = true;
    formView.hidden = false;
    successView.hidden = true;
    updatePrivacyNote(selectedMethod());

    if (methods.length === 0) {
      const callText = phone ? ` Please call us on ${phone} to book.` : "";
      showFormError(`Online appointment requests are not available right now.${callText}`);
    }
  }

  // Any element with data-open-booking opens the modal (data-service preselects a service)
  document.addEventListener("click", e => {
    const trigger = e.target.closest("[data-open-booking]");
    if (!trigger) return;
    e.preventDefault();
    openModal(trigger.dataset.service);
  });

  closeBtn.addEventListener("click", closeModal);
  document.getElementById("success-close-btn").addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  // Escape closes the modal; Tab stays inside it
  document.addEventListener("keydown", e => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (e.key !== "Tab") return;

    const focusable = [...modal.querySelectorAll("button, input, select, textarea, a[href], [tabindex]:not([tabindex='-1'])")]
      .filter(node => !node.disabled && node.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // ---------- Validation ----------
  function setFieldError(key, message) {
    const input = fields[key];
    const error = document.getElementById(`book-${key}-error`);
    if (!input) return;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    if (error) error.textContent = message;
  }

  function showFormError(message) {
    formError.textContent = message;
    formError.hidden = false;
  }

  function validate(values) {
    const errors = {};
    const phoneDigits = values.phone.replace(/[\s\-().]/g, "");

    if (values.name.length < 2) errors.name = "Please enter your full name.";
    if (!values.phone) errors.phone = "Please enter your phone number.";
    else if (!/^\+?\d{7,15}$/.test(phoneDigits)) errors.phone = "Please enter a valid phone number (7-15 digits, optional +country code).";
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Please enter a valid email address.";
    if (!values.service) errors.service = "Please choose a service.";
    if (!values.date) errors.date = "Please choose a preferred date.";
    else if (values.date < dateInput.min) errors.date = "Please choose today or a future date.";

    return errors;
  }

  function formatDate(isoDate) {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
      weekday: "short", day: "numeric", month: "short", year: "numeric"
    });
  }

  // ---------- Submit via WhatsApp or email ----------
  form.addEventListener("submit", e => {
    e.preventDefault();
    formError.hidden = true;

    const values = {
      name: fields.name.value.trim(),
      phone: fields.phone.value.trim(),
      email: fields.email.value.trim(),
      service: fields.service.value,
      date: fields.date.value,
      message: fields.message.value.trim()
    };

    const errors = validate(values);
    Object.keys(fields).forEach(key => setFieldError(key, errors[key] || ""));
    const firstInvalid = Object.keys(fields).find(key => errors[key]);
    if (firstInvalid) {
      showFormError("Please correct the highlighted fields.");
      fields[firstInvalid].focus();
      return;
    }

    const method = selectedMethod();
    if (!method) {
      const callText = phone ? ` Please call us on ${phone} to book.` : "";
      showFormError(`Online appointment requests are not available right now.${callText}`);
      return;
    }

    const details = [
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      values.email && `Email: ${values.email}`,
      `Service: ${values.service}`,
      `Preferred date: ${formatDate(values.date)}`,
      values.message && `Message: ${values.message}`
    ].filter(Boolean);
    const message = `Hello ${brandName}, I would like to request an appointment.\n\n${details.join("\n")}`;

    let url;
    if (method === "whatsapp") {
      url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener");
    } else {
      const subject = `${text(booking.emailSubject, "Appointment request")} - ${values.name}`;
      url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.location.href = url;
    }

    showSuccess(method, url);
  });

  function showSuccess(method, url) {
    const appName = method === "whatsapp" ? "WhatsApp" : "your email app";
    document.getElementById("success-text").textContent =
      `We've opened ${appName} with your request. Please press send there to deliver it to ${brandName}.`;
    document.getElementById("success-note").textContent =
      `This is an appointment request, not a confirmed booking. ${brandName} will contact you to confirm your appointment.`;

    const fallback = document.getElementById("success-fallback");
    const link = document.createElement("a");
    link.href = url;
    link.textContent = method === "whatsapp" ? "Open WhatsApp again" : "Open email again";
    if (method === "whatsapp") {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    fallback.replaceChildren("Didn't open? ", link, phone ? ` or call ${phone}.` : "");

    form.reset();
    formView.hidden = true;
    successView.hidden = false;
    document.getElementById("success-title").focus();
  }

  setup();
});
