Great, Sheldon here dropping the official spec of your "Readings Desktop 1.0" 😄
I'll create the **screen list + description of each**, already thinking about something natural for a desktop app (like Notion / Obsidian / Spotify).

I'll mark the screens with:

* `[MVP]` = in minimum scope
* `[Advanced]` = for later, but already designed

---

## 🧭 General navigation structure

Think of the main window like this:

* **Left sidebar** with sections:

  * Home
  * Library
  * Sessions
  * Notes
  * Goals & Statistics
  * Agenda
  * Reports
  * Settings
* **Fixed top** with:

  * Global search field
  * Quick shortcuts (Add book, Start session)
  * Today's progress indicator
* **Central area** where each screen below is displayed.

---

# 🔧 COMPLETE SCREEN LIST

---

## 1. Home / Dashboard Screen [MVP]

**Suggested name:** `Home`

**Objective:** Be the daily "command panel".

**Main content:**

* "Current Book" section

  * Cover, title, author
  * Progress (bar + current page / total)
  * "Continue reading" button (opens book screen or starts session)
* "Today's progress"

  * Time read today
  * Pages read today
* "Monthly goal"

  * Pages or books goal
  * % completed indicator
* "Suggestion of the day"

  * Can be:

    * Continuation of current book
    * "Book of the week" chosen from shelf
* Mini-week summary

  * How many sessions
  * Days you read

**Main actions:**

* Add new book
* Start new session
* Shortcuts to Library, Sessions, Goals

---

## 2. Library Screen (List / Grid) [MVP]

**Suggested name:** `Library`

**Objective:** View and organize all reading materials.

**Main content:**

* List or grid of books (cover, title, author, status, type).
* Filters:

  * Status: not started, reading, paused, completed, abandoned, reread.
  * Type: physical book, ebook, audiobook, article, PDF, comic, etc.
  * Tags (e.g.: 2025, science fiction).
* Sorting:

  * Title
  * Addition date
  * Completion date
  * Progress
  * Number of pages
* Views:

  * Cover grid
  * Detailed list
  * Large cards

**Main actions:**

* Add new book.
* Open book details.
* Mark status (Ex.: click status and change to "Reading").
* Send book to:

  * Archive
  * Wishlist
  * "Plan to read in the future"

---

## 3. Book Details Screen [MVP]

**Suggested name:** `Book Details`

**Objective:** Be the "hub" for everything related to a specific book.

**Main sections:**

1. **Header**

   * Cover, title, author, genre, type.
   * Current status.
   * Current page / total.
   * Progress in %.

2. **Progress**

   * Progress bar.
   * Progress graph over time (simple in MVP).
   * "Update progress" button (by page/percentage).

3. **Recent sessions (of the book)**

   * List of last sessions with date, time, pages.
   * Shortcut "See all sessions of this book".

4. **Notes and highlights**

   * List of notes associated with this book.
   * Filter by page, tag, feeling.

5. **Summary and insights (future)**

   * Automatic book summary.
   * Final mind map.
   * Reread insights.

**Special states display:**

* **Rereads:**
  * Status shows "Completed (2x)" or "Completed + Rereading".
  * Each reread maintains separate session history.
  * Comparison metrics between readings visible.
* **Hybrid Text + Audiobook:**
  * Progress displays combined total (e.g., "60% overall").
  * Option to see separate format breakdown (e.g., "40% text + 20% audio").
  * Visual indicator showing contribution of each format.
  * Unified progress graph with both formats.
* **Abandoned Books:**
  * Status clearly marked as "Abandoned".
  * Visible in statistics separately from completed books.
  * Option to restore or permanently archive.

**Main actions:**

* Start new reading session for this book.
* Update current page.
* Create note for a page.
* Edit book data.
* Mark as completed / paused / abandoned / reread.
* Correct progress / edit past sessions.

---

## 4. Book Registration/Edit Screen [MVP]

**Suggested name:** `New Book` / `Edit Book` (can be modal or screen)

**Objective:** Register and edit book metadata.

**Main fields:**

* Title
* Author
* Genre
* Type (book, article, audiobook, etc.)
* Number of pages (or duration, if audiobook)
* Publication year (optional)
* Tags
* Collection (e.g.: "Classics", "To reread")
* URL (for articles, PDFs)
* Cover (upload or URL)

**Main actions:**

* Save
* Cancel
* Duplicate (for future reread, if desired)

---

## 5. Reading Sessions Screen [MVP]

**Suggested name:** `Reading Sessions`

**Objective:** View and manage all registered sessions.

**Main content:**

* Session list:

  * Date
  * Book
  * Pages (start → end)
  * Duration
  * Quick notes
* Filters:

  * By book
  * By period (day, week, month)
* Table or list view.

**Main actions:**

* Create new session manually (without timer).
* Open session details (see notes).
* Edit session.
* Delete session.

---

## 6. "New Session" / Reading Mode Screen [MVP]

**Suggested name:** `New Session` / `Active Reading`

**Objective:** Record reading in real time.

**Main content:**

* Select book (or already filled if entered through book).
* Timer (start/stop).
* Fields:

  * Starting page
  * Ending page
* Quick session note field.

**Main actions:**

* Start / Pause / End timer.
* Save session.
* Mark "Continue later" (partial auto-registration).

---

## 7. Global Notes Screen [MVP]

**Suggested name:** `Notes`

**Objective:** See all notes in one place.

**Main content:**

* Note list:

  * Book
  * Page
  * Excerpt (optional)
  * Note text
  * Feeling tags
* Filters:

  * By book
  * By tag
  * By feeling type (inspiration, doubt, reflection)

**Main actions:**

* Open note (goes to book detail + position).
* Edit note.
* Delete note.
* Export note set (current filter) to PDF/Markdown (future).

---

## 8. Reading Journal Screen [Advanced]

**Suggested name:** `Reading Journal`

**Objective:** Record reflections in journal format.

**Main content:**

* Timeline of entries by date.
* Each entry:

  * Date
  * Book (optional)
  * Free text
  * Emojis / feeling

**Main actions:**

* Create new journal entry.
* Edit / delete entry.
* Filter by book.

---

## 9. Goals & Statistics Screen [MVP]

**Suggested name:** `Goals & Statistics`

**Objective:** Show the macro view of readings and goals.

**Main sections:**

1. **Goals**

   * Annual book goal.
   * Monthly page goal.
   * Daily minute goal (if used).

2. **Main statistics**

   * Pages read per month (graph).
   * Books completed per year.
   * Most read genres (pie or bars).
   * Average reading speed.

3. **Highlights**

   * Most productive day.
   * Longest book ever read.
   * Strongest month.

**Main actions:**

* Define/edit goals.
* Adjust graph period (year/month).

---

## 10. Agenda / Reading Calendar Screen [Advanced]

**Suggested name:** `Agenda`

**Objective:** Plan future sessions and view history in calendar format.

**Main content:**

* Monthly/weekly calendar.
* Each day:

  * completed sessions
  * planned blocks (e.g.: 9 PM–9:30 PM "Read book X").

**Main actions:**

* Create future reading block.
* Drag and drop blocks on calendar (reschedule).
* View day details (sessions + total time).

---

## 11. Recommendations / Book of the Week Screen [Advanced]

**Suggested name:** `Suggestions`

**Objective:** Help choose what to read next — based on own library.

**Main content:**

* "Book of the week" (random from library, not started).
* Suggestions:

  * "Based on genres you read most"
  * "Short books to finish quickly"
  * "Long books for immersion"
* Filters for recommendation type.

**Main actions:**

* Mark suggested book as "planned".
* Send suggested book to "Current book".

---

## 12. Annual Report Screen ("Your year in books") [Advanced]

**Suggested name:** `Reports` → tab `Year in Books`

**Objective:** Generate "Spotify Wrapped" view of readings.

**Main content:**

* Cards like:

  * Total books read.
  * Total pages read.
  * Fastest book.
  * Most impactful book (can be the one with most notes).
  * Dominant genre.
  * Day you read most.
* Timeline of readings from the year.

**Main actions:**

* Select year.
* Export report as PDF.

---

## 13. Settings & Preferences Screen [MVP]

**Suggested name:** `Settings` / `Preferences`

**Objective:** A first-class screen that consolidates all user preferences and configuration options in one organized place.

**Main sections:**

1. **Appearance:**

   * Theme (light/dark toggle)
   * Font size (small, standard, large)
   * Line spacing adjustment
   * High contrast mode toggle

2. **Behavior:**

   * Default progress unit (page or %)
   * Default session behavior (open timer automatically or not)
   * Default start page when creating a new book

3. **Notifications:**

   * Enable/disable daily reminder
   * Enable/disable "you haven't read today" prompt
   * Goal reminder preferences

4. **Data:**

   * Backup folder location (display/change)
   * Last backup date indicator
   * Export full system backup to file (JSON)
   * Export partial data (year statistics, single book)
   * Import backup (overwrite or merge)

5. **Shortcuts:**

   * View list of keyboard shortcuts
   * Keyboard shortcuts reference (even if not customizable at first)

---

## 14. Progress Correction Screen [MVP]

**Suggested name:** `Progress Correction` / `Session History`

**Objective:** Allow users to correct past sessions and fix progress inconsistencies.

**Main content:**

* List of all sessions for a selected book:
  * Date
  * Start page → End page
  * Duration
  * Quick notes
* Session details view:
  * All fields editable
  * Validation warnings (e.g., end page < start page)
* Options:
  * Edit session
  * Delete session
  * Bulk corrections

**Main actions:**

* Edit session (change pages, duration, date).
* Delete session (with confirmation).
* Validate all sessions for inconsistencies.
* Recalculate book progress after changes.

**Note:** Accessible from Book Details screen → Sessions tab → "Edit sessions" or "Correct progress" button.

---

## 15. Archive / Wishlist Screen [Advanced]

**Suggested name:**

* `Archive`
* `Wishlist`

**Objective:** Separate books "out of circulation" and planned ones.

**Archive:**

* List of archived or abandoned books.
* Action: restore to main library.

**Wishlist:**

* List of books the user wants to read someday.
* Actions:

  * move to Library as "Not started"
  * associate goal (e.g.: read this year)

---

# ✅ Summary

You now have:

* A **complete screen list** consistent with:

  * Desktop app
  * Private use
  * MVP + advanced
* Each screen with:

  * Objective
  * Main sections
  * Main actions

---

If you want, the next step can be:

1. **Textual wireframe**
   – e.g.: for each screen, describe something like
   "Header: … / Sidebar: … / Main: … / Cards: …".

2. Or **map this in task format for Cursor**, like:

   * "Implement Home screen with sections X, Y, Z"
   * "Implement Library with filters A, B, C"

What do you prefer now: **textual wireframe of main screens** (Home, Library, Book Details, Session) or transform this into **epics + user stories**?
