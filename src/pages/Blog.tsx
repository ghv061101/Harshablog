import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import type { Post, PostWithCategories } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          post_categories(
            category_id,
            categories(*)
          )
        `)
        .eq("published", true)
        .order("published_at", { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;

      // Transform the data to include categories
      const transformedPosts: Post[] = (data as PostWithCategories[]).map((post) => ({
        ...post,
        categories: post.post_categories?.map((pc) => pc.categories) || [],
      }));

      // Filter by category if selected
      if (selectedCategory) {
        return transformedPosts.filter((post) =>
          post.categories?.some((cat) => cat.id === selectedCategory)
        );
      }

      return transformedPosts;
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Posts</h1>
          <p className="text-lg text-muted-foreground">
            Explore our latest articles and insights
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-gradient-to-r from-primary to-accent" : ""}
            >
              All Posts
            </Button>
            {categoriesLoading ? (
              <>
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </>
            ) : (
              categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-gradient-to-r from-primary to-accent" : ""}
                  style={
                    selectedCategory !== category.id
                      ? {
                          borderColor: `${category.color}50`,
                          color: category.color,
                        }
                      : undefined
                  }
                >
                  {category.name}
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {postsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {selectedCategory
                ? "No posts found in this category."
                : "No posts available yet."}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
