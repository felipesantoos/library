import { useLocation, useParams } from "react-router-dom";
import { BookPageTransition } from "./BookPageTransition";
import { HomePage } from "../../pages/HomePage";
import { LibraryPage } from "../../pages/LibraryPage";
import { BookFormPage } from "../../pages/BookFormPage";
import { BookDetailsPage } from "../../pages/BookDetailsPage";
import { SessionsPage } from "../../pages/SessionsPage";
import { SessionActivePage } from "../../pages/SessionActivePage";
import { SessionEditPage } from "../../pages/SessionEditPage";
import { ProgressCorrectionPage } from "../../pages/ProgressCorrectionPage";
import { NotesPage } from "../../pages/NotesPage";
import { GoalsPage } from "../../pages/GoalsPage";
import { SettingsPage } from "../../pages/SettingsPage";
import { ArchivePage } from "../../pages/ArchivePage";
import { WishlistPage } from "../../pages/WishlistPage";
import { CollectionsPage } from "../../pages/CollectionsPage";
import { JournalPage } from "../../pages/JournalPage";
import { AgendaPage } from "../../pages/AgendaPage";

function RouteContent() {
  const location = useLocation();
  const params = useParams();
  
  // Render the appropriate component based on the current route
  if (location.pathname === "/") return <HomePage />;
  if (location.pathname === "/library") return <LibraryPage />;
  if (location.pathname === "/book/new") return <BookFormPage />;
  if (location.pathname.endsWith("/edit") && params.id && location.pathname.startsWith("/book/")) return <BookFormPage />;
  if (location.pathname.includes("/progress-correction") && params.id) return <ProgressCorrectionPage />;
  if (params.id && location.pathname.startsWith("/book/") && !location.pathname.includes("/edit") && !location.pathname.includes("/progress-correction")) return <BookDetailsPage />;
  if (location.pathname === "/sessions") return <SessionsPage />;
  if (location.pathname === "/session/new") return <SessionActivePage />;
  if (params.id && location.pathname.startsWith("/session/") && location.pathname.endsWith("/edit")) return <SessionEditPage />;
  if (location.pathname === "/notes") return <NotesPage />;
  if (location.pathname === "/goals") return <GoalsPage />;
  if (location.pathname === "/journal") return <JournalPage />;
  if (location.pathname === "/agenda") return <AgendaPage />;
  if (location.pathname === "/archive") return <ArchivePage />;
  if (location.pathname === "/wishlist") return <WishlistPage />;
  if (location.pathname === "/collections") return <CollectionsPage />;
  if (location.pathname === "/settings") return <SettingsPage />;
  
  return null;
}

export function BookPageTransitionWrapper() {
  return (
    <BookPageTransition>
      <RouteContent />
    </BookPageTransition>
  );
}

