Perfect, Felipe, let's design the app's "skeleton" as if it were a **functional product map**, not a technology one.
The idea here is: if you show this to someone, the person understands **what the system does internally**, without seeing a line of code.

---

# 🧩 Functional Architecture Overview

Think of the system as a set of **business modules** that communicate with each other around some **central concepts**:

* **Book**
* **Reading session**
* **Progress**
* **Note / Journal**
* **Goal**
* **Statistics**
* **Suggestion / Recommendation**
* **Report**
* **User configuration**

Main modules:

1. Library Management
2. Reading Sessions
3. Progress & Statistics
4. Notes & Journal
5. Goals & Gamification
6. Planning & Agenda
7. Recommendations & Suggestion of the Day
8. Reports (Book Summary and Year in Books)
9. Settings & Preferences
10. Data Management
11. Accessibility & Visual Comfort
12. Productivity & Shortcuts
13. Error Handling & Data Integrity

Each module has **clear responsibilities**, and they share data through these central concepts (Books, Sessions, Notes, etc.).

---

## 1. Library Management Module

**Main responsibility:**
Be the system's "bookshelf". Everything that exists to be read lives here.

### Concepts it dominates

* Book
* Material type (physical book, ebook, article, PDF, comic…)
* Book status
* Tags
* Collections
* Archive
* Wishlist / "Plan to read in the future"

### What this module does (functionally)

* Register, edit and remove books.
* Organize books in collections.
* Control reading status of each book.
* Separate what is active, archived or wished.
* Expose an organized view (list/grid/cards) to the user.

### How it communicates with other modules

* **Reading sessions**: every session needs to be associated with a Library Book.
* **Progress & Statistics**: uses Book data (total pages, status) to calculate metrics.
* **Notes & Journal**: notes are always linked to a Book.
* **Recommendations**: chooses books from Library to suggest (Book of the Week, etc).
* **Reports**: uses completed Books to build "Year in Books".

---

## 2. Reading Sessions Module

**Main responsibility:**
Record **"when" and "how much"** the user read.

### Concepts it dominates

* Reading session (date, time, duration, pages/minutes read)
* Reading timer
* Quick session note
* (Optional) Photo/page scan

### What it does

* Create, edit and delete sessions.
* Control session timer.
* Calculate pages read in a session.
* Connect session to a Book.
* Register quick notes from that session.

### How it communicates with other modules

* **Library**: gets Book data (pages, title, etc).
* **Progress & Statistics**:

  * Updates book progress.
  * Feeds graphs (pages per day, per month, etc).
* **Notes & Journal**: session notes can become book notes.
* **Goals & Gamification**:

  * Each session contributes to pages/minutes goals.
* **Agenda**:

  * Completed sessions can be shown on calendar.

---

## 3. Progress & Statistics Module

**Main responsibility:**
Answer the questions: **"Where am I in each book?"** and **"How much have I read over time?"**

### Concepts it dominates

* Book progress (current page, %)
* Daily, monthly, annual progress
* Reading speed (pages/day, pages/session)
* Distribution by genre, type, etc.

### What it does

* Calculates progress per book based on:

  * current page
  * total number of pages
  * registered sessions
* Generates global statistics:

  * pages per month
  * books per year
  * most read genres
  * total pages read in lifetime
* Provides data for graphs and heatmaps.

### How it communicates with other modules

* **Library**: uses total pages, status (Completed).
* **Sessions**: consumes sessions to calculate everything.
* **Goals & Gamification**: provides data for comparison with goals.
* **Reports**: feeds "Year in Books" and highlights.
* **Recommendations**: helps understand reading profile (genres, rhythms) to suggest books.

---

## 4. Notes & Journal Module

**Main responsibility:**
Store **the meaning** of readings: ideas, insights, reflections.

### Concepts it dominates

* Note (text + page + book)
* Highlight (marked excerpt)
* Feeling tag (inspiration, doubt, reflection, learning…)
* Reading journal (entry per day, optionally linked to a book)
* Learning map per book

### What it does

* Allows creating, editing and deleting notes linked to books/pages.
* Organizes notes by book, feeling, tags.
* Maintains a Reading journal (text per day).
* Generates a "Learning Map" view per book:

  * grouping concepts/themes from notes.

### How it communicates with other modules

* **Library**: every note belongs to a Book.
* **Sessions**: quick notes made during session are stored here.
* **Progress & Statistics**:

  * can be used to identify "most impactful book" (highest number of notes).
* **Recommendations**:

  * recurring themes in notes can influence suggestions.
* **Reports**:

  * Final book summary is built from notes.
  * "Most impactful book" in annual report uses number of notes.

---

## 5. Goals & Gamification Module

**Main responsibility:**
Transform reading habit into a personal game.

### Concepts it dominates

* Goal (pages/month, books/year, minutes/day)
* Progress relative to goals
* Personal ranking (best months, days)

### What it does

* Allows configuring goals (monthly, annual, daily).
* Calculates goal completion using:

  * Progress & Statistics
  * Registered sessions
* Generates small highlights for Home and Reports.

### How it communicates with other modules

* **Sessions**:

  * uses time and pages read to feed goals.
* **Progress & Statistics**:

  * uses consolidated data by period.
* **Home**:

  * displays goal progress.
* **Reports**:

  * includes goals reached in the year.

---

## 6. Planning & Agenda Module

**Main responsibility:**
Help the reader **plan** when they'll read, not just record later.

### Concepts it dominates

* Reading block (day, time, book)
* Weekly/monthly agenda
* Time patterns (superficial insights, like "you read more at night")

### What it does

* Allows creating future reading blocks in agenda.
* Shows on calendar:

  * completed sessions (history)
  * planned blocks (future)
* Generates simple insights about most used times.
* Signals planned blocks for the day on Home (as visual reminders).

### How it communicates with other modules

* **Sessions**:

  * completed sessions can "fill" or justify planned blocks.
* **Home**:

  * shows "You have reading planned today at X o'clock".
* **Goals & Gamification**:

  * helps user plan to reach goals.

---

## 7. Recommendations & Suggestion of the Day Module

**Main responsibility:**
Answer: **"What makes more sense for me to read now?"**

### Concepts it dominates

* Book of the week
* Suggestion of the day
* Simple rules based on:

  * status
  * most read genres
  * informed mood
  * book size

### What it does

* Chooses "Book of the week" from Library:

  * unstarted books
  * in genres or types user likes
* Suggests readings based on:

  * chosen mood ("light", "reflective", etc.)
  * goals (short books to reach goal, for example)
* Provides "Suggestion of the day" for Home.

### How it communicates with other modules

* **Library**:

  * chooses candidates for suggestion.
* **Progress & Statistics**:

  * uses most read genres and reading pattern.
* **Notes & Journal**:

  * can deduce themes user likes.
* **Home**:

  * shows suggestion of the day and book of the week.

---

## 8. Reports & Final Summary Module

**Main responsibility:**
Give a **consolidated view** of reading journey: per book and per year.

### Concepts it dominates

* Final book summary
* Book mind map
* Annual report ("Your year in books")
* Reread comparison

### What it does

* **Per book**:

  * Final summary based on notes.
  * Mind map of themes/concepts.
  * Comparison between multiple readings of same book.
* **Per year**:

  * Total books and pages.
  * Most impactful books.
  * Dominant genre.
  * Strongest day and month.
  * Highlights: records, etc.

### How it communicates with other modules

* **Library**: knows which books were completed in which year.
* **Sessions**: uses sessions to know total time, important dates.
* **Progress & Statistics**: uses consolidated graphs and counters.
* **Notes & Journal**: uses notes for summary and mind map.
* **Goals & Gamification**: shows goals reached in annual report.

---

## 9. Settings & Preferences Module

**Main responsibility:**
A first-class module that consolidates all user preferences and configuration options in one organized place. Adapt system to user style and protect data.

### Concepts it dominates

* Appearance preferences (theme, font size, line spacing, contrast)
* Behavior preferences (default progress unit, session behavior, default start page)
* Notification preferences (daily reminders, prompts)
* Data management preferences (backup location, last backup date)
* Shortcuts reference and configuration

### What it does

* **Appearance:**
  * Theme (light/dark)
  * Font size (small, standard, large)
  * Line spacing adjustment
  * High contrast mode
  * High Focus Mode (reduces decorative elements)
* **Behavior:**
  * Default progress unit (page vs %)
  * Default session behavior (open timer automatically or not)
  * Default start page when creating a new book
* **Notifications:**
  * Enable/disable daily reminder
  * Enable/disable "you haven't read today" prompt
  * Goal reminder preferences
* **Data:**
  * Backup folder location
  * Last backup date indicator
  * Manages data backup and restoration:
    * Export all data to a single JSON file
    * Import full backup (overwrite or merge)
    * Partial exports (year statistics, single book data)
* **Shortcuts:**
  * View list of keyboard shortcuts
  * Keyboard shortcuts reference (even if not customizable at first)

### How it communicates with other modules

* **UI (Home, Library etc.)**:

  * applies theme, font size, line spacing, and formatting.
  * applies High Focus Mode when enabled.
* **Sessions & Progress**:

  * uses default progress unit.
  * uses default session behavior.
* **Library**:

  * uses default start page when creating new books.
* **Goals & Agenda**:

  * uses notification preferences.
* **Data Management**:

  * coordinates backup/restore operations.
  * tracks backup location and dates.
* **Entire system**:

  * provides unified interface for all preferences.
  * exports and imports configuration and data.

---

## 10. Data Management Module

**Main responsibility:**
Backup, export, and import of all application data.

### Concepts it dominates

* Full system backup
* Partial exports (by year, by book)
* Backup import (overwrite or merge)
* Data validation
* Backup file format (JSON)

### What it does

* **Full System Backup:**
  * Exports everything (books, sessions, notes, goals, journal, settings) to a single JSON file
  * Example filename: `reading-backup-2025-11-20.json`
  * Includes all data in structured format
* **Import Full Backup:**
  * Imports a complete backup file
  * Options: overwrite existing data or merge with current data
  * Validates data before import
* **Partial Exports:**
  * Export only statistics from a specific year
  * Export only data from a single book (useful for research/thesis work)
  * Export notes and summaries separately

### How it communicates with other modules

* **All modules**: aggregates data from all modules for export.
* **All modules**: distributes imported data to appropriate modules.
* **Error Handling**: validates data integrity during import/export.

**Note:** Even without cloud sync, manual local backup is a critical requirement for data security and portability.

---

## 11. Accessibility & Visual Comfort Module

**Main responsibility:**
Ensure comfortable and accessible daily use for extended periods.

### Concepts it dominates

* Global font size adjustment
* Theme and contrast settings
* High Focus Mode
* Visual comfort settings

### What it does

* **Font Size Adjustment:**
  * Global font size settings (small, standard, large)
  * Adjustable independently for titles, body text, and UI elements
* **Theme & Contrast:**
  * Light/dark theme (formalized as requirement)
  * Adequate contrast ratios for readability
  * Optional high contrast mode for accessibility
* **High Focus Mode:**
  * Reduces decorative elements
  * Hides secondary graphs and cards
  * Focuses on: current book + progress + "start session" button
  * Minimalist interface for distraction-free reading sessions

### How it communicates with other modules

* **UI (Home, Library, all screens)**:
  * applies font size and contrast settings globally.
  * applies High Focus Mode when enabled.
* **Settings**: stores and retrieves accessibility preferences.

**Note:** This complements the Immersive Mode feature but is formalized as an accessibility and comfort requirement, not just a "cool feature".

---

## 12. Productivity & Shortcuts Module

**Main responsibility:**
Enable fast, keyboard-driven workflow for daily desktop use.

### Concepts it dominates

* Global keyboard shortcuts
* Keyboard navigation
* Command palette (future feature)
* Productivity requirements

### What it does

* **Global Keyboard Shortcuts:**
  * `Ctrl/Cmd + L` → Open global search / library
  * `Ctrl/Cmd + N` → New reading session
  * `Ctrl/Cmd + Shift + B` → Add new book
  * `Ctrl/Cmd + K` → Open command palette (future feature)
* **Keyboard Navigation:**
  * Navigate book lists with arrow keys (up/down)
  * Open book details with Enter
  * Tab navigation through interface elements
  * Escape to close modals/dialogs
* **Command Palette (Future Feature):**
  * Quick command access via keyboard
  * Type "session" → "Start session for current book"
  * Type "note" → Add note to current book
  * Fuzzy search for all available actions

### How it communicates with other modules

* **All modules**: intercepts keyboard shortcuts and routes to appropriate modules.
* **UI (all screens)**: enables keyboard navigation in all interactive elements.

**Productivity Requirement:** The app must allow an advanced user to operate almost everything without removing their hands from the keyboard.

---

## 13. Error Handling & Data Integrity Module

**Main responsibility:**
Manage errors, inconsistencies, and allow data corrections.

### Concepts it dominates

* Progress correction
* Data validation rules
* Error states and recovery
* Fail-safe operations
* Data consistency

### What it does

* **Progress Correction:**
  * Edit/delete sessions retroactively
  * Correct page numbers if recorded incorrectly
  * Adjust book progress manually when needed
  * Full session history view per book for corrections
* **Data Validation Rules:**
  * Current page cannot exceed total pages
  * Session end page cannot be less than start page
  * Validate date ranges (session cannot be in the future)
  * Warn about inconsistent data (e.g., large gaps in sessions)
* **Error States & Recovery:**
  * Fail-safe: if an error occurs, app does not lose previous data
  * Data integrity checks on startup
  * Recovery options for corrupted data
  * Clear error messages with actionable solutions
* **Data Consistency:**
  * Automatic reconciliation of conflicting data
  * Manual override options when needed
  * Data audit trail for important changes

### How it communicates with other modules

* **Sessions**: validates session data before saving.
* **Progress & Statistics**: validates progress updates.
* **Library**: validates book data and status changes.
* **All modules**: provides fail-safe mechanisms for data operations.

---

## 📝 Special States Clarification

To avoid ambiguity, explicit requirements for special book states:

### **Rereads:**
* Status display: "Completed (2x)" or "Completed + Rereading"
* Each reread maintains separate session history
* Comparison metrics between readings
* Progress tracking independent for each reading cycle

### **Hybrid Text + Audiobook Progress:**
* Display options:
  * Combined total: "60% overall"
  * Separate display: "40% text + 20% audio"
  * Visual indicator showing contribution of each format
* Unified progress graph with both formats visible
* Conversion tools between minutes and pages

### **Abandoned Books:**
* Explicit definition: Books marked as "Abandoned" are incomplete readings
* Statistics handling:
  * Counted separately from completed books
  * Included in total books started but not in completion rate
  * Option to include/exclude from annual reports
* Status visibility: Can be hidden in main library but accessible in archive

### **Multiple Status Simultaneously:**
* A book can be "Completed" and marked for "Reread"
* Clear visual distinction between first read and subsequent reads
* History preserves all status changes chronologically

---

# 🔗 Functional Flows Crossing Modules

Just to make it very clear how this "moves together", some examples:

### Flow: "Read a book from zero to finish"

1. **Library**: user registers book (Book created).
2. **Sessions**: they register sessions with starting/ending pages.
3. **Progress & Statistics**: with each session, book progress and statistics are updated.
4. **Notes & Journal**: they create notes per page and journal entries during reading.
5. **Goals & Gamification**: sessions increment monthly/annual goal progress.
6. **Recommendations**: based on what's being read, system can suggest next books.
7. **Reports**: when marking book as completed, module generates:

   * final summary
   * mind map (future)
   * includes book in "Year in books".

---

### Flow: "See my year in reading"

1. **Reports** asks:

   * **Library**: "Which books were completed this year?"
   * **Sessions**: "Which sessions happened this year?"
   * **Progress & Statistics**: "How many pages were read per month? Which genres?"
   * **Notes & Journal**: "Which books had most notes?"
   * **Goals & Gamification**: "Which goals were reached?"
2. With this, Annual Report builds:

   * main numbers,
   * highlights,
   * month graph,
   * suggestions for next year.

---

If you want, the next step can be:

* Transform this architecture into a **text diagram** (like "pseudo-uml" or mermaid, without code), or
* Break this into suggested **code modules** (e.g.: `ReadingLibrary`, `ReadingSessions`, `ReadingStats`), still without technology, just organized names for you to plug into Cursor later.
