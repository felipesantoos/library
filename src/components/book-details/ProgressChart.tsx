import { Section, Stack } from '@/components/ui/layout';
import { Heading } from '@/components/ui/typography';
import { TrendingUp } from 'lucide-react';

interface ProgressDataPoint {
  date: string;
  progress: number;
}

interface ProgressChartProps {
  data: ProgressDataPoint[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  if (data.length === 0) return null;

  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-accent-primary" />
          <Heading level={4}>Progress Over Time</Heading>
        </div>
        <div className="relative w-full h-48 p-4">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percent) => (
              <g key={percent}>
                <line
                  x1="0"
                  y1={(200 * (100 - percent)) / 100}
                  x2="400"
                  y2={(200 * (100 - percent)) / 100}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-background-border opacity-30"
                />
                <text
                  x="0"
                  y={(200 * (100 - percent)) / 100 + 4}
                  className="text-xs fill-text-secondary"
                >
                  {percent}%
                </text>
              </g>
            ))}

            {/* Progress line */}
            <polyline
              points={data
                .map((d, i) => {
                  const x = (400 / (data.length - 1 || 1)) * i;
                  const y = (200 * (100 - d.progress)) / 100;
                  return `${x},${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent-primary"
            />

            {/* Data points */}
            {data.map((d, i) => {
              const x = (400 / (data.length - 1 || 1)) * i;
              const y = (200 * (100 - d.progress)) / 100;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="currentColor"
                  className="text-accent-primary"
                />
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
            {data.length > 0 && (
              <>
                <span>{new Date(data[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                {data.length > 1 && (
                  <span>{new Date(data[data.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                )}
              </>
            )}
          </div>
        </div>
      </Stack>
    </Section>
  );
}

