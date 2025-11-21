import { useNavigate } from 'react-router-dom';
import { Section, Stack } from '@/components/ui/layout';
import { Heading } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { Plus, Play, Library } from 'lucide-react';

export function QuickActionsPanel() {
  const navigate = useNavigate();

  return (
    <Section padding="md">
      <Stack spacing="sm">
        <Heading level={4}>Quick Actions</Heading>
        <div className="space-y-1 pt-2">
          <Button
            onClick={() => navigate('/book/new')}
            variant="ghost"
            fullWidth
            showBorder={false}
            className="text-left justify-start"
            icon={<Plus />}
            iconPosition="left"
          >
            Add New Book
          </Button>
          <Button
            onClick={() => navigate('/session/new')}
            variant="ghost"
            fullWidth
            showBorder={false}
            className="text-left justify-start"
            icon={<Play />}
            iconPosition="left"
          >
            Start Session
          </Button>
          <Button
            onClick={() => navigate('/library')}
            variant="ghost"
            fullWidth
            showBorder={false}
            className="text-left justify-start"
            icon={<Library />}
            iconPosition="left"
          >
            View Library
          </Button>
        </div>
      </Stack>
    </Section>
  );
}

