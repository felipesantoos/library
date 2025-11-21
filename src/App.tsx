import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/ui/AppShell";
import { Container } from "./components/ui/layout";
import { Heading } from "./components/ui/typography";
import { LibraryPage } from "./pages/LibraryPage";
import { BookFormPage } from "./pages/BookFormPage";
import { BookDetailsPage } from "./pages/BookDetailsPage";
import { SessionsPage } from "./pages/SessionsPage";
import { SessionActivePage } from "./pages/SessionActivePage";
import { SessionEditPage } from "./pages/SessionEditPage";
import { ProgressCorrectionPage } from "./pages/ProgressCorrectionPage";
import { HomePage } from "./pages/HomePage";
import { NotesPage } from "./pages/NotesPage";
import { GoalsPage } from "./pages/GoalsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ArchivePage } from "./pages/ArchivePage";
import { WishlistPage } from "./pages/WishlistPage";
import { CollectionsPage } from "./pages/CollectionsPage";
import { JournalPage } from "./pages/JournalPage";
import { AgendaPage } from "./pages/AgendaPage";
import { KeyboardShortcutsHandler } from "./components/KeyboardShortcutsHandler";

// ArchivePage and WishlistPage are imported above

// SettingsPage is imported above

function App() {
  return (
    <BrowserRouter>
      <KeyboardShortcutsHandler />
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/book/new" element={<BookFormPage />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/book/:id/edit" element={<BookFormPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/session/new" element={<SessionActivePage />} />
          <Route path="/session/:id/edit" element={<SessionEditPage />} />
          <Route path="/book/:id/progress-correction" element={<ProgressCorrectionPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;

