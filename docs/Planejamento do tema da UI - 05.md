Learn:

Nice, we’re building your **Antique UI Kit** now.
Think of this as your **design system spec**: naming, tokens, and component behavior, ready to turn into Tailwind/CSS/React in Cursor.

I’ll structure it like this:

1. Design tokens (colors, typography, spacing, radii, shadows)
2. Naming scheme
3. Core primitives (layout, surface, typography)
4. Controls (buttons, inputs, dropdowns, toggles)
5. Data display (cards, lists, tables, badges)
6. Thematic components (TomeCard, Marginalia, Ledger, WaxSeal, InkProgressBar, etc.)

You can treat this as the “Antique Academia Design System”.

---

## 1️⃣ Design Tokens

Use these as CSS variables, Tailwind theme config, or a `theme.ts`.

### 🎨 Colors

**Namespace suggestion:** `--aa-*` (Antique Academia)

```text
--aa-bg-parchment:   #F5ECD4;
--aa-bg-paper:       #FAF3E0;
--aa-bg-leather:     #2C2622;
--aa-bg-ink-stone:   #1F1A17;

--aa-text-ink:       #3B2F2F;
--aa-text-sepia:     #6B4E3D;
--aa-text-muted:     #BFA88B;
--aa-text-on-dark:   #EEE6D8;

--aa-border-parch:   #E0D5BE;
--aa-border-mahog:   #4A3B31;

--aa-accent-gold:    #C9A242;
--aa-accent-brass:   #C29E45;
--aa-accent-burg:    #8B2E3C;
--aa-accent-burg-dark: #7A1D1D;

--aa-success:        #4E6E4E;
--aa-warning:        #E7A637;
--aa-error:          #7A1D1D;
```

If using Tailwind, these map nicely to `colors.aa.*`.

---

### 🖋 Typography

**Font families:**

```text
--aa-font-heading: "Cormorant Garamond", "Crimson Text", serif;
--aa-font-body:    "Literata", "Merriweather", serif;
--aa-font-mono:    "JetBrains Mono", "iA Writer Mono", monospace;
```

**Sizes (you can adapt to rem):**

```text
--aa-font-size-xs:   0.75rem;
--aa-font-size-sm:   0.875rem;
--aa-font-size-md:   1rem;
--aa-font-size-lg:   1.25rem;
--aa-font-size-xl:   1.5rem;
--aa-font-size-2xl:  1.875rem;
--aa-font-size-3xl:  2.25rem;
```

**Line-height:**

```text
--aa-leading-tight: 1.3;
--aa-leading-normal: 1.5;
--aa-leading-reading: 1.75;  // use for long text
```

---

### 📏 Spacing & Radii

```text
--aa-space-1: 0.25rem;
--aa-space-2: 0.5rem;
--aa-space-3: 0.75rem;
--aa-space-4: 1rem;
--aa-space-6: 1.5rem;
--aa-space-8: 2rem;
--aa-space-10: 2.5rem;
--aa-space-12: 3rem;

--aa-radius-none: 0;
--aa-radius-sm:   4px;
--aa-radius-md:   8px;
--aa-radius-lg:   12px;
--aa-radius-pill: 999px;
```

Cards should mostly use `md`, buttons `pill`/`md`, inputs `sm`.

---

### 🌫 Shadows & Effects

We want subtle, physical shadows (book on desk, card on paper).

```text
--aa-shadow-soft: 
  0 2px 6px rgba(0,0,0,0.08);

--aa-shadow-elevated:
  0 8px 16px rgba(0,0,0,0.18);

--aa-shadow-pressed:
  inset 0 1px 2px rgba(0,0,0,0.25);
```

Use `soft` on cards, `elevated` on modals / spotlight, `pressed` for toggled buttons.

---

## 2️⃣ Naming Scheme

**Prefix everything with `Antique` or `AA`**, and for themed components use domain names:

* Primitives: `AABox`, `AAStack`, `AAHeading`, `AAParagraph`
* Controls: `BrassButton`, `QuillSearchBar`, `ScrollInput`, `BrassSelect`
* Cards: `TomeCard`, `MarginaliaCard`, `QuestCard`, `LedgerRow`
* Status: `WaxSealBadge`, `RibbonBookmark`, `BrassTag`
* Data: `InkProgressBar`, `AntiqueHeatmap`, `SpineBarChart`

CSS class naming suggestion:

* `.aa-button`, `.aa-button--brass-primary`
* `.aa-card`, `.aa-card--parchment`, `.aa-card--ledger`
* `.aa-input`, `.aa-input--scroll`
* `.aa-sidebar`, `.aa-sidebar-item`, `.aa-sidebar-item--active`

---

## 3️⃣ Core Primitives

### 🧱 3.1 Container / Layout

**Component:** `AAContainer`, `AAStack`, `AASection`

**CSS description:**

* `AAContainer`

  * max-width: 1200–1400px; margin-inline: auto; padding: `var(--aa-space-8)`
  * background: `var(--aa-bg-parchment)`
* `AAStack`

  * flex-direction: column; `gap: var(--aa-space-4)` or `6`
* `AASection`

  * padding: `var(--aa-space-6)`
  * border-radius: `var(--aa-radius-md)`
  * background: `var(--aa-bg-paper)`
  * box-shadow: `var(--aa-shadow-soft)`

These are your generic building blocks.

---

### 📝 3.2 Typography Primitives

**Components:**

* `AAHeading` (`variant`: h1, h2, h3)
* `AAParagraph`
* `AAKicker` (small label above titles)
* `AAMetaText` (for timestamps, page numbers)

**CSS:**

* `AAHeading[h1]`

  * font-family: `var(--aa-font-heading)`
  * font-size: `var(--aa-font-size-3xl)`
  * font-weight: 600–700
  * color: `var(--aa-text-ink)`

* `AAParagraph`

  * font-family: `var(--aa-font-body)`
  * line-height: `var(--aa-leading-reading)`
  * color: `var(--aa-text-ink)`

* `AAMetaText`

  * font-size: `var(--aa-font-size-xs)` or `sm`
  * color: `var(--aa-text-sepia)`
  * text-transform: uppercase; letter-spacing: 0.08em

---

### 🪵 3.3 Surface / Card

**Component:** `AACard`

Variants:

* `parchment` (default)
* `ledger` (for logbook rows)
* `shelf` (for book grid context)

**CSS description:**

```text
background: var(--aa-bg-paper);           // or leather for dark
border-radius: var(--aa-radius-md);
border: 1px solid var(--aa-border-parch);
box-shadow: var(--aa-shadow-soft);
padding: var(--aa-space-4) var(--aa-space-5);
```

On hover:

```text
transform: translateY(-1px);
box-shadow: var(--aa-shadow-elevated);
```

---

## 4️⃣ Controls

### 🔘 4.1 Buttons

**Components:**

* `BrassButton` (primary)
* `GhostButton` (secondary, subtle)
* `QuillIconButton` (round, icon-only)

**BrassButton (primary)**

* Background: `var(--aa-accent-gold)`
* Text: `var(--aa-bg-ink-stone)` or `var(--aa-text-ink)`
* Border: `1px solid var(--aa-accent-brass)`
* Radius: `var(--aa-radius-pill)`
* Padding: `0.5rem 1.25rem`
* Font: body, medium weight (500)

Hover:

* background: slightly darker gold
* subtle inner highlight (simulate metal)

Active:

* `box-shadow: var(--aa-shadow-pressed)`
* slightly lowered brightness

**GhostButton**

* Transparent background
* Border: `1px solid rgba(0,0,0,0.08)` or `var(--aa-border-parch)`
* Text: `var(--aa-text-sepia)`
* Use for “Secondary actions” like “View all entries”.

---

### ✒ 4.2 Inputs — “ScrollInputs”

**Component:** `ScrollInput` (text input), `QuillSearchBar`

**ScrollInput CSS:**

* Background: `var(--aa-bg-paper)`
* Border: 1px solid `var(--aa-border-parch)`
* Border-bottom: 2px solid `var(--aa-border-mahog)` (gives manuscript feel)
* Radius: `var(--aa-radius-sm)`
* Padding: `0.5rem 0.75rem`
* Font: body serif
* Placeholder: `color: rgba(107,78,61, 0.7)` (muted sepia)

Focus:

* border-color: `var(--aa-accent-gold)`
* box-shadow: 0 0 0 1px `rgba(201,162,66,0.2)` (soft glow)

**QuillSearchBar**

* Same as `ScrollInput` but:

  * left padding extra for icon
  * contains a quill icon inline
  * width: 100% or max 480px

---

### 🔽 4.3 Select / Dropdown — “BrassSelect”

**Component:** `BrassSelect`

CSS description:

* Container styled like button + input hybrid:

  * background: `var(--aa-bg-paper)`
  * border: 1px solid `var(--aa-border-parch)`
  * padding: `0.45rem 0.75rem`
  * right side: small down-chevron, brass color
* Options panel:

  * background: `var(--aa-bg-paper)`
  * border-radius: `var(--aa-radius-md)`
  * border: 1px solid `var(--aa-border-mahog)`
  * subtle shadow

Hover an option:

* background: `rgba(201,162,66,0.1)` (gold hint)
* text: `var(--aa-text-ink)`

---

### 🕯 4.4 Switch / Toggle — “CandleToggle”

Light/dark or feature toggles.

CSS:

* Track:

  * width: 42px, height: 22px
  * border-radius: `var(--aa-radius-pill)`
  * background: `#D8C9A6` (off), `#C9A242` (on)
* Thumb:

  * circle, 18px, background: `#FAF3E0`
  * box-shadow: `var(--aa-shadow-soft)`
* On state: subtle glow around track (candle effect).

---

## 5️⃣ Data Display

### 📚 5.1 TomeCard (Book Card)

**Component:** `TomeCard`

Props: `cover`, `title`, `author`, `status`, `progress`, `tags`.

CSS:

* Outer: `AACard` with extra vertical padding
* Cover on left (fixed width)
* Right side: text stack:

  * Title: heading serif
  * Author: italic body
  * Meta: `AAMetaText`
* Progress row:

  * `InkProgressBar`
  * Status badge (RibbonBookmark)

Hover:

* Slight scale: `transform: translateY(-1px) scale(1.01)`
* Shadow: `var(--aa-shadow-elevated)`

---

### 📄 5.2 MarginaliaCard (Note Card)

**Component:** `MarginaliaCard`

CSS:

* Background: parchment variant with faint lines
* Border: 1px dashed `var(--aa-border-parch)`
* Top line:

  * page number in decorative small serif
  * book title (small)
* Body: note text
* Tags: `BrassTag` chips

---

### 📜 5.3 LedgerRow (Session Row)

**Component:** `LedgerRow`

CSS:

* Full-width row
* Background: `var(--aa-bg-paper)`
* Border-bottom: 1px solid `var(--aa-border-parch)`
* On hover: soft highlight `rgba(201,162,66,0.07)`

Columns:

* Date: `AAMetaText` with tiny ornamental underline
* Book: book icon + title
* Pages: `“12 → 34”` with small page icon
* Duration: hourglass icon + text
* Notes: truncated marginalia preview

---

### 🕯 5.4 WaxSealBadge / Achievement

**Component:** `WaxSealBadge`

Variants: `bronze`, `silver`, `gold`, `burgundy`.

CSS:

* Shape: circle 40–56px
* Background: gradient circle with noise (simulate wax)
* Text: monogram/short label in center (e.g., “10B”, “30D”)
* Shadow: `var(--aa-shadow-elevated)`
* Optionally a tiny “pressed” bevel (pseudo-element with inset shadow)

---

### 🧪 5.5 InkProgressBar

**Component:** `InkProgressBar`

CSS:

* Container: full-width, 4–6px height, radius 999px
* Background: `rgba(0,0,0,0.06)` on light; `rgba(255,255,255,0.08)` on dark
* Fill:

  * background: linear gradient (dark ink to slightly lighter ink)
  * subtle irregular edge: can be simulated with a background image/pattern
* Animation:

  * on change, animate width with `cubic-bezier(0.4, 0, 0.2, 1)` over 300ms

---

### 🗂 5.6 BrassTag (for tags & statuses)

**Component:** `BrassTag`

CSS:

* Background: `rgba(201,162,66,0.15)` or `rgba(139,46,60,0.12)` for burgundy variant
* Border: 1px solid `var(--aa-accent-gold)`
* Radius: `var(--aa-radius-pill)`
* Padding: `0.15rem 0.55rem`
* Font-size: `var(--aa-font-size-xs)`
* Letter-spacing: slight positive
* Text-transform: uppercase

---

## 6️⃣ Thematic Components Summary (Naming + Purpose)

You can define this as your kit list:

* **Layout**

  * `AAContainer`, `AASection`, `AAStack`, `AASidebar`, `AATopBar`

* **Typography**

  * `AAHeading`, `AAParagraph`, `AAMetaText`, `AALabel`

* **Controls**

  * `BrassButton`, `GhostButton`, `QuillIconButton`
  * `ScrollInput`, `QuillSearchBar`
  * `BrassSelect`
  * `CandleToggle`

* **Data & Display**

  * `AACard`
  * `TomeCard` (books)
  * `MarginaliaCard` (notes)
  * `LedgerRow` (sessions list)
  * `WaxSealBadge` (achievements)
  * `InkProgressBar`
  * `BrassTag`

* **Advanced (for later)**

  * `AntiqueHeatmap`
  * `SpineBarChart`
  * `QuestCard` (goals)
  * `BookOfTheYearCard`

---

If you want next, I can:

* Turn this into **Tailwind config + example JSX** for a couple of components (`BrassButton`, `TomeCard`, `InkProgressBar`), or
* Create a **full “Antique Design System” markdown** you can drop into your repo as `/docs/design-system.md`.

 