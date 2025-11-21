Love this direction. Let’s turn the antique theme into a **concrete component kit** you can hand to Cursor and start implementing.

I’ll keep it **structured + implementation-friendly**, but still thematic.

---

# 🧱 0. Structure of the Kit

I’ll group components as:

1. Buttons
2. Inputs & Filters
3. Cards (books, notes, generic)
4. Lists & Tables
5. Navigation
6. Status & Feedback
7. Metrics (progress, stats)

Each component will have:

* **Name**
* **Purpose**
* **Props (conceptual)**
* **Visual / behavior notes**

You can turn each block into React/Tailwind easily.

---

## 1️⃣ Buttons

### 1.1 `BrassButton`

**Purpose:** Primary action button everywhere (e.g. “Resume the chapter”, “Inscribe new session”).

**Props (conceptual):**

* `variant`: `"primary" | "secondary" | "danger"`
* `size`: `"sm" | "md" | "lg"`
* `iconLeft?`, `iconRight?`
* `fullWidth?`
* `loading?`, `disabled?`

**Visual:**

* Background: brass/gold (`aa-accent-gold`)
* Text: dark ink
* Border: thin, slightly darker brass
* Radius: pill
* Hover: warmer gold, subtle glow
* Active: slight “pressed” inset feel

---

### 1.2 `GhostButton`

**Purpose:** Secondary actions, filters, low emphasis (“View all sessions”, “Cancel”).

**Props:**

* `variant`: `"outline" | "ghost"`
* `size`
* `icon?`

**Visual:**

* Transparent background
* Thin sepia or parchment border
* Text in sepia
* Hover: light parchment fill

---

### 1.3 `QuillIconButton`

**Purpose:** Small icon-only actions (search, close, bookmark).

**Props:**

* `icon`
* `size`: `"sm" | "md"`
* `ariaLabel`

**Visual:**

* Circular or rounded square
* Slight parchment fill
* Icon in brass or ink
* Hover: subtle brass halo

---

## 2️⃣ Inputs & Filters

### 2.1 `ScrollInput`

**Purpose:** Text input (title, author, tags, page number, etc.).

**Props:**

* `label`
* `placeholder`
* `value`
* `type`: `"text" | "number" | ..."`
* `error?`, `helperText?`
* `iconLeft?` (optional)

**Visual:**

* Background: ivory paper
* Border: 1px parchment + 2px slightly darker bottom border (manuscript vibe)
* Radius: small
* Focus: gold border + soft glow

---

### 2.2 `QuillSearchBar`

**Purpose:** Prominent search in top bar / library.

**Props:**

* `placeholder`
* `value`
* `onChange`
* `onSubmit`

**Visual:**

* Same base as `ScrollInput`
* Left-aligned quill icon inside
* Slightly larger width and padding
* Could be globally reused as a search component

---

### 2.3 `BrassSelect`

**Purpose:** Choose status, filter lists, pick sort order.

**Props:**

* `label`
* `options: {label, value}[]`
* `value`
* `onChange`
* `size?`

**Visual:**

* Looks like a subtle button with chevron
* Background: parchment
* Border: parchment/mahogany blend
* Options dropdown: parchment with thin mahogany border; hovered option has light gold wash

---

### 2.4 `CandleToggle`

**Purpose:** On/off toggles (theme, immersion mode, high-focus mode).

**Props:**

* `checked`
* `onChange`
* `label?`
* `description?`

**Visual:**

* Track: candle wax color, rounded; becomes gold when on
* Thumb: little ivory circle
* On state: faint candle glow around track

---

## 3️⃣ Cards

### 3.1 `TomeCard`

**Purpose:** Display a book in lists/grids (library, suggestions, current tome).

**Props:**

* `cover`
* `title`
* `author`
* `status` (`"not_started" | "reading" | "paused" | "abandoned" | "completed" | "rereading"`)
* `progressPercent`
* `tags?` (genres, year, custom tags)
* `onClick`
* `isCurrent?`

**Visual:**

* `AACard` base with parchment + soft shadow
* Left: cover image (or stylized spine)
* Right: text stack:

  * Title (serif, slightly larger)
  * Author (italic)
  * Meta (pages, type, status)
* Bottom: `InkProgressBar` + small `BrassTag` for status
* If current: burgundy ribbon badge on top corner

---

### 3.2 `TomeCardLarge`

**Purpose:** Big featured card for “Current book” on Home.

**Props:** Same as `TomeCard` + optional CTA.

**Visual:**

* Expanded layout
* Cover larger
* Includes CTA `BrassButton`: “Resume the chapter”
* Could show last session info inline

---

### 3.3 `MarginaliaCard`

**Purpose:** Shows one note/annotation.

**Props:**

* `bookTitle`
* `page`
* `excerpt?`
* `noteText`
* `sentimentTag?` (`"inspiration" | "doubt" | "reflection" | "learning"`)
* `createdAt`
* `onClick`

**Visual:**

* Looks like a clipped notepaper:

  * parchment background
  * faint horizontal lines
* Top row: book title + page in decorative meta text
* Body: note text
* Bottom: `BrassTag` for sentiment, timestamp

---

### 3.4 `QuestCard`

**Purpose:** Represents a goal/quest (monthly pages, yearly books).

**Props:**

* `title`
* `description?`
* `target`
* `current`
* `unit` (`"pages" | "books" | "minutes"`)
* `progressPercent`
* `status` (`"in_progress" | "completed" | "failed"`)

**Visual:**

* Parchment card with decorative header
* `InkProgressBar` with value annotation
* Optionally a tiny wax seal when completed

---

### 3.5 `AACard` (generic)

**Purpose:** Base surface for any content (statistics, sections, etc.).

**Props:**

* `variant`: `"parchment" | "leather" | "transparent"`
* `elevation`: `"none" | "soft" | "high"`

Use as the base wrapper for almost everything.

---

## 4️⃣ Lists & Tables

### 4.1 `TomeList`

**Purpose:** Vertical list of books (with sorting & filters).

**Props:**

* `items: TomeCard[]`
* `layout`: `"list" | "grid" | "spine"`

Visual: just composes `TomeCard` or a more compact variant with minimal border, plus:

* Header row with filters (status, type, tags)
* Option for spine view = narrow, spine-style cards

---

### 4.2 `LedgerTable`

**Purpose:** Table of reading sessions (logbook view).

**Props:**

* Rows: `{date, book, pagesStart, pagesEnd, duration, note?}`
* `onRowClick?`
* Filter options (date range, book, etc.)

**Visual:**

* Looks like an antique ledger:

  * leather or deep parchment background
  * each row on a slightly lighter strip
* Columns:

  * Date (with tiny underline flourish)
  * Book title with small book icon
  * `pagesStart → pagesEnd`
  * Duration with hourglass icon
  * Small note preview

---

### 4.3 `MarginaliaList`

**Purpose:** List or grid of notes.

**Props:**

* `items` (MarginaliaCard props)
* Filters: book, tag, sentiment

**Visual:** Grid of `MarginaliaCard`s; can switch to list view.

---

### 4.4 `AchievementGrid`

**Purpose:** Show wax seal achievements.

**Props:**

* `achievements: {label, description, level, achievedAt?}[]`

**Visual:**

* Grid, each cell:

  * `WaxSealBadge`
  * label below in small serif
  * optional description

---

## 5️⃣ Navigation

### 5.1 `AASidebar`

**Purpose:** Main navigation across sections.

**Props:**

* `items: {icon, label, route, isActive}[]`
* `onSelect(route)`

**Visual:**

* Vertical stack on parchment background
* Icons monochrome (ink / brass)
* Active item:

  * light gold highlight
  * left border accent
  * maybe tiny bookmark icon

---

### 5.2 `SidebarItem`

**Purpose:** Single item in sidebar.

**Props:**

* `icon`
* `label`
* `isActive`
* `onClick`

---

### 5.3 `AATabs`

**Purpose:** Secondary navigation within a page (e.g. Stats: “Overview”, “Yearly”, “Genres”).

**Props:**

* `tabs: {id, label}`
* `activeTabId`
* `onChange(id)`

**Visual:**

* Parchment strip with tab labels
* Active tab:

  * underline (ink or gold)
  * mild embossed effect

---

## 6️⃣ Status & Feedback

### 6.1 `BrassTag`

**Purpose:** Small label for status, type, genre, sentiment.

**Props:**

* `variant`: `"status" | "genre" | "sentiment"`
* `tone`: `"gold" | "burgundy" | "green" | "neutral"`
* `children` (text)

**Visual:**

* Pill shape
* Thin brass border
* Light fill color depending on tone
* Uppercase small text

---

### 6.2 `RibbonBookmark`

**Purpose:** Highlight current book, important status.

**Props:**

* `position`: `"top-left" | "top-right"`
* `tone`: `"burgundy" | "gold"`

**Visual:**

* Little ribbon triangle overlapping corner of `TomeCard`.

---

### 6.3 `WaxSealBadge`

(Already described above, but as a core component.)

**Purpose:** Achievements, “completed” markers, special status.

**Props:**

* `label` (short)
* `variant`: `"gold" | "bronze" | "burgundy"`
* `size?`

---

### 6.4 `AAToast`

**Purpose:** Quick notifications (“Session recorded”, “Tome added to shelf”).

**Props:**

* `type`: `"success" | "info" | "warning" | "error"`
* `message`
* `description?`

**Visual:**

* Small parchment card
* Left border colored (green, gold, amber, red)
* Optional small icon (quill for info, wax seal for success, caution triangle for warning)

---

### 6.5 `AAModal`

**Purpose:** Confirmations, detailed views (e.g. view full note, import/export).

**Props:**

* `title`
* `children`
* `primaryAction`
* `secondaryAction?`
* `onClose`

**Visual:**

* Centered card on dimmed background
* Looks like an open folio page
* Maybe a subtle drop shadow like a floating paper over desk

---

## 7️⃣ Metrics & Visualizations

### 7.1 `InkProgressBar`

**Purpose:** Progress of book, goals, periods.

**Props:**

* `value` (0–100)
* `label?` (“56% of this tome”, etc.)
* `size`: `"sm" | "md" | "lg"`

---

### 7.2 `ReadingHeatmap`

**Purpose:** GitHub-style calendar of reading days.

**Props:**

* `data: {date, intensity}`

**Visual:**

* Grid of small squares
* Each square looks like a tiny manuscript stamp (ink density = intensity)

---

### 7.3 `GenreBarChart`

**Purpose:** Show genre distribution.

**Props:**

* `data: {genre, count}`

**Visual:**

* Bars look like book spines
* Colors: muted variants of gold/green/burgundy
* No heavy axes, minimalist labels

---

## 🔚 Wrap-up

You now have a **coherent Antique UI Kit** with:

* Naming scheme
* Conceptual props
* Visual and behavior guidance

Next steps (your choice, and I can do it in the next message):

1. Turn 3–4 of these into **actual JSX + Tailwind skeletons** (e.g. `BrassButton`, `TomeCard`, `ScrollInput`, `InkProgressBar`), OR
2. Generate a **`DESIGN_SYSTEM.md`** spec from all this, ready to drop into your repo, OR
3. Create a **component map** (which screens use which components, to guide implementation order).
