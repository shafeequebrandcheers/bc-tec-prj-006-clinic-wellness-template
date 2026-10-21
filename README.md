# bc-tec-prj-006-clinic-wellness-template
Clinics & Wellness Centers Unified Template

A responsive, configuration-driven single-page website for clinics and wellness businesses. One codebase supports:

| `businessType`       | Also accepted                         | Business                  | Default theme                   |
|----------------------|---------------------------------------|---------------------------|---------------------------------|
| `ayurvedic-clinic`   | `ayurvedic`, `ayurveda`               | Ayurvedic clinic          | Herbal green, warm beige        |
| `dental`             | `dental-clinic`, `dentist`            | Dental practice           | Clean blue, white, neutral gray |
| `medical`            | `medical-clinic`, `general`, `gp`     | General medical clinic    | Clinical blue, white, gray      |
| `dermatology`        | `skin`, `skin-clinic`                 | Dermatology / skin clinic | Soft neutrals, muted blush      |
| `physiotherapy`      | `physio`, `physiotherapy-center`      | Physiotherapy center      | Teal, green, light neutrals     |
| `spa`                | `wellness-spa`, `wellness`            | Holistic wellness / spa   | Sage green, cream, warm tones   |

Built with HTML5, CSS3 and vanilla JavaScript - no frameworks, no build step, no backend.

## Project Structure

```
index.html          Page skeleton (no business-specific content)
config.js           All business data + wording presets per business type
css/variables.css   Design tokens and the colour theme for each business type
css/base.css        Reset, typography, buttons, utilities, focus and reduced-motion styles
css/style.css       Header, hero, services, team, contact, footer and modal layouts
js/main.js          Theme, dynamic rendering, service filters, mobile navigation
js/booking.js       Appointment modal, validation, WhatsApp / email submission
```

## Run Locally

No installation needed.

- Open `index.html` directly in a browser, **or**
- Use the VS Code **Live Server** extension, **or**
- Run `npx serve .` (or `python -m http.server`) in this folder and open the printed URL.

## Configure a New Business

Edit **only** the `clinicConfig` object in `config.js`:

1. **`businessType`** - pick one of the six types above. This sets the theme, icons and section headings.
2. **Branding** - `brandName`, `tagline`, `description`, `logo` (optional image path/URL).
3. **`hero`** - headline and description for the top of the page.
4. **`contact`** - `phone`, `whatsapp` (country code + number, digits only, e.g. `919876543210`), `email`, `address`, `mapLink`.
5. **`workingHours`** - one row per day or range, e.g. `{ day: "Saturday", hours: "9:00 AM - 2:00 PM" }`. Use `{ day: "Sunday", closed: true }` for closed days.
6. **`about`, `highlights`, `facilities`** - introduction, trust indicators and facilities.
7. **`serviceCategories`** - filter buttons in display order, e.g. `["All", "Consultations", "Therapies"]`. Leave empty to build them from the services.
8. **`services`** - `id`, `name`, `category`, `description`, `duration`, `price` (shown exactly as written, e.g. `"₹800"` or `"On consultation"`), optional `icon` / `image`.
9. **`team`** - `name`, `role`, and optional `qualifications`, `experience`, `image`, `bio`.
10. **`testimonials`** - add only genuine feedback shared with permission. The section stays hidden while the list is empty.
11. **`booking`** - `methods` (`["whatsapp"]`, `["email"]` or both so the visitor can choose), `defaultMethod` and button labels.

### Optional overrides

- **`theme.preset`** - use another type's theme (e.g. a dermatology clinic using `spa` colours).
- **`theme.colors`** - override individual colours (`primary`, `primaryDark`, `secondary`, `background`, `surface`, `text`, `textMuted`, `border`). Empty values keep the theme default.
- **`theme.headingFont` / `theme.bodyFont`** - custom font stacks.
- **`sections`** - custom headings for the Services and Team sections.

### Images

All image fields are empty by default and show a styled placeholder (team members show their initials). To use real photos, add an image folder (e.g. `images/`) and set paths such as `"images/hero.jpg"`, or use full image URLs. Broken image links fall back to the placeholder automatically.

### Missing data

Empty or missing optional fields are hidden. Empty `services`, `team`, `highlights`, `facilities` or `testimonials` lists hide their section (and matching navigation links).

## Appointment Requests

The appointment form sends an **inquiry**, not a confirmed booking:

- **WhatsApp** - opens `wa.me` with a pre-filled message the visitor sends themselves.
- **Email** - opens the visitor's email app with a pre-filled message.

All values are URL-encoded before building the link. The success message clearly states the request still needs to be confirmed by the clinic. Real-time availability, confirmed bookings or online payments require a suitable backend or third-party booking system.

## Privacy & Healthcare Notes

- The form collects only what's needed for an appointment inquiry. Nothing is stored in browser storage, cookies or logs by this template.
- Visitors are told that submitting sends their details through WhatsApp or email, which are external services.
- This template is **not** HIPAA (or any other regulation) compliant by itself. Compliance depends on hosting, integrations, security controls, access policies and applicable laws.
- Only publish verified qualifications and claims. The sample data in `config.js` is placeholder content.
