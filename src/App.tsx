import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "./components/ui/AppShell";
import { KeyboardShortcutsHandler } from "./components/KeyboardShortcutsHandler";
import { useSettingsLoader } from "./hooks/useSettingsLoader";
import { BookPageTransitionWrapper } from "./components/ui/BookPageTransitionWrapper";

function App() {
  // Load settings from backend on app startup
  useSettingsLoader();

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        duration={3000}
        expand={true}
        gap={0}
      />
      <KeyboardShortcutsHandler />
      <AppShell>
        <BookPageTransitionWrapper />
      </AppShell>
    </BrowserRouter>
  );
}

export default App;

