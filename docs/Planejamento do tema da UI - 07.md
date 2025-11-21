Nice, this is the fun part 😌
Let’s give your **Antique Academia** app a **Cursor-ready folder structure** so you can plug code in without thinking about organization again.

I’ll assume:

* React + TypeScript
* Tailwind or CSS modules (doesn’t really matter – structure is generic)
* `src/` root

---

## 🗂 High-level structure

```txt
src/
  components/
  features/
  pages/          // or routes/, if you use a router
  theme/
  lib/
  assets/
```

You’ll care mainly about **`components/`**, **`features/`** and **`theme/`** for now.

---

## 🧱 `components/` – UI Kit + Thematic components

```txt
src/
  components/
    ui/                # Generic UI primitives (buttons, inputs, cards, etc.)
      buttons/
        BrassButton.tsx
        GhostButton.tsx
        QuillIconButton.tsx
        index.ts
      inputs/
        ScrollInput.tsx
        QuillSearchBar.tsx
        BrassSelect.tsx
        CandleToggle.tsx
        index.ts
      layout/
        AAContainer.tsx
        AASection.tsx
        AAStack.tsx
        AASidebar.tsx
        AATopBar.tsx
        AATabs.tsx
        AAModal.tsx
        index.ts
      data-display/
        AACard.tsx
        InkProgressBar.tsx
        BrassTag.tsx
        RibbonBookmark.tsx
        WaxSealBadge.tsx
        ReadingHeatmap.tsx
        GenreBarChart.tsx
        index.ts
      feedback/
        AAToast.tsx
        LoadingSpinner.tsx
        EmptyState.tsx
        index.ts
      typography/
        AAHeading.tsx
        AAParagraph.tsx
        AAMetaText.tsx
        index.ts

    thematic/          # Domain + antique flavor components
      tome/
        TomeCard.tsx
        TomeCardLarge.tsx
        TomeList.tsx
        BookSpineItem.tsx
        index.ts
      marginalia/
        MarginaliaCard.tsx
        MarginaliaList.tsx
        index.ts
      ledger/
        LedgerTable.tsx
        LedgerRow.tsx
        index.ts
      quests/
        QuestCard.tsx
        AchievementGrid.tsx
        index.ts
      shells/
        StudyShell.tsx          # Main app shell (sidebar + topbar)
        HomeSectionCards.tsx
        StatsSectionPanels.tsx
        index.ts

    icons/
      QuillIcon.tsx
      TomeIcon.tsx
      HourglassIcon.tsx
      WaxSealIcon.tsx
      BookmarkRibbonIcon.tsx
      index.ts
```

### Why this layout?

* `components/ui/` = **generic, reusable** design system (could be reused in other apps).
* `components/thematic/` = **reading-specific** + **antique styling** glued together.
* `icons/` = your themed icon set in one place.
* Each subfolder has an `index.ts` to re-export – makes imports clean, especially in Cursor.

---

## 📚 `features/` – Screen-level logic & composition

This is where you **assemble** UI components into full screens tied to the app’s domain.

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
      index.ts
    notes/
      NotesScreen.tsx
      NotesFilterBar.tsx
      NotesGrid.tsx
      index.ts
    stats/
      StatsScreen.tsx
      StatsOverviewPanel.tsx
      StatsGenresPanel.tsx
      StatsHeatmapPanel.tsx
      index.ts
    settings/
      SettingsScreen.tsx
      ThemeSettings.tsx
      ReadingPreferences.tsx
      BackupRestorePanel.tsx
      index.ts
```

* `features/*/` = **screen-composition**, not low-level UI.
* Each screen imports from `components/ui` + `components/thematic`.

---

## 🎨 `theme/` – Tokens & Provider

```txt
src/
  theme/
    tokens.ts          // all design tokens (colors, spacing, radii, etc.)
    AntiqueThemeProvider.tsx
    useTheme.ts        // hook for light/dark/high-contrast, etc.
    index.ts
```

**`tokens.ts`** contains your Antique variables (the ones we defined earlier: parchment colors, brass, fonts, etc.).
**`AntiqueThemeProvider`** wires that into context / Tailwind / CSS vars.

---

## 🧩 Example of how it all connects

**Home screen** (`features/home/HomeScreen.tsx`) will typically look like:

```tsx
// pseudo-structure, not full code

import { StudyShell } from "@/components/thematic/shells";
import { TomeCardLarge } from "@/components/thematic/tome";
import { QuestCard } from "@/components/thematic/quests";
import { AASection, AAStack } from "@/components/ui/layout";
import { InkProgressBar } from "@/components/ui/data-display";

export function HomeScreen() {
  return (
    <StudyShell>
      <AAStack>
        <AASection>
          <TomeCardLarge /* current book props */ />
        </AASection>

        <AASection>
          {/* Today stats composed with InkProgressBar, BrassTag, etc. */}
        </AASection>

        <AASection>
          <QuestCard /* monthly goal */ />
        </AASection>
      </AAStack>
    </StudyShell>
  );
}
```

---

## 💡 Suggested implementation order (for Cursor)

If you want to feed this into Cursor as tasks, a good order is:

1. **Theme + primitives**

   * `theme/tokens.ts`
   * `components/ui/layout/*`
   * `components/ui/typography/*`
2. **Core controls**

   * `BrassButton`, `ScrollInput`, `BrassSelect`, `CandleToggle`, `AAModal`
3. **Key data display**

   * `AACard`, `InkProgressBar`, `BrassTag`, `WaxSealBadge`
4. **Thematic components**

   * `TomeCard`, `TomeCardLarge`, `MarginaliaCard`, `LedgerTable`
5. **Shell + screens**

   * `StudyShell`, then `HomeScreen`, `LibraryScreen`, etc.

---

If you want, I can now:

* Turn this tree into a **Cursor prompt** with “create these files and stub these components”,
* Or generate **starter TSX stubs** for 5–10 key components (`BrassButton`, `ScrollInput`, `AACard`, `TomeCard`, `StudyShell`).
