import React from 'react';
import { SessionEvent, Book } from './types';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { Stack } from '@/components/ui/layout';

interface SessionsListProps {
  sessions: SessionEvent[];
  books: Book[];
}

export function SessionsList({ sessions, books }: SessionsListProps) {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <div>
      <Heading level={4} className="text-base mb-2">Sessions</Heading>
      <Stack spacing="sm">
        {sessions.map((session) => {
          const book = books.find(b => b.id === session.book_id);
          return (
            <div key={session.id} className="p-3 rounded-md bg-background-surface border border-background-border">
              <div className="flex items-center justify-between">
                <div>
                  {book && (
                    <Paragraph className="text-sm font-medium">{book.title}</Paragraph>
                  )}
                  <MetaText className="text-xs">
                    {session.pages_read || 0} pages • {session.minutes_read || 0} minutes
                  </MetaText>
                </div>
              </div>
            </div>
          );
        })}
      </Stack>
    </div>
  );
}

