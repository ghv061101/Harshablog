import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/types";

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className="font-medium"
      style={{ 
        backgroundColor: `${category.color}15`,
        color: category.color,
        borderColor: `${category.color}30`
      }}
    >
      {category.name}
    </Badge>
  );
}
