import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { slugify } from "@/lib/slugify";
import type { Post } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import { Loader2 } from "lucide-react";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  slug: z.string().min(1, "Slug is required").max(200, "Slug is too long"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500, "Excerpt is too long").optional(),
  author_name: z.string().min(1, "Author name is required").max(100, "Author name is too long"),
  author_avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
  category_ids: z.array(z.string()).min(1, "Select at least one category"),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  post?: Post | null;
}

export function PostEditor({ isOpen, onClose, post }: PostEditorProps) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      author_name: "",
      author_avatar: "",
      published: false,
      category_ids: [],
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || "",
        author_name: post.author_name,
        author_avatar: post.author_avatar || "",
        published: post.published,
        category_ids: post.categories?.map((c) => c.id) || [],
      });
      setContent(post.content);
    } else {
      form.reset({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        author_name: "",
        author_avatar: "",
        published: false,
        category_ids: [],
      });
      setContent("");
    }
  }, [post, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const postData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt || null,
        author_name: data.author_name,
        author_avatar: data.author_avatar || null,
        published: data.published,
        published_at: data.published ? new Date().toISOString() : null,
      };

      if (post) {
        // Update existing post
        const { error: postError } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", post.id);

        if (postError) throw postError;

        // Update categories
        await supabase.from("post_categories").delete().eq("post_id", post.id);
        
        const categoryInserts = data.category_ids.map((catId) => ({
          post_id: post.id,
          category_id: catId,
        }));

        const { error: catError } = await supabase
          .from("post_categories")
          .insert(categoryInserts);

        if (catError) throw catError;
      } else {
        // Create new post
        const { data: newPost, error: postError } = await supabase
          .from("posts")
          .insert([postData])
          .select()
          .single();

        if (postError) throw postError;

        const categoryInserts = data.category_ids.map((catId) => ({
          post_id: newPost.id,
          category_id: catId,
        }));

        const { error: catError } = await supabase
          .from("post_categories")
          .insert(categoryInserts);

        if (catError) throw catError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(post ? "Post updated successfully" : "Post created successfully");
      onClose();
    },
    onError: (error: Error) => {
      toast.error("Failed to save post: " + error.message);
    },
  });

  const onSubmit = (data: PostFormData) => {
    saveMutation.mutate(data);
  };

  const handleTitleChange = (value: string) => {
    form.setValue("title", value);
    if (!post) {
      form.setValue("slug", slugify(value));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Post" : "Create New Post"}</DialogTitle>
          <DialogDescription>
            {post ? "Update your blog post" : "Create a new blog post with markdown"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter post title"
                      {...field}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="post-url-slug" {...field} />
                  </FormControl>
                  <FormDescription>URL-friendly version of the title</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="author_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author_avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Avatar URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/avatar.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary of your post..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_ids"
              render={() => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <div className="flex flex-wrap gap-4">
                    {categories?.map((category) => (
                      <FormField
                        key={category.id}
                        control={form.control}
                        name="category_ids"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  const newValue = checked
                                    ? [...currentValue, category.id]
                                    : currentValue.filter((id) => id !== category.id);
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {category.name}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (Markdown)</FormLabel>
                  <Tabs defaultValue="write" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="write" className="mt-2">
                      <FormControl>
                        <Textarea
                          placeholder="Write your post content in markdown..."
                          className="resize-none font-mono"
                          rows={15}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setContent(e.target.value);
                          }}
                        />
                      </FormControl>
                    </TabsContent>
                    <TabsContent value="preview" className="mt-2">
                      <div className="border rounded-md p-4 min-h-[300px] max-h-[400px] overflow-y-auto prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{content || "Nothing to preview yet..."}</ReactMarkdown>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publish Post</FormLabel>
                    <FormDescription>
                      Make this post visible to everyone
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
                className="bg-gradient-to-r from-primary to-accent"
              >
                {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {post ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
