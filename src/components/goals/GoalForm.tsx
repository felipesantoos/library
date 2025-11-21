import { useState } from 'react';
import { CreateGoalCommand } from '@/hooks/useGoals';
import { Section, Stack } from '@/components/ui/layout';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { HandDrawnDropdown } from '@/components/ui/inputs';
import { MetaText } from '@/components/ui/typography';

interface GoalFormProps {
  currentYear: number;
  currentMonth: number;
  onSubmit: (command: CreateGoalCommand) => void;
  onCancel: () => void;
}

export function GoalForm({ currentYear, currentMonth, onSubmit, onCancel }: GoalFormProps) {
  const [goalType, setGoalType] = useState<'pages_monthly' | 'books_yearly' | 'minutes_daily'>('pages_monthly');
  const [targetValue, setTargetValue] = useState<number>(500);
  const [periodYear, setPeriodYear] = useState<number>(currentYear);
  const [periodMonth, setPeriodMonth] = useState<number>(currentMonth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      goal_type: goalType,
      target_value: targetValue,
      period_year: goalType === 'pages_monthly' || goalType === 'books_yearly' ? periodYear : null,
      period_month: goalType === 'pages_monthly' ? periodMonth : null,
      is_active: true,
    });
  };

  return (
    <Section padding="md" className="bg-background-surface border-2 border-accent-primary">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Goal Type *
            </label>
            <HandDrawnDropdown
              options={[
                { value: 'pages_monthly', label: 'Pages (Monthly)' },
                { value: 'books_yearly', label: 'Books (Yearly)' },
                { value: 'minutes_daily', label: 'Minutes (Daily)' },
              ]}
              value={goalType}
              onChange={(value) => setGoalType(value as 'pages_monthly' | 'books_yearly' | 'minutes_daily')}
              placeholder="Select goal type..."
              borderRadius={6}
              strokeWidth={1}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {goalType === 'pages_monthly' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Year
                  </label>
                  <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                    <input
                      type="number"
                      required
                      value={periodYear}
                      onChange={(e) => setPeriodYear(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                      min={2020}
                      max={2100}
                    />
                  </HandDrawnBox>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Month
                  </label>
                  <HandDrawnDropdown
                    options={Array.from({ length: 12 }, (_, i) => i + 1).map((month) => ({
                      value: month,
                      label: new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' }),
                    }))}
                    value={periodMonth}
                    onChange={(value) => setPeriodMonth(value ? (typeof value === 'number' ? value : parseInt(value as string)) : currentMonth)}
                    placeholder="Select month..."
                    borderRadius={6}
                    strokeWidth={1}
                  />
                </div>
              </>
            )}

            {goalType === 'books_yearly' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Year
                </label>
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                  <input
                    type="number"
                    required
                    value={periodYear}
                    onChange={(e) => setPeriodYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                    min={2020}
                    max={2100}
                  />
                </HandDrawnBox>
              </div>
            )}

            {goalType === 'minutes_daily' && (
              <div>
                <MetaText className="text-xs text-text-secondary">
                  Daily goals track minutes read each day. No period selection needed.
                </MetaText>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Target *
            </label>
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
              <input
                type="number"
                required
                min={1}
                value={targetValue}
                onChange={(e) => setTargetValue(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                placeholder={
                  goalType === 'pages_monthly'
                    ? 'e.g., 500 pages'
                    : goalType === 'books_yearly'
                    ? 'e.g., 24 books'
                    : 'e.g., 60 minutes'
                }
              />
            </HandDrawnBox>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Create Goal
            </Button>
          </div>
        </Stack>
      </form>
    </Section>
  );
}

