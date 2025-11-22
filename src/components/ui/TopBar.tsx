import { useState } from 'react';
import { HandDrawnBorder } from '@/components/ui/HandDrawnBorder';
import {
  TopBarSearchBar,
  TopBarActions,
  TopBarProgressIndicator,
  useHeaderWidth,
  useTodayProgress,
} from '@/components/topbar';

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const { headerRef, width } = useHeaderWidth();
  const { pagesRead, minutesRead } = useTodayProgress();

  return (
    <header
      ref={headerRef}
      className="relative h-16 flex items-center justify-between px-6 bg-background-surface dark:bg-dark-background-surface"
    >
      {width > 0 && (
        <HandDrawnBorder
          width={width}
          height={64}
          borderRadius={0}
          strokeWidth={1}
          sides="bottom"
          className="pointer-events-none"
        />
      )}

      <TopBarSearchBar value={searchQuery} onChange={setSearchQuery} />

      <TopBarActions />

      <TopBarProgressIndicator pagesRead={pagesRead} minutesRead={minutesRead} />
    </header>
  );
}
