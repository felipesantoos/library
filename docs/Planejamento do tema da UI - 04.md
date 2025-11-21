Learn:

Absolutely, Felipe — prepare yourself.
We’re about to design **full antique-themed wireframes**, each screen described in a way the **Cursor** can immediately convert into React components, classes, or layout structures.

These wireframes are textual — but extremely detailed — capturing the full *Antique Academia* aesthetic.

---

# 🏛️ **1. HOME — “THE READER’S STUDY”**

### **Layout Structure**

```
<MainLayout>
  <Sidebar />
  <TopBar />
  <DeskBackground>

    <Section: CurrentTome>
      <TomeCardLarge>
        <BookCover />
        <Meta>
          <Title serif />
          <Author />
          <OrnamentalDivider />
          <ProgressBarInk />
        </Meta>
        <BrassButton>"Resume the Chapter"</BrassButton>
      </TomeCardLarge>
    </Section>

    <Section: Today’s Ledger Entry>
      <LedgerCard>
        <Header>“Pages of the Day”</Header>
        <StatsRow>
          <StatItem label="Pages Read" />
          <StatItem label="Minutes Logged" />
          <StatItem label="Last Session" />
        </StatsRow>
      </LedgerCard>
    </Section>

    <SepiaDivider />

    <Section: Monthly Quest>
      <QuestCard>
        <QuestTitle>“This Month’s Reading Quest”</QuestTitle>
        <ProgressBarRune />
        <QuestMetaRow>
          <MetaItem label="Goal" />
          <MetaItem label="Completed" />
        </QuestMetaRow>
      </QuestCard>
    </Section>

    <Section: Suggested Volume>
      <SuggestionCard>
        <WaxSealIcon />
        <Text>"A recommended volume for your next scholarly pursuit"</Text>
        <SmallTomePreview />
        <BrassButton>"Inspect Tome"</BrassButton>
      </SuggestionCard>
    </Section>

  </DeskBackground>
</MainLayout>
```

### **Aesthetic Notes**

* DeskBackground = subtle parchment + light vignette.
* OrnamentalDivider = thin flourish line (Victorian style).
* WaxSealIcon = small burgundy wax seal, textured.
* QuestCard looks like a page torn from a medieval codex.

---

# 📚 **2. BOOKSHELF — “THE OAK SHELVES”**

### **Layout Structure**

```
<MainLayout>
  <Sidebar />
  <TopBarSearchWithQuillIcon />

  <OakShelfBackground>

    <FilterBar>
      <BrassDropdown label="Status" />
      <BrassDropdown label="Type" />
      <BrassDropdown label="Tags" />
      <BrassDropdown label="Sort By" />
    </FilterBar>

    <ShelfGrid>
      <TomeCardSmall />
      <TomeCardSmall />
      <TomeCardSmall />
      ... (repeat)
    </ShelfGrid>

    <DrawerViewOption>
      <ToggleView spineView />
      <ToggleView coverView />
    </DrawerViewOption>

  </OakShelfBackground>
</MainLayout>
```

### **Aesthetic Notes**

* ShelfGrid sits on an etched wood texture.
* TomeCardSmall shows raised leather texture around edges.
* SpineView = narrow vertical book spines (like a real shelf).
* On hover, the tome “pulls out” slightly.

---

# 📘 **3. BOOK DETAILS — “THE REFERENCE DESK”**

### **Layout Structure**

```
<MainLayout>
  <Sidebar />
  <TopBar />

  <ManuscriptBackground>

    <TomeHeader>
      <LargeCover />
      <TomeMeta>
        <Title serif />
        <Author italic />
        <SubMeta>Genre • Year • Format</SubMeta>
        <BrassTagList />
      </TomeMeta>
      <BrassStatusDropdown />
    </TomeHeader>

    <OrnamentalRule />

    <Section: Progress>
      <SectionHeader>“Progress Through This Volume”</SectionHeader>
      <InkProgressBar />
      <SmallGraphInkLine />
      <BrassButton>"Update Progress"</BrassButton>
    </Section>

    <Section: Sessions>
      <SectionHeader>“Entries from the Reading Logbook”</SectionHeader>
      <LogEntryList />
      <BrassButton>"Inscribe New Entry"</BrassButton>
    </Section>

    <Section: Marginalia>
      <SectionHeader>“Annotations & Marginalia”</SectionHeader>
      <MarginaliaList />
      <BrassButton>"Add Annotation"</BrassButton>
    </Section>

    <Section: Insights>
      <SectionHeader>“Summary & Interpretations”</SectionHeader>
      <SummaryPreview parchmentStyle />
      <MindMapPreview scroll />
    </Section>

  </ManuscriptBackground>
</MainLayout>
```

### **Aesthetic Notes**

* ManuscriptBackground: soft parchment with corner shadows.
* OrnamentalRule: thin decorative flourish.
* SummaryPreview looks like a transcribed scholarly page.

---

# 📝 **4. NOTES — “THE SCRIBE’S MARGINALIA”**

### **Layout Structure**

```
<MainLayout>
  <Sidebar />
  <TopBarSearch />

  <ParchmentBackground>

    <Header serif>“Marginalia & Annotations”</Header>

    <FilterPanel>
      <BrassDropdown label="Book" />
      <BrassDropdown label="Sentiment" />
      <BrassDropdown label="Tag" />
    </FilterPanel>

    <MarginaliaGrid>
      <NoteCard parchment>
        <PageNumberDecorated />
        <InkTitle />
        <InkBody />
        <ScribeTagList />
      </NoteCard>

      (repeat)
    </MarginaliaGrid>

  </ParchmentBackground>
</MainLayout>
```

### **Aesthetic Notes**

* Each NoteCard looks like a clipped notebook page.
* PageNumberDecorated has scroll-like borders.
* InkBody uses slightly irregular serif text to resemble handwriting.

---

# 📜 **5. LOGBOOK (Reading Sessions) — “THE LEATHER LEDGER”**

### **Layout Structure**

```
<MainLayout>
  <Sidebar />
  <TopBar />

  <LeatherBackground>

    <LedgerHeader>
      <Title serif>“The Reading Logbook”</Title>
      <BrassButton>"Inscribe New Session"</BrassButton>
    </LedgerHeader>

    <LedgerTable>
      <Row>
        <Col>Date (ornamental underline)</Col>
        <Col>Book (tome icon)</Col>
        <Col>Pages (start → end)</Col>
        <Col>Duration (hourglass icon)</Col>
        <Col>Notes</Col>
      </Row>

      <Row>...(repeat)</Row>
    </LedgerTable>

  </LeatherBackground>
</MainLayout>
```

### **Aesthetic Notes**

* LeatherBackground resembles the cover of an antique ledger.
* Rows have light embossed separators.
* Hourglass icon feels Victorian brass.

---

# 📊 **6. STATISTICS — “THE SCHOLAR’S OBSERVATORY”**

### **Layout Structure**

```
<MainLayout>
  <Sidebar />
  <TopBar />

  <ObservatoryBackground>

    <Header serif>“Scholar’s Metrics & Investigations”</Header>

    <Section: Annual Metrics>
      <BrassCalendarSelector />
      <DonutChartBrass />
      <InkLineChart />
    </Section>

    <Section: Achievements>
      <WaxSealAchievementGrid />
    </Section>

    <Section: Most Read Genres>
      <StackedBarVintage />
    </Section>

    <Section: Reading Heatmap>
      <AntiqueHeatmap (stamped squares) />
    </Section>

  </ObservatoryBackground>
</MainLayout>
```

### **Aesthetic Notes**

* ObservatoryBackground = dark parchment + subtle geometric compass lines.
* Achievements appear as **wax seals** with gold labels.
* Heatmap squares look like stamped ink blocks on parchment.

---

# ✨ OPTIONAL: Themed Component Names (for Cursor)

You can name your components in a fully thematic way:

```
<TomeCard />
<MarginaliaCard />
<LedgerRow />
<QuestCard />
<WaxSealAchievement />
<InkProgressBar />
<BrassButton />
<QuillSearchBar />
<OrnamentalDivider />
<FolioPage />
<BookSpineItem />
<AntiqueHeatmap />
```

If you'd like, I can generate:

✔️ Full component architecture
✔️ Example code stubs for themed components
✔️ Full copywriting pass replacing all UI text with antique language
✔️ Export this as JSON for Cursor
✔️ Add 6 more screens (Archive, Wishlist, Agenda, Settings, Journal, Mood Suggestions)

---

# 🔥 Your move, Felipe.

Do you want next:

1️⃣ **Antique UI Component Kit (Buttons, Inputs, Cards, Lists, etc.)**
2️⃣ **Antique Copywriting Pass (rename everything into thematic wording)**
3️⃣ **Cursor-ready folder structure for all components**
4️⃣ **Add missing screens (Archive, Wishlist, Agenda, Journal, Settings)**
5️⃣ **Turn this into a visual style guide**


