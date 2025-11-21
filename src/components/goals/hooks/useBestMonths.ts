import { useMemo } from 'react';

interface MonthStat {
  year: number;
  month: number;
  pages: number;
}

interface Statistics {
  pages_per_month: MonthStat[];
}

export type { MonthStat };

export function useBestMonths(statistics: Statistics | null) {
  return useMemo(() => {
    if (!statistics) return null;

    const bestMonths = [...statistics.pages_per_month]
      .sort((a, b) => b.pages - a.pages)
      .slice(0, 3);

    return {
      bestMonths,
    };
  }, [statistics]);
}

