interface TopBarProgressIndicatorProps {
  pagesRead: number;
  minutesRead?: number;
}

export function TopBarProgressIndicator({
  pagesRead,
  minutesRead,
}: TopBarProgressIndicatorProps) {
  const formatMinutes = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="hidden lg:flex items-center space-x-4 ml-6 text-sm text-text-secondary dark:text-dark-text-secondary">
      <span>
        Today: {pagesRead} {pagesRead === 1 ? 'page' : 'pages'}
        {minutesRead !== undefined && minutesRead > 0 && (
          <span className="ml-2">• {formatMinutes(minutesRead)}</span>
        )}
      </span>
    </div>
  );
}

