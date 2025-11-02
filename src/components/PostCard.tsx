import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ArrowUpRight, Calendar } from "lucide-react";
import type { Post } from "@/lib/types";
import { format } from "date-fns";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const authorInitials = post.author_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Link to={`/blog/${post.slug}`}>
      <Card className="group h-full hover:shadow-lg transition-all duration-300 border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author_avatar || undefined} alt={post.author_name} />
              <AvatarFallback className="bg-primary/10 text-primary">{authorInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{post.author_name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.published_at ? format(new Date(post.published_at), "dd MMM yyyy") : "Draft"}
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          
          <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>
        
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {post.categories?.map((category) => (
              <CategoryBadge key={category.id} category={category} />
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
