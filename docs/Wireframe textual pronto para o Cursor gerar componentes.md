Perfect, Felipe, I'll set this up as a **handoff document for Cursor**:
very textual, with **component tree**, screen regions and without mentioning specific technology (React/Tauri/Electron etc.).

I'll use a fixed base:

* Root layout: `AppShell`
* Standard regions: `Sidebar`, `TopBar`, `MainContent`
* Each page: `XXXPage` inside `MainContent`

You can literally take these names and send them to Cursor: "implement the `<HomePage>` component according to the textual wireframe below".

---

## 🧱 0. Global Layout — `AppShell`

**Component tree (high level):**

* `<AppShell>`

  * `<Sidebar />`
  * `<MainArea>`

    * `<TopBar />`
    * `<MainContent />`

### `<Sidebar>`

* Fixed region on the left side of the window.
* Internal components:

  * `<AppLogoArea>`

    * App icon + name (e.g.: "Readings")
  * `<NavSection>`

    * List of navigation buttons:

      * Home
      * Library
      * Sessions
      * Notes
      * Goals & Statistics
      * Agenda
      * Suggestions (advanced)
      * Reports
      * Archive / Wishlist
      * Settings
  * `<SidebarFooter>`

    * App version (optional)
    * "Export data" shortcut (shortcut to Settings)

### `<TopBar>`

* Horizontal bar at the top of the main area.
* Internal components:

  * `<GlobalSearchInput>`

    * Global search field (placeholder: "Search for books, notes…")
    * Keyboard shortcut: `Ctrl/Cmd + L`
  * `<TopBarActions>`

    * Button "+ Add book" (`<AddBookButton>`)
      * Keyboard shortcut: `Ctrl/Cmd + Shift + B`
    * Button "Start session" (`<StartSessionButton>`)
      * Keyboard shortcut: `Ctrl/Cmd + N`
  * `<TodayProgressIndicator>`

    * Displays quickly:

      * time read today
      * pages read today (can be "x pages today")
  * **Keyboard Navigation:**
    * Arrow keys navigate book lists (up/down).
    * Enter opens book details.
    * Tab navigates through interface elements.
    * Escape closes modals/dialogs.
    * `Ctrl/Cmd + K` opens command palette (future feature).

### `<MainContent>`

* Area that changes according to route/state.
* Renders exactly one of the components:

  * `<HomePage />`
  * `<LibraryPage />`
  * `<BookDetailsPage />`
  * `<BookFormPage />`
  * `<SessionsPage />`
  * `<SessionActivePage />`
  * `<NotesPage />`
  * `<ReadingDiaryPage />`
  * `<GoalsAndStatsPage />`
  * `<AgendaPage />`
  * `<SuggestionsPage />`
  * `<ReportsPage />`
  * `<SettingsPage />`
  * `<ArchiveAndWishlistPage />`
  * `<ProgressCorrectionPage />`

---

## 1. Home / Dashboard Screen — `HomePage` [MVP]

**Structure:**

* `<HomePage>`

  * `<HomeHeaderSection>`

    * Title: "Today"
    * Subtitle: something like "Your reading panel"
  * `<HomeMainGrid>`

    * `<CurrentBookPanel>`
    * `<TodayProgressPanel>`
    * `<MonthGoalPanel>`
    * `<WeekSummaryPanel>`
    * `<DailySuggestionPanel>`

### Internal components:

#### `<CurrentBookPanel>`

* Shows:

  * Cover (`<BookCoverThumbnail>`)
  * Title, author
  * Status (e.g.: "Reading")
  * Progress:

    * bar (`<ProgressBar>`)
    * text "Page X of Y (Z%)"
* Actions:

  * Button "Continue reading"

    * Goes to `<SessionActivePage>` or `<BookDetailsPage>`
  * Button "View book" (details)

#### `<TodayProgressPanel>`

* Title: "Today's progress"
* Content:

  * "Time read today: X min"
  * "Pages read today: Y"
* Can use mini-bars or icons.

#### `<MonthGoalPanel>`

* Title: "Monthly goal"
* Content:

  * Goal (e.g.: "Goal: 600 pages")
  * Progress (e.g.: "You've already read 320 pages (53%)")
  * Progress bar.

#### `<WeekSummaryPanel>`

* Title: "Week summary"
* Content:

  * List of days of the week with reading indicator (e.g.: dot / check)
  * Total sessions in the week
  * Total pages in the week

#### `<DailySuggestionPanel>`

* Title: "Suggestion of the day"
* Content:

  * Can show:

    * the current book itself, or
    * "Book of the week"
  * Cover + title
  * Short text: "Continue X" or "Such book is waiting for you".

---

## 2. Library Screen — `LibraryPage` [MVP]

**Structure:**

* `<LibraryPage>`

  * `<LibraryHeader>`

    * Title: "Library"
    * Button "+ Add book"
  * `<LibraryFiltersBar>`

    * `<StatusFilterDropdown>`
    * `<TypeFilterDropdown>`
    * `<TagsFilterDropdown>`
    * `<SortByDropdown>`
    * `<ViewModeToggle>` (list / grid / cards)
  * `<LibraryContent>`

    * If grid mode: `<BookGrid>`
    * If list mode: `<BookTable>`
    * If cards mode: `<BookCardsList>`

### Components:

#### `<LibraryHeader>`

* Main title.
* Button that opens `<BookFormPage>` in creation mode.

#### `<LibraryFiltersBar>`

* Row with several controls:

  * `StatusFilterDropdown`:

    * Options: All, Not started, Reading, Paused, Completed, Abandoned, Reread.
  * `TypeFilterDropdown`:

    * Options: All, Physical book, Ebook, Audiobook, Article, PDF, Comic…
  * `TagsFilterDropdown`:

    * Multi-select with registered tags.
  * `SortByDropdown`:

    * Options: Title, Addition date, Completion date, Progress, Pages.
  * `ViewModeToggle`:

    * Icon-type buttons: list / grid / cards.

#### `<BookGrid>`

* Responsive grid of `<BookCardCompact>`:

  * Cover
  * Title
  * Author
  * Status badge
  * Thin progress bar
  * Context menu (`<BookCardMenu>`) with:

    * View details
    * Change status
    * Send to Archive
    * Add to Wishlist

#### `<BookTable>`

* Table with `<BookTableRow>` rows:

  * Columns:

    * Cover
    * Title
    * Author
    * Type
    * Status (with inline dropdown)
    * Progress (%)
    * Pages (read/total)
    * Actions (menu icon)

---

## 3. Book Details Screen — `BookDetailsPage` [MVP]

**Structure:**

* `<BookDetailsPage>`

  * `<BookDetailsHeader>`
  * `<BookDetailsTabs>`

### `<BookDetailsHeader>`

* Horizontal layout:

  * Left side:

    * `<BookCoverLarge>`
  * Right side:

    * Title
    * Author
    * Genre
    * Type
    * Status (dropdown)
      * Shows "Completed (2x)" for rereads.
      * Shows "Abandoned" clearly for abandoned books.
    * Pages read / total
    * Progress bar
      * For hybrid text + audiobook: shows combined progress or separate breakdown.
    * Buttons:

      * "Start session"
      * "Update progress"
      * "Edit book"
      * "Correct progress" (opens Progress Correction screen)

### `<BookDetailsTabs>`

* Tabs:

  1. `<BookOverviewTab>`
  2. `<BookSessionsTab>`
  3. `<BookNotesTab>`
  4. `<BookSummaryTab>` (future: summary + mind map)

#### 3.1. `<BookOverviewTab>`

* Sections:

  * "General information"

    * Static fields: year, tags, collections etc.
  * "Book-specific statistics"

    * Simple progress graph over time.

#### 3.2. `<BookSessionsTab>`

* List of sessions only from this book:

  * Date, duration, pages read, notes.
* Actions:
  * View session details
  * Edit session (inline or opens correction screen)
  * Delete session (with confirmation)
* Button "See all sessions" (goes to `<SessionsPage>` with filter applied).
* Button "Correct progress" (opens `<ProgressCorrectionPage>` for this book).
* **Special states:**
  * Rereads: shows which reading cycle each session belongs to.
  * Hybrid: shows format type (text/audio) if applicable.

#### 3.3. `<BookNotesTab>`

* Filterable list of notes:

  * Page
  * Excerpt (if any)
  * Note text
  * Feeling tags.
* Button "New note".

#### 3.4. `<BookSummaryTab>` (advanced)

* Area with:

  * "Automatic book summary" (generated text)
  * "Mind map" (placeholder for visual)
* Button "Regenerate summary" (when implementing automatic).

---

## 4. Book Registration/Edit Screen — `BookFormPage` [MVP]

**Structure:**

* `<BookFormPage>`

  * `<BookFormHeader>`
  * `<BookForm>`

### `<BookFormHeader>`

* Title:

  * "New book" or "Edit book"
* Buttons:

  * "Save"
  * "Cancel"

### `<BookForm>`

* Two-column layout (if it fits):

  * Left column:

    * Title field
    * Author field
    * Genre field
    * Type field (select)
    * Year field (optional)
    * Number of pages or duration field (depending on type)
  * Right column:

    * Tags field (multi)
    * Collection field
    * URL field (for articles/PDFs)
    * Cover upload (`<CoverUploadField>`)
  * Footer:

    * Switch or select for initial Status (Not started, Reading etc.)

---

## 5. Reading Sessions Screen — `SessionsPage` [MVP]

**Structure:**

* `<SessionsPage>`

  * `<SessionsHeader>`
  * `<SessionsFiltersBar>`
  * `<SessionsList>`

### `<SessionsHeader>`

* Title: "Reading sessions"
* Button "+ New session" (manual, without timer).

### `<SessionsFiltersBar>`

* Filters:

  * Book dropdown
  * Date range
  * Minimum/maximum duration (optional)

### `<SessionsList>`

* Table or list of `<SessionItem>`:

  * Date
  * Book (name + small cover)
  * Pages (start → end)
  * Duration
  * Quick note (summary)
  * Actions:

    * View details
    * Edit session
    * Delete session

---

## 6. "New Session" / Active Reading Screen — `SessionActivePage` [MVP]

**Structure:**

* `<SessionActivePage>`

  * `<SessionActiveHeader>`
  * `<SessionActiveBody>`

### `<SessionActiveHeader>`

* Shows:

  * Selected book (cover + title)
  * Current status
* If user entered without book, `Select` to choose the book.

### `<SessionActiveBody>`

* Divided into two columns:

  * Left column:

    * `<TimerPanel>`

      * Timer with buttons:

        * Start
        * Pause
        * End
    * Fields:

      * Starting page (input)
      * Ending page (input)
      * Button "Fill ending page with current + X" (optional)
  * Right column:

    * `<SessionQuickNote>`

      * Text field for quick session note.

* Footer:

  * Button "Save session"
  * Button "Cancel"

---

## 7. Global Notes Screen — `NotesPage` [MVP]

**Structure:**

* `<NotesPage>`

  * `<NotesHeader>`
  * `<NotesFiltersBar>`
  * `<NotesList>`

### `<NotesHeader>`

* Title: "Notes"
* Button "Export notes" (future).

### `<NotesFiltersBar>`

* Filters:

  * Book (dropdown)
  * Feeling tag
  * General tag
  * Text search field (full-text in notes)

### `<NotesList>`

* List of `<NoteItem>`:

  * Book (title)
  * Page
  * Excerpt (if any)
  * Note text (preview)
  * Feeling (badge)
  * Note date
  * Actions: open, edit, delete.

---

## 8. Reading Journal Screen — `ReadingDiaryPage` [Advanced]

**Structure:**

* `<ReadingDiaryPage>`

  * `<DiaryHeader>`
  * `<DiaryFiltersBar>`
  * `<DiaryTimeline>`

### `<DiaryHeader>`

* Title: "Reading journal"
* Button "New entry"

### `<DiaryTimeline>`

* Chronological list of `<DiaryEntryCard>`:

  * Date
  * Book (optional)
  * Emojis / feeling
  * Entry text
  * Actions: edit, delete.

---

## 9. Goals & Statistics Screen — `GoalsAndStatsPage` [MVP]

**Structure:**

* `<GoalsAndStatsPage>`

  * `<GoalsSection>`
  * `<StatsSection>`
  * `<HighlightsSection>`

### `<GoalsSection>`

* Cards:

  * Annual book goal
  * Monthly page goal
  * Daily minute goal

Each card:

* Configured goal
* Current progress
* Button "Edit goal"

### `<StatsSection>`

* Graphs:

  * Pages per month (`<PagesPerMonthChart>`)
  * Books per year (`<BooksPerYearChart>`)
  * Most read genres (`<GenresDistributionChart>`)

### `<HighlightsSection>`

* Cards with phrases and numbers:

  * "Most productive day"
  * "Longest book"
  * "Strongest month"

---

## 10. Agenda / Calendar Screen — `AgendaPage` [Advanced]

**Structure:**

* `<AgendaPage>`

  * `<AgendaHeader>`
  * `<AgendaCalendar>`

### `<AgendaHeader>`

* Title: "Reading agenda"
* Buttons:

  * "Today"
  * Navigate previous / next month
  * "Add reading block"

### `<AgendaCalendar>`

* Monthly or weekly view.
* Each day cell contains:

  * List of reading blocks (`<ReadingBlock>`):

    * time
    * book
* When clicking a day:

  * opens `<DayDetailsDrawer>` with:

    * Completed sessions
    * Future blocks
    * Total reading time for the day.

---

## 11. Suggestions / Book of the Week Screen — `SuggestionsPage` [Advanced]

**Structure:**

* `<SuggestionsPage>`

  * `<SuggestionsHeader>`
  * `<BookOfTheWeekPanel>`
  * `<SuggestionsList>`

### `<BookOfTheWeekPanel>`

* Visual highlight:

  * large cover
  * title, author
  * reason for choice (e.g.: "Unstarted book from genre you read a lot")
  * Buttons:

    * "Start now"
    * "Change suggestion" (re-draw)

### `<SuggestionsList>`

* Sections:

  * "Based on genres you read most"
  * "Short books to finish quickly"
  * "Long books for immersion"
* Each section:

  * Carousel or list of `<SuggestionCard>`:

    * cover, title, author
    * brief explanation (e.g.: "Short science fiction of 180 pages")
    * actions:

      * "Set as next"
      * "View details"

---

## 12. Annual Report Screen — `ReportsPage` [Advanced]

**Structure:**

* `<ReportsPage>`

  * `<ReportsHeader>`
  * `<YearSelector>`
  * `<YearSummaryGrid>`

### `<YearSummaryGrid>`

* Cards:

  * Total books read
  * Total pages
  * Fastest book
  * Book with most notes
  * Dominant genre
  * Most productive day
* Timeline (`<YearTimeline>`):

  * Displays months with completed books.
* Button "Export report as PDF".

---

## 13. Settings & Preferences Screen — `SettingsPage` [MVP]

**Structure:**

* `<SettingsPage>`

  * `<SettingsSidebar>` (internal to screen)

    * Sections:

      * Appearance
      * Behavior
      * Notifications
      * Data
      * Shortcuts
  * `<SettingsContent>`

### Example blocks:

#### 1. Appearance Section

* `<ThemeSettingCard>`

  * Light / Dark toggle
* `<FontSizeSettingCard>`

  * Small / Standard / Large options
  * Applies globally to all text elements
* `<LineSpacingSettingCard>`

  * Line spacing adjustment slider or selector
* `<HighContrastModeToggle>`

  * Toggle high contrast mode
* `<HighFocusModeToggle>`

  * Toggle High Focus Mode
  * Reduces decorative elements
  * Hides secondary graphs and cards

#### 2. Behavior Section

* `<DefaultProgressUnitCard>`

  * Default unit selector: page / %
* `<DefaultSessionBehaviorCard>`

  * Checkbox: "Open timer automatically when starting session"
* `<DefaultStartPageCard>`

  * Input/selector: "Default start page when creating a new book"
  * Example: "1" or "Current page"

#### 3. Notifications Section

* `<DailyReminderToggle>`

  * Enable/disable daily reminder
* `<ReadingPromptToggle>`

  * Enable/disable "you haven't read today" prompt
* `<GoalReminderToggle>`

  * Enable/disable goal reminders

#### 4. Data Section

* `<BackupFolderLocationCard>`

  * Displays current backup folder location
  * Button "Change location"
* `<LastBackupIndicator>`

  * Shows last backup date: "Last backup: [date]" or "Never"
* `<FullBackupExport>`

  * Button "Export full backup"
  * Exports everything to JSON file (e.g.: `reading-backup-2025-11-20.json`)
* `<PartialExport>`

  * Button "Export partial data"
  * Options:
    * Export year statistics
    * Export single book data
* `<ImportBackup>`

  * Button "Import backup"
  * Options: overwrite or merge
  * Validates data before import
  * Shows preview

#### 5. Shortcuts Section

* `<KeyboardShortcutsReference>`

  * Shows all available keyboard shortcuts in organized list:
    * `Ctrl/Cmd + L` → Open search / library
    * `Ctrl/Cmd + N` → New session
    * `Ctrl/Cmd + Shift + B` → New book
    * `Ctrl/Cmd + K` → Command palette (future)
    * Arrow keys → Navigate lists
    * Enter → Open details
    * Tab → Navigate interface
    * Escape → Close modals

---

## 14. Archive and Wishlist Screen — `ArchiveAndWishlistPage` [Advanced]

**Structure:**

* `<ArchiveAndWishlistPage>`

  * `<ArchiveAndWishlistTabs>`

    * "Archive" tab
    * "Wishlist" tab

### Archive Tab

* List of `<ArchivedBookItem>`:

  * cover, title, author, reason (abandoned/archived)
  * button "Restore to Library"

### Wishlist Tab

* List of `<WishlistBookItem>`:

  * title, author, tags
    * button "Move to Library (Not started)"
    * button "Set reading goal (year/month)"

---

## 15. Progress Correction Screen — `ProgressCorrectionPage` [MVP]

**Structure:**

* `<ProgressCorrectionPage>`

  * `<ProgressCorrectionHeader>`
  * `<BookInfoPanel>`
  * `<SessionsList>`
  * `<ValidationPanel>`

### `<ProgressCorrectionHeader>`

* Title: "Correct Progress" or "Session History"
* Shows selected book (cover + title + author).
* Button "Back to book details".

### `<BookInfoPanel>`

* Current book information:
  * Total pages
  * Current page
  * Progress %
  * Status

### `<SessionsList>`

* Table or list of `<SessionItemEditable>`:
  * Date (editable)
  * Start page (editable)
  * End page (editable)
  * Duration (editable)
  * Quick note (editable)
  * Actions:
    * Save changes
    * Delete session (with confirmation)
* **Validation indicators:**
  * Warns if end page < start page
  * Warns if current page > total pages
  * Highlights inconsistencies

### `<ValidationPanel>`

* Shows validation status:
  * Number of sessions
  * Data consistency checks
  * Warnings about potential issues
* Button "Recalculate progress" (after making changes).

**Access:** Accessed from Book Details → Sessions tab → "Correct progress" button.

---

If you want, in the next step I can:

* Take **only the MVP** and transform this into a **set of tasks/epics for Cursor** (like backlog), or
* Write a **natural language description per component**, like:
  "Implement `<HomePage>` with props X, using components Y and Z".

Which of the two do you prefer now?
