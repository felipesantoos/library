Let's go, Felipe! I'll create a **package of User Stories** already aligned with what you defined as the final version of the system.

* Format: `As [user type], I want [action] to [benefit]`.
* Main role: since it's a private app, I'll always use **"As reader"**.
* I'll mark with **[MVP]** what goes in the first release.

---

## 🧩 Epic 1 – Manage Library

### [MVP] US-01 – Register book manually

**As reader**, I want to register a book manually (title, author, genre, pages) to control my reading even without external integration.
**Acceptance criteria:**

* Must be possible to enter title, author, genre and number of pages.
* The book must appear in the Library after saving.
* Default status must be "Not started".

---

### [MVP] US-02 – Edit book information

**As reader**, I want to edit information of an already registered book to correct data or add information.
**Acceptance criteria:**

* I can change title, author, genre, pages, tags, type, collections.
* Changes are reflected immediately in Library and details screen.

---

### [MVP] US-03 – Set book status

**As reader**, I want to set a book's status (not started, reading, paused, completed, abandoned) to know where I am with each work.
**Acceptance criteria:**

* I can change status from Library and details screen.
* Status is displayed as badge on all relevant screens.
* When setting "Completed", the book enters completed books statistics.

---

### [MVP] US-04 – View library in list/grid

**As reader**, I want to view my books in different layouts (list, grid, cards) to navigate in the most comfortable way for me.
**Acceptance criteria:**

* I can switch between at least list and grid.
* View choice is applied to entire Library.

---

### [MVP] US-05 – Filter books by status, type and tags

**As reader**, I want to filter my books by status, type and tags to quickly find what I want to read or update.
**Acceptance criteria:**

* Combinable filters (e.g.: "Reading" + "Comic").
* When clearing filters, all books appear again.

---

### US-06 – Organize books in collections

**As reader**, I want to group books in custom collections (e.g.: "Classics", "To reread") to better organize my library.
**Acceptance criteria:**

* I can create, rename and delete collections.
* I can associate a book with one or more collections.

---

### US-07 – Archive books

**As reader**, I want to archive books I no longer want to see in the active library to keep the main view cleaner.
**Acceptance criteria:**

* Archived books don't appear in default Library.
* There's a specific Archive screen/tab.
* I can restore an archived book.

---

### US-08 – Wishlist and "plan to read in the future"

**As reader**, I want to keep books in a wishlist or "plan to read in the future" to plan my next readings.
**Acceptance criteria:**

* I can move a book to Wishlist.
* I can move from Wishlist to active Library.

---

## ⏱️ Epic 2 – Reading Sessions

### [MVP] US-09 – Register a reading session

**As reader**, I want to register a reading session with starting page, ending page and duration to track how much I read at each moment.
**Acceptance criteria:**

* I can enter starting and ending page.
* System automatically calculates pages read in session.
* Session is associated with a book.

---

### [MVP] US-10 – Use a timer during session

**As reader**, I want to use a timer during session to automatically record reading time.
**Acceptance criteria:**

* I can start, pause and end timer.
* When ending, time is recorded in session.

---

### [MVP] US-11 – View session history

**As reader**, I want to view session history to understand when and how much I've read.
**Acceptance criteria:**

* Session listing screen with date, book, pages, duration.
* Possibility to filter by book and period.

---

### US-12 – Register quick notes in session

**As reader**, I want to write a quick note linked to session to remember impressions from that reading moment.
**Acceptance criteria:**

* Optional text field in session.
* Note is available both in session and in book notes.

---

### US-13 – Page scan by photo (advanced)

**As reader**, I want to take a photo of current page so system automatically identifies where I stopped reading.
**Acceptance criteria:**

* I can attach a photo to session or book.
* System tries to recognize page number (even if it's a future step or approximate).
* Current page is updated based on this (when recognized).

---

## 📊 Epic 3 – Progress & Statistics

### [MVP] US-14 – Update current page of a book

**As reader**, I want to update current page of a book so system automatically calculates my progress.
**Acceptance criteria:**

* When entering current page, percentage is recalculated.
* Progress bar is updated on all screens where book appears.

---

### [MVP] US-15 – View detailed progress of a book

**As reader**, I want to see a simple graph of a book's progress over time to understand my evolution in that work.
**Acceptance criteria:**

* Graph with time axis x pages read or %.
* Updated based on sessions.

---

### [MVP] US-16 – View total read in month/year

**As reader**, I want to see how many pages I read in each month and year to track my reading consistency.
**Acceptance criteria:**

* Pages per month graph.
* Counter of pages read in current year.

---

### US-17 – View most read genres

**As reader**, I want to see which genres I read most to understand my reading profile.
**Acceptance criteria:**

* Genre distribution graph (%).
* Based on completed books (or configurable).

---

### US-18 – Extended visual library

**As reader**, I want to see a wall of covers from read books to have a visual view of my reading journey.
**Acceptance criteria:**

* Cover grid only from completed books.
* When clicking a cover, opens book details page.

---

## 📝 Epic 4 – Notes & Insights

### [MVP] US-19 – Create note linked to a page

**As reader**, I want to create notes linked to specific pages of a book to record important ideas.
**Acceptance criteria:**

* Fields: book, page, note text.
* Note appears in book notes tab and in global notes.

---

### [MVP] US-20 – List all notes in a global screen

**As reader**, I want to see all system notes in a single screen to revisit my ideas.
**Acceptance criteria:**

* Global note list with filter by book, tag and feeling.
* When clicking a note, I go to corresponding book/page.

---

### US-21 – Categorize notes by feeling

**As reader**, I want to mark notes with feelings (inspiration, doubt, reflection, learning) to easily identify insight type.
**Acceptance criteria:**

* Default feeling tags available.
* Filter by feeling in notes screen.

---

### US-22 – Reading journal (journaling)

**As reader**, I want to register journal entries about my readings (by day) to reflect on my reading experience.
**Acceptance criteria:**

* Registration with date, free text and book (optional).
* Timeline with all entries.

---

### US-23 – Export notes and journal to PDF/Markdown

**As reader**, I want to export my notes and journal entries to PDF or Markdown to archive or review outside the app.
**Acceptance criteria:**

* Option to export filtered notes.
* Generated file with grouping by book.

---

### US-24 – Learning Map per book

**As reader**, I want to see a visual map of themes learned in a book to have an overview of knowledge I built.
**Acceptance criteria:**

* Visualization with themes/subjects extracted from notes.
* Each theme can be associated with excerpts or pages.

---

## 🎯 Epic 5 – Goals & Gamification

### [MVP] US-25 – Set monthly page goal

**As reader**, I want to set a monthly goal of pages read to stay motivated to read regularly.
**Acceptance criteria:**

* Field for pages/month goal.
* Progress displayed on Home and Goals & Statistics screen.

---

### [MVP] US-26 – View progress relative to monthly goal

**As reader**, I want to see how much I've already read relative to monthly goal to know if I'm ahead or behind.
**Acceptance criteria:**

* % completed of goal.
* Visual representation (bar or donut).

---

### US-27 – Reading heatmap calendar

**As reader**, I want to see a calendar with days I read to visualize my daily consistency.
**Acceptance criteria:**

* Each day displays intensity based on time or pages.
* When clicking a day, I see sessions from that day.

---

## 📅 Epic 6 – Planning & Agenda

### US-28 – Plan reading blocks in agenda

**As reader**, I want to schedule reading blocks on specific days and times to organize my reading routine.
**Acceptance criteria:**

* I can create blocks like "Day X, 9 PM–9:30 PM, Book Y".
* Blocks appear in a calendar.

---

### US-29 – Receive reading reminders

**As reader**, I want to receive reminders (within app) to read at planned times to not forget my goal.
**Acceptance criteria:**

* App highlights upcoming blocks on Home.
* There's an indicator of "you have reading planned for today".

---

### US-30 – Automatic insights about reading times

**As reader**, I want the system to tell me at what time I usually read more to optimize my planning.
**Acceptance criteria:**

* Weekly/monthly summary with patterns (e.g.: "You read more at night").
* Preferred time suggestion on Agenda screen or Home.

---

## 📚 Epic 7 – Recommendations & Suggestion of the Day

### US-31 – See "Book of the week"

**As reader**, I want to see a "Book of the week" suggested based on my own library to decide what to read next.
**Acceptance criteria:**

* System chooses an unstarted book with some simple logic (like favorite genre).
* Show on Home and Suggestions screen.

---

### US-32 – Mood-based suggestions

**As reader**, I want to inform my current mood and receive reading suggestions consistent with that state to have a more pleasant experience.
**Acceptance criteria:**

* Simple question: "How are you feeling today?"
* Mood options (light, reflective, motivated etc.)
* Suggestions of compatible books/chapters (short, light, deep).

---

## 📜 Epic 8 – Reports and Final Summary

### US-33 – View final summary of a book

**As reader**, I want the system to generate a final summary of the book based on my notes to consolidate what I learned.
**Acceptance criteria:**

* Summary uses notes and highlights from that book.
* Readable format, with export possibility.

---

### US-34 – View final mind map

**As reader**, I want to see a mind map generated from notes to visualize central concepts of the book.
**Acceptance criteria:**

* Map nodes correspond to main themes.
* I can manually edit map (even if simple).

---

### US-35 – Compare rereads

**As reader**, I want to compare what I annotated in different rereads of the same book to see how my understanding evolved.
**Acceptance criteria:**

* System recognizes multiple reading cycles of same book.
* Comparison screen shows differences in notes, time, pages, feelings.

---

### US-36 – Annual report "Your year in books"

**As reader**, I want an annual report with highlights of my readings to have an overview of my reading year.
**Acceptance criteria:**

* Shows total books and pages.
* Highlights fastest book, most impactful (most notes), dominant genre, most productive day.
* Possibility to choose year.

---

## ⚙️ Epic 9 – Settings & Data

### [MVP] US-38 – Choose light/dark theme

**As reader**, I want to switch between light and dark theme to adapt app to my visual comfort.
**Acceptance criteria:**

* Persistent configuration (opens in last chosen theme).
* Applied on all screens.

---

### [MVP] US-37 – Export system data

**As reader**, I want to export my data (books, sessions, notes) to a file to have local backup.
**Acceptance criteria:**

* Generates file with all relevant entities.
* Format choice option (at least one: JSON/CSV).

---

### US-38 – Adjust default progress unit

**As reader**, I want to define if app uses pages or percentage as default progress unit to be aligned with how I think about reading.
**Acceptance criteria:**

* Configuration affects how progress is displayed.
* Existing progress is recalculated/displayed appropriately.

---

### US-39 – Export full system backup

**As reader**, I want to export all my data (books, sessions, notes, goals, journal, settings) to a single file to have a complete local backup.
**Acceptance criteria:**

* Exports everything to a JSON file (e.g.: `reading-backup-2025-11-20.json`).
* File includes all relevant entities in structured format.
* File can be saved to chosen location.

---

### US-40 – Import full system backup

**As reader**, I want to import a complete backup file to restore my data or merge with current data.
**Acceptance criteria:**

* Can select backup file to import.
* Option to overwrite existing data or merge.
* Validates data before import.
* Shows preview of what will be imported.

---

### US-41 – Export partial data (year statistics or single book)

**As reader**, I want to export only statistics from a specific year or data from a single book to share or use in research.
**Acceptance criteria:**

* Option to export only statistics from a selected year.
* Option to export all data from a single book (useful for thesis/research).
* Exported file includes relevant data in structured format.

---

### US-42 – Adjust global font size

**As reader**, I want to adjust the global font size (small, standard, large) to adapt the app to my visual comfort.
**Acceptance criteria:**

* Three font size options available.
* Applies globally to all text elements.
* Persists across sessions.

---

### US-43 – Use High Focus Mode

**As reader**, I want to activate High Focus Mode to reduce distractions and focus on essential elements (current book, progress, start session button).
**Acceptance criteria:**

* Reduces decorative elements when activated.
* Hides secondary graphs and cards.
* Focuses on: current book + progress + start session button.
* Can be toggled on/off.

---

### US-44 – Use keyboard shortcuts

**As reader**, I want to use keyboard shortcuts to navigate and perform actions quickly without using the mouse.
**Acceptance criteria:**

* `Ctrl/Cmd + L` opens global search / library.
* `Ctrl/Cmd + N` starts new reading session.
* `Ctrl/Cmd + Shift + B` adds new book.
* Shortcuts work across all screens.

---

### US-45 – Navigate with keyboard

**As reader**, I want to navigate through book lists and interface elements using only the keyboard.
**Acceptance criteria:**

* Arrow keys navigate book lists (up/down).
* Enter opens book details.
* Tab navigates through interface elements.
* Escape closes modals/dialogs.

---

### US-46 – Correct session progress retroactively

**As reader**, I want to edit or delete past sessions to correct mistakes in my reading progress.
**Acceptance criteria:**

* Can view full session history for a book.
* Can edit session (change pages, duration, date).
* Can delete session to correct progress.
* Book progress recalculates automatically after changes.

---

### US-47 – Validate data input

**As reader**, I want the system to validate my input to prevent inconsistencies (e.g., current page cannot exceed total pages).
**Acceptance criteria:**

* Current page cannot exceed total pages.
* Session end page cannot be less than start page.
* Date validation (session cannot be in the future).
* Clear error messages with actionable solutions.

---

### US-48 – Understand reread status display

**As reader**, I want to clearly see when a book has been read multiple times and understand the status display.
**Acceptance criteria:**

* Status displays as "Completed (2x)" or "Completed + Rereading".
* Each reread maintains separate session history.
* Visual distinction between first read and subsequent reads.

---

### US-49 – View hybrid text + audiobook progress

**As reader**, I want to see how my progress combines both text reading and audiobook listening for the same book.
**Acceptance criteria:**

* Shows combined total: "60% overall".
* Option to see separate display: "40% text + 20% audio".
* Visual indicator showing contribution of each format.
* Unified progress graph with both formats visible.

---

### US-50 – Understand abandoned books in statistics

**As reader**, I want to understand how abandoned books appear in my statistics and reports.
**Acceptance criteria:**

* Abandoned books counted separately from completed books.
* Included in total books started but not in completion rate.
* Option to include/exclude from annual reports.
* Clear distinction in statistics.

---

If you want, in the next step I can:

* **Explicitly mark which of these US go in the MVP** in backlog format (ordered by priority), or
* Transform this into **tables** (e.g.: to use in Kanban/Jira board), or
* Generate **Given/When/Then** (Gherkin) for some critical US (session, progress, goals).
