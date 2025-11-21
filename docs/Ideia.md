Perfect, Felipe.
Here is the **FINAL VERSION** of the system — reviewed, expanded, and organized in a professional manner, ready to become a real project, a product document, or a briefing for Cursor.

**Note:** This system is a **completely private desktop application**, with no user interaction or social features. All data is personal and stored locally.

I've prepared three deliverables:

1. **Complete and final requirements list**
2. **Lean and viable MVP**
3. **Complete User Flow** (how the user uses the system from start to finish)

If you want, I can later create **screen list**, **textual wireframes**, **personas**, **user stories**, or even transform this into **an SRS** (Software Requirements Specification).

---

# ✅ **1. DEFINITIVE REQUIREMENTS LIST FOR READING CONTROL SYSTEM**

## 🎯 **General Objective**

Create a private desktop application to organize, record, and evolve in reading (books, articles, comics, PDFs, audiobooks), promoting focus, learning, and motivation. The system is completely private and personal, with no interaction with other users.

---

## 🧱 **MAIN MODULES**

---

# **1. Library**

Management of works the user wants to read.

### Features:

* Add books manually (title, author, cover, pages, genre).
* Import via ISBN.
* Add other types:

  * Articles (with URL)
  * PDFs
  * Academic papers
  * Long posts
  * Magazines
  * Comics
  * Audiobooks
* Status:

  * Not started | Reading | Paused | Abandoned | Completed | Rereads
* Custom tags (e.g.: "2025", "science fiction").
* Book history (when status changed, when started, when finished).
* Custom collections (e.g.: "Classics", "Short books", "To reread").
* Advanced organization:
  * Archive (real soft delete) - abandoned books or those the user wants to hide
  * Wishlist - books the user wants to read in the future
  * "Plan to read in the future" - separate planning list

---

# **2. Progress and Statistics**

Records user progress and provides detailed metrics.

### Features:

* Update progress by:

  * page
  * chapter
  * percentage
  * minutes (for audiobooks)
* Book progress graph over time.
* Comparison between readings (in case of reread).
* Hybrid text + audiobook control:
  * switch progress mode (minutes vs pages)
  * convert minutes listened to equivalent pages
  * combine both progressions in a unified graph
* Personal metrics:
  * Total read per month/year
  * Average reading speed (pages/day)
  * Completed books (total and by period)
  * Most read genres
  * Comparisons (e.g.: "You read 20% more than last month")
* Extended visual library:
  * Total pages read in lifetime
  * Wall of covers from read books
  * Super visual statistics (donut charts, reading heatmaps)
* Visual timeline of the book (giant progress bar with chapters).

---

# **3. Reading Sessions**

Records reading moments.

### Features:

* Create session with:

  * date
  * start and end time
  * pages/minutes read in the period
  * quick notes about the session
* Optional timer (Pomodoro reading mode).
* History of all sessions per book.
* Page scan (photo):
  * take photo of current page to automatically mark where stopped
  * automatic recognition of page number
* Analysis:

  * most productive days
  * average time per session
  * reading speed (pages/hour)

---

# **4. Notes and Insights**

Central hub for user ideas.

### Features:

* Notes per book.
* Highlights (marked pages).
* Feeling tags per excerpt (inspiration, doubt, reflection, learning).
* Page associated with note.
* **Reading Journal** (journaling style):
  * record daily reflections on what you're reading
  * chronological entries per book
* Export:

  * PDF
  * Markdown
* Learning Map:

  * main themes from reading
  * visual map of learned concepts
* Automatic summary based on notes.

---

# **5. Goals and Gamification**

To motivate the user.

### Features:

* Goals:

  * books/year
  * pages/month
  * minutes/day
* GitHub-style heatmap calendar.
* Personal ranking by year (best months, best days).

---

# **6. Search and Organization**

Makes it easy to find and organize books in the library.

### Features:

* Quick search by:
  * title
  * author
  * note (note content)
  * tag
* Filters by status:
  * read | reading | not started | paused | abandoned | completed
* Filters by type:
  * physical book | ebook | audiobook | article | PDF | comic
* Sorting:
  * title (A-Z, Z-A)
  * addition date
  * completion date
  * progress (highest/lowest)
  * number of pages
  * category/genre
* Views:
  * cover grid
  * detailed list
  * large cards

---

# **7. Planning and Agenda**

Helps the user create a routine.

### Features:

* Weekly reading agenda:
  * plan specific days and times for reading
  * scheduled reading blocks
* Recommendations based on user goals and pace.
* **Automatic weekly insights:**
  * "We noticed you read more in the evening. Try to protect 20 minutes at 9 PM."
  * Reading pattern analysis
  * Personalized optimization suggestions
* Smart suggestion:
  "You usually read at night. Reserve 20 minutes at 9 PM."
* Notifications:

  * daily reminder
  * reminder to continue current reading
  * "You haven't read today yet. Want to continue '[Book Name]'?"

---

# **8. User Experience**

Quality of life in use.

### Features:

* Light/dark theme.
* Personalized home screen:

  * current book
  * today's progress
  * monthly goal
  * suggestion of the day
* Immersion Mode:

  * timer
  * ambient sound
  * minimalist layout
* Clean visual focused on the book.

---

# **9. Intelligent Recommendations System**

Personalized suggestions based on user behavior.

### Features:

* Analysis based on:
  * most read genres
  * favorite authors
  * themes marked in notes
  * speed patterns and reading type
  * books the user liked most
* Offer personal recommendations:
  * "You tend to like books with narrative X or theme Y."
  * Suggestions of books similar to those already read
  * Recommendations for next readings from own library
* **"Book of the Week" Mode:**
  * randomly selects a book from user's library that hasn't been started
  * encourages discovering books from own shelf

---

# **10. Data Management**

Backup, export, and import of all application data.

### Features:

* **Full System Backup:**
  * Export everything (books, sessions, notes, goals, journal, settings) to a single file
  * Example: `reading-backup-2025-11-20.json`
  * Includes all data in structured format
* **Import Full Backup:**
  * Import a complete backup file
  * Options: overwrite existing data or merge with current data
* **Partial Exports:**
  * Export only statistics from a specific year
  * Export only data from a single book (useful for research/thesis work)
  * Export notes and summaries separately
* **Data Safety:**
  * Automatic validation before import
  * Backup verification before overwriting
  * Option to preview backup contents before importing

**Note:** Even without cloud sync, manual local backup is a critical requirement for data security and portability.

---

# **11. Accessibility & Visual Comfort**

Ensures comfortable and accessible daily use for extended periods.

### Features:

* **Font Size Adjustment:**
  * Global font size settings (small, standard, large)
  * Adjustable independently for titles, body text, and UI elements
* **Theme & Contrast:**
  * Light/dark theme (already in visual identity, formalized as requirement)
  * Adequate contrast ratios for readability
  * Optional high contrast mode for accessibility
* **High Focus Mode:**
  * Reduces decorative elements
  * Hides secondary graphs and cards
  * Focuses on: current book + progress + "start session" button
  * Minimalist interface for distraction-free reading sessions
* **Reading Comfort:**
  * Adjustable line spacing
  * Comfortable visual rhythm
  * Reduced motion options for sensitive users

**Note:** This complements the Immersive Mode feature but is formalized as an accessibility and comfort requirement, not just a "cool feature".

---

# **12. Productivity & Shortcuts**

Enables fast, keyboard-driven workflow for daily desktop use.

### Features:

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
* **Productivity Requirement:**
  > "The app must allow an advanced user to operate almost everything without removing their hands from the keyboard."

---

# **13. Error Handling & Data Integrity**

Manages errors, inconsistencies, and allows data corrections.

### Features:

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

---

## 📝 **Special States Clarification**

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

# **16. Settings & Preferences**

A first-class module that consolidates all user preferences and configuration options in one organized place.

### Features:

* **Appearance:**
  * Theme (light/dark)
  * Font size (small, standard, large)
  * Line spacing adjustment
  * High contrast mode
* **Behavior:**
  * Default progress unit (page vs %)
  * Default session behavior (open timer automatically or not)
  * Default start page when creating a new book
  * High Focus Mode (reduces decorative elements)
* **Notifications:**
  * Enable/disable daily reminder
  * Enable/disable "you haven't read today" prompt
  * Goal reminder preferences
* **Data:**
  * Backup folder location
  * Last backup date indicator
  * Auto-backup preferences (future)
* **Shortcuts:**
  * View list of keyboard shortcuts
  * Keyboard shortcuts reference (even if not customizable at first)

**Note:** While other modules handle specific functionalities (Data Management, Accessibility, Productivity, Error Handling), this module provides the unified interface for all user preferences and settings.

---

# ⭐ **14. Differentiating Features (The strongest features of the system)**

### Main Features:

1. **Automatic Final Book Summary**
   * Automatically generates a summary based on notes + highlights
   * Compiles all notes and generates a structured summary
   * Allows exporting everything to PDF/Markdown

2. **Final Mind Map**
   * Visual diagram with central concepts of the book
   * Automatically generated after completion
   * Allows manual editing

3. **Cross Reading**
   * Relates multiple books that address the same topic
   * Connects themes and concepts between different works
   * Creates a knowledge network

4. **Intelligent Rereads**
   * Register new reading of the same book without erasing history
   * Compares learnings between readings
   * Difference metrics (e.g.: "in reread you annotated 30% less")

5. **Annual Report "Spotify Wrapped" Style**
   * Automatically generated at end of year
   * Cards like:
     * "Your year in books"
     * "Fastest book"
     * "Most impactful book"
     * "Dominant genre"
     * "Most productive day"
     * "Total pages read"
   * Private and personal access

6. **Mood-based Suggestions**
   * When user enters, asks: "How are you feeling today?"
   * Suggests readings based on mood:
     * light
     * reflective
     * fast
     * motivational
     * short fiction
     * small chapter

### Premium/Bonus Features:

7. **Reading Journal (Journaling)**
   * Daily style for reflections on readings
   * Chronological entries per book

8. **Page Scan (Photo)**
   * Take photo of page to automatically mark where stopped
   * Automatic recognition of page number

9. **Extended Visual Library**
   * Wall of covers from read books
   * Super visual statistics (donut charts, reading heatmaps)
   * Visual timeline of book (giant progress bar with chapters)

10. **Advanced Custom Collections**
    * Create lists like:
      * "Books for 2025"
      * "Short books"
      * "Best I've read"
      * "To reread"

---

---

# 🟦 **2. MVP (Minimum Viable Product)**

Initial scope to launch quickly and validate.

## **Includes:**

### 📘 Library

* CRUD of books
* Status (not started, reading, completed)

### 📊 Progress

* Record current page
* Automatic percentage

### 📝 Sessions

* Create session with start, end and pages read
* Simple history

### ✏️ Notes

* Create notes linked to pages
* Simple listing

### 🎯 Gamification

* Monthly page goal
* Monthly progress

### 🌙 UX

* Light/dark theme
* Home:

  * current book
  * "continue reading" button
  * monthly progress

---

### ❌ What goes FOR LATER

**Advanced Features:**
* Automatic book summary
* Final mind map
* Cross reading
* Intelligent rereads
* Intelligent recommendations system
* Immersive mode (timer + ambient sound)
* Page scan (photo)
* Reading journal (journaling)
* Annual "Spotify Wrapped" style report
* Mood-based suggestions
* Complete reading agenda
* Support for PDF/articles/papers/magazines
* Extended visual library (heatmaps, donut charts)
* Automatic weekly insights
* Cover wall
* Visual timeline of book
* Advanced custom collections

---

---

# 🗺️ **3. COMPLETE USER FLOW**

Ideal user flow from start to finish.

---

## 🟩 **1. First experience**

1. User opens the app.
2. Sees a welcome screen.
3. Adds their first book (manually or via ISBN).

---

## 🟩 **2. Starting a reading**

4. Enters the book page.
5. Marks as "Reading".
6. Sets initial page (page 1).

---

## 🟩 **3. First progress**

7. Creates a session:

   * starts timer
   * reads 20 minutes
   * records pages (e.g.: 1 → 18)

---

## 🟩 **4. Notes**

8. Creates some notes:

   * reflection on page 5
   * highlight on page 12

---

## 🟩 **5. Continuing**

9. Next day, enters and app suggests continuing where stopped.
10. Records another session.

---

## 🟩 **6. Completing a book**

11. Finishes the book marking as "Completed".
12. System generates:

* automatic summary
* mind map
* book statistics

---

## 🟩 **7. Evolution over time**

13. User sees:

* monthly goal
* graphs
* total pages read
* next book suggestion

---

## 🟩 **8. End of year**

14. App automatically generates the "Your year in books" report.

---

---

# 🎁 Want the next step?

I can create:

🔧 **Complete screen list + description of each**
📐 **Textual wireframe ready for Cursor to generate components**
📑 **User Stories**
👤 **Personas**
📦 **Functional architecture (non-technical)**
🎨 **Visual style or minimalist identity for the app**

What do you want now, Felipe?
