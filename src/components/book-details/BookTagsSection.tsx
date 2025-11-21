import { Tag } from '@/components/ui/tags';
import { MetaText } from '@/components/ui/typography';

interface Tag {
  id: number;
  name: string;
  color: string | null;
}

interface BookTagsSectionProps {
  tags: Tag[];
}

export function BookTagsSection({ tags }: BookTagsSectionProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div>
      <MetaText className="mb-2 block">Tags</MetaText>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag
            key={tag.id}
            name={tag.name}
            color={tag.color || undefined}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
}

