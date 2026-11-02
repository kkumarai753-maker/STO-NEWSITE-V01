# Sunrise Tech Origin design system

> **Current theme: "Glass" (light glassmorphism + soft 3D).** Every colour and
> font lives in one place: the `--c-*` palette at the top of `:root` in
> `app/globals.css` (primary `#1565F0`, hover `#0E4FCC`, light `#E8F0FE`,
> heading `#0B1533`, text `#4A5578`, muted `#8A94AD`, page gradient
> `#F5F8FD → #EAF1FB`, border `rgba(21,101,240,.12)`). Fonts are Plus Jakarta
> Sans (headings) and Inter (body), loaded in `app/layout.tsx`.
>
> - Themes: default (light page), `.theme-glow` (hero bands with a blue
>   radial glow), `.theme-deep` (navy footer and chat header).
> - Utilities: `glass-card` (white 75%, blur 16px, 1px light-blue border,
>   soft shadow), `glass-hover` (5px lift and blue edge glow), `icon-tile`
>   (light-blue rounded square), `section-white` / `section-tint`, `label-mono`
>   (13px uppercase eyebrow).
> - Buttons are pills: primary is solid blue with a blue shadow and a 2px lift;
>   secondary/outline are white with a 1.5px light-blue border.
> - Hero visual: `components/hero/hero-crystal.tsx`, isometric glass cubes and
>   orbit rings in SVG + CSS (frozen under `prefers-reduced-motion`).
> - Small caption text uses `--text-subtle` (`#66718F`, 4.8:1) because
>   `#8A94AD` fails WCAG contrast for text; `#8A94AD` is `--text-faint`, for
>   decorative numerals only.
>
> The sections below describe the earlier "First Light" theme. Its structure
> (components, layout, states) still applies; its colour and type values are
> replaced by the ones above.

## Earlier theme: First Light

The visual language for the Sunrise Tech Origin website. Tokens live in
`app/globals.css` (`:root`, `.theme-night` and `@theme`); this file explains
the decisions behind them and how to use them.

## 1. Positioning and personality

Sunrise Tech Origin is a practical digital partner for small businesses:
websites, technology, marketing and automation from one accountable team.
The site has to feel **premium but approachable**: more considered than a
freelancer, clearer than an agency.

| Trait | Means in the interface |
| --- | --- |
| Calm confidence | Generous whitespace, few colours, one strong idea per section |
| Clarity | Plain-language copy, sentence-case headings, visible prices and steps |
| Warmth | Warm paper instead of clinical white, a soft serif display face |
| Precision | Hairline rules, mono metadata, a strict grid and alignment |

## 2. Concept: night → day

The logo is a sun rising over the name, its rays fanning out from a yellow
crown to orange tips. The site turns that into its structure:

- **Night** (`.theme-night`): every page opens with a deep-navy masthead and a
  sunrise glow on the horizon. Navigation, page heroes, statement bands and the
  footer are night.
- **Day** (default): warm paper sections hold the detail: services, prices,
  process, FAQs and forms. Reading-heavy content is always day.
- **Horizon** (`components/ui/horizon.tsx`): the signature motif. A hairline
  in the sun's yellow → orange, a rising half-sun glow and three
  thinning reflection lines. Used once per page hero and once in the footer
  (the sun setting). Never on text, never as a large background fill.

## 3. Colour

All pairs below were measured (WCAG 2.x relative luminance).

### Day (default, `:root`)

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `--bg` | `#F6F4EF` paper | page background | — |
| `--surface` | `#FFFFFF` | cards, panels, inputs | — |
| `--surface-2` | `#EEEBE4` | quiet bands, wells | — |
| `--line` / `--line-strong` | `#E3DED4` / `#CFC8BA` | hairlines, dividers | decorative |
| `--line-input` | `#8C8676` | form control borders | 3.6:1 on white (1.4.11) |
| `--text` | `#0A1B33` navy ink | headings, body | 15.7:1 |
| `--text-muted` | `#4A5163` | secondary copy | 7.2:1 |
| `--text-subtle` | `#5F6473` | metadata, captions | ≥ 4.9:1 on paper |
| `--brand` | `#0B4F94` logo blue | links, icons, small labels | 7.5:1 |
| `--accent` | `#B4430F` ember | accent words, indices | 5.1:1 |

### Night (`.theme-night`)

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `--bg` | `#0A1B38` deep navy (from the logo) | section background | — |
| `--surface` / `--surface-2` | `#10264A` / `#16305A` | panels | — |
| `--text` | `#F5F7FB` cool white | headings, body | 16:1 |
| `--text-muted` | `#B4C0D6` | secondary copy | 9.3:1 |
| `--text-subtle` | `#93A2BE` | metadata | 6.7:1 (5.1:1 on surface-2) |
| `--brand` | `#8FB2FF` | links, icons | 8.1:1 |
| `--accent` | `#FF9A3D` sun orange | accent words, indices | 8.1:1 |

### Constant roles

| Token | Value | Role |
| --- | --- | --- |
| `--primary` | logo navy `#0B2A55` on day · `#F5F7FB` on night | **every** primary action (label ≥ 12.9:1), with an orange "sun" chip for the arrow |
| `--sun` / `--gold` / `--ember-deep` | `#FD8A0B` / `#FFD922` / `#F26A10` | the logo's sun: horizon, chips, small fills |
| `--whatsapp` | `#128C7E` | WhatsApp teal (white glyph 4.1:1) |
| `--success` / `--warning` / `--danger` | theme-tuned | feedback only |

Rules: actions are navy pills on day and white pills on night, and carry the
orange sun chip, so the call to action echoes the logo. The logo blue is
reserved for links, technology icons and the focus ring. Ember means
"sunrise / growth" (one accent word per heading, indices, the horizon, chips
you select). Gradients are reserved for the emblem and horizon lines (the
horizon hairline, form progress and field focus lines).

## 4. Typography

One typeface everywhere: **Geist** (SIL OFL, self-hosted by `next/font`).
Hierarchy comes from size, weight and tracking, never from a second family.

| Role | Weight | Tracking |
| --- | --- | --- |
| Display and headings (h1, h2, large numerals, prices) | 600 | -0.03 to -0.04em |
| Titles (h3, h4, card titles) | 600 | -0.015em |
| Body | 400, 1.65 line height | normal |
| Labels, eyebrows, indices (`label-mono` utility) | 500, uppercase, 12px | +0.12em |
| Figures | tabular lining numerals (`numeric` utility) | — |

Fluid scale (Tailwind utilities generated from `@theme`):
`text-display-1` 2.75 to 5.5rem · `text-display-2` 2.25 to 4.25rem ·
`text-heading-1` 1.875 to 3.125rem · `text-heading-2` 1.375 to 1.875rem ·
`text-heading-3` 1.25rem · `text-lead` 1.125 to 1.375rem.

- The accent word in a heading is wrapped in `<em>`: same face and weight,
  accent colour, not italic.
- No monospace and no italics: `font-mono` and `font-display` both resolve to Geist.
- Headings are sentence case; uppercase is limited to short labels.
- Body copy never drops below 15px; prose measure is about 65ch.

## 5. Layout

- **Containers:** `container-page` (82rem, fluid gutter 1.25 → 3rem),
  `container-narrow` (48rem) for prose and forms.
- **Grid:** 12 columns from `lg`; editorial splits are 5/7 or 4/8, rarely 6/6.
- **Section rhythm:** `section-y` (5 → 9rem), `section-y-sm` (3.5 → 6rem).
- **Spacing:** Tailwind's 4px scale. Inside components use 2/3/4/6/8/12.
- **Alignment:** left-aligned by default. Centre only short, standalone
  statements (404, empty states).

## 6. Surfaces, borders and depth

| Token | Value |
| --- | --- |
| radii | `--radius-sm` 10px (chips) · `--radius-md` 12px (inputs) · `--radius-lg` 20px (cards) · `--radius-xl` 28px (panels, dialogs) · pill for buttons |
| hairline | 1px `--line`; dividers between list rows rather than boxes where possible |
| shadows (day) | `--shadow-sm` resting card · `--shadow-md` hover / floating · `--shadow-lg` dialogs |
| depth (night) | borders + `--inset-highlight` (top 1px white at 6%) instead of shadows |
| texture | `.grain` adds a 3% film grain to night bands (inline SVG, no request) |

## 7. Components

| Component | File | Notes |
| --- | --- | --- |
| Button | `components/ui/button.tsx` | `primary` ink/paper with ember arrow chip · `secondary` outline · `inverse` · `ghost` · `outline` · `destructive` · `link`; sizes `sm` 40px, `md` 44px, `lg` 52px (all ≥ 24px target). `<ButtonArrow />` becomes the chip (`arrow:` variant) |
| Eyebrow | `components/ui/section-heading.tsx` | mono label with an ember rule and optional index (`01`) |
| SectionHeading | same | `layout="stacked" \| "split"`; split puts the description in the right column |
| PageHero | `components/ui/page-hero.tsx` | night masthead with breadcrumb, h1, lead, actions, aside and horizon |
| Horizon | `components/ui/horizon.tsx` | brand motif; `placement="bottom" \| "top"` |
| Field controls | `.field-control`, `.field-label`, `.field-hint`, `.field-error` | boxed, theme-aware, 48px tall, 16px text on phones (no iOS zoom) — admin and utility forms |
| Line fields | `.field-line`, `.field-float`, `.field-line-bar` | underline input with a floating label; a 2px sunrise line draws in on focus (the focus indicator). Used by the contact form |
| Contact form | `components/contact/contact-form.tsx` | night card in three numbered chapters (details, topic chips, message), sunrise progress line for required fields |
| Accordion | `components/ui/accordion.tsx` | hairline rows, rotating plus |
| Tabs | `components/products/product-showcase.tsx` | WAI-ARIA tabs, underline indicator |
| Dialog / sheet | services modal, mobile menu | paper or night surface, `--radius-xl`, scrim blur |
| Alerts | `.alert` tones, admin `Alert` | icon + text, never colour alone |

## 8. States

Every interactive element defines hover, `:focus-visible` (2px `--focus`
outline, 3px offset), active (pressed scale 0.98 on buttons), disabled
(50% opacity, no pointer events) and, where relevant, loading (`aria-busy`
plus a spinner with a text label), success and error (`role="status"` /
`role="alert"`, an icon, and text).

## 9. Motion

- Ease `--ease-out` (0.16, 1, 0.3, 1), durations 160 / 280 / 600 / 900ms.
- Scroll reveals (`data-reveal`) fade up 16px once; the hero sun rises once on
  load. Nothing loops except the hero workflow demo, which stops for
  reduced-motion users.
- `prefers-reduced-motion: reduce` removes movement while keeping layout.

## 10. Logo, imagery and icons

- **Logo** (`components/brand/logo.tsx`): vector artwork in `logo-art.ts`,
  traced from the official logo (sun fitted geometrically, "Sunrise" traced
  with smooth curves, "TECH ORIGIN" set in Geist Medium). `<Logo />` is the
  horizontal lockup used in the navigation (sun base on the wordmark
  baseline, sized with font-size), `<LogoFull />` the original stacked logo
  (footer, admin sign-in), `<SunMark />` the sun alone. The wordmark is navy
  on day and white inside `.theme-night`; the sun keeps its colours. Keep
  clear space of at least the height of "TECH ORIGIN" around it.
- **Brand files**: `node --experimental-strip-types scripts/generate-logo-assets.mjs`
  renders the SVGs, 2400 px transparent PNGs, profile pictures, cover and
  favicon in `public/brand/` and `app/icon.svg` from the same vectors.

- No stock photography: the work is shown through realistic product mockups
  (`components/products/mockups.tsx`) and the brand emblem.
- Icons: Lucide at 1.75 stroke, 16–20px, always paired with text or an
  accessible label. Brand glyphs come from `lib/brand-icons.ts`.
