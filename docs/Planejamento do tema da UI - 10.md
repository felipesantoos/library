Understood, Felipe — here is **the official Antique Visual Style Guide**, fully consistent with the UI kit + components + screens you selected.
This is the version you can treat as canonical in the project — a designer-level reference.
It is written in a highly structured, professional format so Cursor can consume it.

---

# 📜 **THE ANTIQUE VISUAL STYLE GUIDE**

### *For the Reading Journal Desktop Application*

**Aesthetic:** *Antique Library × Minimal Productivity × Literary Precision*

---

# 1️⃣ **Design Philosophy**

### 🕯 Core Themes

* A warm, scholarly, timeless atmosphere
* Inspired by medieval manuscripts, Renaissance libraries, old atlases, and monastery scriptoria
* Modern minimal UI hidden under classic textures
* Interface feels like vellum, brass, ink, wax, linen

### 🎼 Emotional Tone

* Calm
* Slow
* Contemplative
* Intimate
* Literary

### 🔮 Pillars

* Low visual noise
* Strong typographic identity
* Paper-like surfaces
* Subtle ornamentation
* No skeuomorphism overload
* No modern “glassmorphism” or neon

---

# 2️⃣ **Color System**

Colors are warm, subdued, and textured — no bright digital saturation.

## 🌞 LIGHT THEME — “Antique Manuscript”

| Role                | Color           | HEX       | Notes                      |
| ------------------- | --------------- | --------- | -------------------------- |
| Background          | Parchment Light | `#F8F3E8` | Paper base                 |
| Surfaces            | Linen White     | `#FAF7EF` | Cards/panels               |
| Borders             | Raw Umber       | `#C8BBA4` | Soft shadowed              |
| Primary Text        | Deep Sepia      | `#3C2F2F` | Reading-focused            |
| Secondary Text      | Warm Taupe      | `#6B5E54` | Metadata                   |
| Accents (Primary)   | Royal Blue Ink  | `#2E4A78` | Links, actions             |
| Accents (Secondary) | Antique Brass   | `#B28A4A` | Buttons, highlights        |
| Highlights          | Veil Gold       | `#E2C77E` | Badges, progress           |
| Error               | Wax Red         | `#A6453E` | Manuscript correction tone |
| Success             | Laurel Green    | `#6E8C5E` | Soft checkmarks            |

---

## 🌙 DARK THEME — “Candlelit Study”

| Role                | Color            | HEX       | Notes               |
| ------------------- | ---------------- | --------- | ------------------- |
| Background          | Night Leather    | `#1A1410` | Deep and warm       |
| Surfaces            | Smoked Parchment | `#27211D` | Raised areas        |
| Borders             | Charred Umber    | `#3A302A` | Subtle frames       |
| Primary Text        | Aged Ivory       | `#EDE5CF` | Candlelit white     |
| Secondary Text      | Dusty Clay       | `#C0B099` | Metadata            |
| Accents (Primary)   | Sapphire Ink     | `#6D88C2` | Reflective ink      |
| Accents (Secondary) | Molten Brass     | `#D1A95A` | Buttons, borders    |
| Highlights          | Wax Yellow       | `#EED595` | Illuminated focus   |
| Error               | Ember Red        | `#B75A4A` | Warm failure tone   |
| Success             | Herbal Green     | `#88A46C` | Subdued and organic |

---

# 3️⃣ **Typography System**

### **Primary Typeface — *“Literata”***

📚 Google’s official book-reading serif
Warm. Literary. Elegant.
Perfect for long reading and antique ambiance.

### **Secondary Typeface — *“Inter”***

For UI labels, metadata, small elements.

### **Optional Decorative Type — *“Cormorant Garamond”***

Used *sparingly* for titles or quotes.

---

### 📐 Type Scale

| Use                         | Font           | Size     | Weight  | Line Height |
| --------------------------- | -------------- | -------- | ------- | ----------- |
| H1 (Page Title)             | Literata       | 28–32px  | 700     | 1.3         |
| H2 (Section Title)          | Literata       | 22–24px  | 600     | 1.35        |
| H3 (Card Title)             | Literata       | 18–20px  | 600     | 1.35        |
| Body (Primary)              | Literata       | 16px     | 400     | 1.6         |
| Body (Secondary)            | Inter          | 14px     | 400     | 1.55        |
| Caption / Metadata          | Inter          | 12px     | 400     | 1.45        |
| Monospaced Timer (optional) | JetBrains Mono | variable | 400–500 | N/A         |

---

# 4️⃣ **Texture & Materials**

### Surface Treatments:

* subtle grain — like old canvas or linen
* ultra-low opacity noise overlay
* paper edges: tiny shadows but no hard borders
* only **one** ornamental corner or divider per page: avoid overdecorating

### Icon styling:

* thin ink strokes
* slight irregularity (optional filter)
* 1.5–1.75px stroke mimicking quill pressure

---

# 5️⃣ **Component Design Specifications**

Below is the *official antique kit style* for all core components.

---

## 🟫 Buttons (BrassButton / GhostButton / InkButton)

### **BrassButton**

* Background: `Antique Brass`
* Text: `Dark Sepia`
* Border: 1px, darkened brass
* Radius: 4px
* Shadow: tiny inner highlight, almost imperceptible
* Hover: slightly darker brass (`#9C763E`)
* Active: pressed inward (inner shadow increases)

### **GhostButton**

* Transparent background
* Text: `Royal Blue Ink`
* Border: 1px raw umber
* Hover: thin parchment tint background

### **InkButton (Primary Action)**

* Background: `Royal Blue Ink`
* Text: `Aged Ivory`
* Hover: dark sapphire
* Active: deeper shadow

---

## 📜 Inputs (ScrollInput)

* Background: parchment (`#FAF7EF`)
* Border: 1px raw umber
* Radius: 6px
* Focus outline: thin blue ink glow (`#2E4A7844`)
* Placeholder: taupe (`#6B5E5488`)
* Shadows: extremely soft

---

## 📘 Cards (TomeCard / AACard / MarginaliaCard)

### **TomeCard** (books)

* Slight edge texture
* Cover inside inset frame
* Title in Literata
* Progress bar = **ink stroke** (2px)

### **AACard** (generic panels)

* Linen surface
* Thin umber border
* Light book-shadow

### **MarginaliaCard** (notes, journal entries)

* Looks like a margin note or scrap
* Tear/texture line on left side (subtle!)
* Optional small ornament like a curled corner

---

## 🧾 Lists

### **LedgerTable**

* Alternating parchment rows
* Headings in Inter, uppercase, tracking +2
* Column dividers = thin quill lines
* Row hover = faint yellow glow (`#EED59522`)

### **TomeList**

* Vertical list with tiny book icon or miniature cover
* Separator = dotted line (ink style)

---

## 🔍 Search Bar (ScriptoriumSearch)

* Rounded rectangle with linen tone
* Ink quill icon (left)
* Focus: candle glow around border
* Placeholder looks slightly faded like ink on old paper

---

## 🕯 Toggles (CandleToggle)

* Slider track: brass rail (`#B28A4A`)
* Thumb: wax bead (round, pale yellow)
* ON state: warm glow behind bead
* OFF: muted parchment brown

---

# 6️⃣ **Layout Structure & Spacing**

### Sidebar Width: **68–72px**

Icons only or icons + tiny labels.

### Card Padding: **16–20px**

Top-level panels: **24px**

### Vertical Rhythm:

* Section spacing: **24–32px**
* Space between elements: **12–16px**

### Grid:

* 12-column layout
* antique style = wide margins left/right
* content should “float” on parchment, never edge-to-edge

---

# 7️⃣ **Screen Composition Rules**

### 🔹 Home

Uses:

* TomeCard
* AACard
* BrassButton
* CandleToggle (daily goal)
* Ledger-like stats panels

### 🔹 Library (Bookshelf)

Uses:

* TomeCard in grid
* Filters in MarginaliaCard
* ScriptumSearch

### 🔹 Book Details

Uses:

* H1 Literata
* Progress Ink Bar
* Session list (Ledger)
* Notes (MarginaliaCard)

### 🔹 Journal

Uses:

* MarginaliaCard
* ScrollInput (big writing area)
* Decorative initial-drop-cap (optional!)

### 🔹 Settings

Uses:

* Ledger layout
* CandleToggle
* BrassButton for backup/export

---

# 8️⃣ **Iconography**

Consistent with the antique theme:

### Style:

* thin quill-like outlines
* gentle imperfections
* stroke 1.6px
* round caps
* no fills except minimal touches

### Recommended libraries:

* Lucide (custom stroke)
* HeroIcons (restyled)
* Your custom SVG quill-set (I can generate!)

---

# 9️⃣ **Microinteractions**

### Animations must feel like:

* turning a page
* lighting a candle
* sliding a drawer

### Examples:

* Hover = parchment warms subtly
* Button press = slight inward emboss
* New note = slides in like a bookmark
* Progress = ink stroke animates left→right
* Modal opening = soft fade + scale 0.97→1.0

Duration: **150–200ms**

---

# 🔟 **Accessibility**

* High contrast parchment mode
* Font-size scaling across all text
* Dark mode designed first (reading comfort)
* Reduced motion option
* Ensure no pure black/white (reduce eye strain)

---

# 🔮 **Summary: Antique DNA**

**Warm parchment + brass + ink + serif typography + quiet shadows + soft quill lines + subtle textures + slow, meditative interactions = the perfect Antique Reading UI.**

---

If you want, I can now generate:

### 📘 Full-color mockups (ASCII style or description-based)

### 📦 Component code stubs using your Antique kit

### 🎨 A downloadable style guide (PDF layout)

### 🔧 A JSON file describing the entire theme for Cursor

Just tell me which one you want next.
