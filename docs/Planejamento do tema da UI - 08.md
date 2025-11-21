Great catch, these really complete the app’s mental model. Let’s plug them into the structure you already have.

Below is an updated **`features/` folder** including:

* `archive/`
* `wishlist/`
* `agenda/`
* `journal/`
* expanded `settings/`

You can paste this into a spec for Cursor.

---

## 🗂 Updated `src/features` structure

```txt
src/
  features/
    home/
      HomeScreen.tsx
      HomeHeader.tsx
      HomeCurrentTomePanel.tsx
      HomeTodayStatsPanel.tsx
      HomeMonthlyQuestPanel.tsx
      index.ts

    library/
      LibraryScreen.tsx
      LibraryFilters.tsx
      LibraryGrid.tsx
      LibrarySpineView.tsx
      index.ts

    book-details/
      BookDetailsScreen.tsx
      BookProgressSection.tsx
      BookSessionsSection.tsx
      BookNotesSection.tsx
      BookInsightsSection.tsx
      index.ts

    sessions/
      SessionsScreen.tsx
      SessionForm.tsx
      SessionList.tsx
      SessionFilters.tsx
      index.ts

    notes/
      NotesScreen.tsx
      NotesFilterBar.tsx
      NotesGrid.tsx
      NoteDetailsModal.tsx
      index.ts

    stats/
      StatsScreen.tsx
      StatsOverviewPanel.tsx
      StatsGenresPanel.tsx
      StatsHeatmapPanel.tsx
      StatsRereadsPanel.tsx
      index.ts

    /* 🆕 ARCHIVE (abandoned / hidden tomes) */
    archive/
      ArchiveScreen.tsx              // list of archived / abandoned books
      ArchiveFilters.tsx             // status filters, type filters
      ArchiveList.tsx                // uses TomeCard in "dimmed" style
      RestoreTomeDialog.tsx          // confirm restore
      index.ts

    /* 🆕 WISHLIST (to-read / plan to read) */
    wishlist/
      WishlistScreen.tsx             // main wishlist view
      WishlistFilters.tsx            // tag/year/genre filters
      WishlistList.tsx               // uses TomeCard + “Move to Library” actions
      WishlistPlanningPanel.tsx      // assign target year/priority
      index.ts

    /* 🆕 AGENDA (planning & schedule of reading blocks) */
    agenda/
      AgendaScreen.tsx               // calendar view wrapper
      AgendaCalendar.tsx             // month/week calendar (ReadingHeatmap style + blocks)
      AgendaDayView.tsx              // specific day: sessions + planned blocks
      AgendaBlockForm.tsx            // create/edit planned reading block
      AgendaSidebar.tsx              // filters by book, time-of-day, etc.
      index.ts

    /* 🆕 JOURNAL (Reading Journal / Diary) */
    journal/
      JournalScreen.tsx              // timeline of entries + editor
      JournalEntryList.tsx           // list of entries (grouped by date)
      JournalEntryEditor.tsx         // writing area (uses ScrollInput / AAParagraph)
      JournalFilters.tsx             // filter by book, mood, tag
      JournalEntryDetailsModal.tsx   // expanded read-only view
      index.ts

    /* ✅ SETTINGS (expanded) */
    settings/
      SettingsScreen.tsx             // overall layout (tabs/sections)
      SettingsSidebar.tsx            // list of sections: Appearance, Reading, Data, Shortcuts
      ThemeSettings.tsx              // light/dark, high contrast, font sizes
      ReadingPreferences.tsx         // default units, session behavior, reread behavior
      NotificationsSettings.tsx      // daily reminder, “haven’t read today”, etc.
      BackupRestorePanel.tsx         // export/import, validation results
      ShortcutsSettings.tsx          // show + edit keyboard shortcuts (read-only at first)
      ExperimentalSettings.tsx       // toggles for future stuff (recommendations, mood prompt)
      index.ts
```

---

### How they map to the Antique UI kit

* **Archive/Wishlist**

  * Compose mainly: `TomeCard`, `TomeList`, `BrassSelect`, `BrassTag`, `GhostButton`, `AAModal`.

* **Agenda**

  * Use `ReadingHeatmap`, `AACard`, `BrassButton`, `CandleToggle`, maybe a mini `LedgerTable` for sessions-of-the-day.

* **Journal**

  * Use `MarginaliaCard`, `ScrollInput`, `AAParagraph`, `AAMetaText`, `AAModal`.

* **Settings**

  * Use `AASection`, `CandleToggle`, `BrassSelect`, `ScrollInput`, `BrassButton` for backup/export actions.

If you want, next step I can:

* Turn this into **explicit Cursor tasks** (“create these files with these stub components”), or
* Stub the **`ArchiveScreen`, `WishlistScreen`, `AgendaScreen`, `JournalScreen`, `SettingsScreen`** with basic TSX + layout using your Antique kit naming.
