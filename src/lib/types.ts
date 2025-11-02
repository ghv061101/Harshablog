export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_name: string;
  author_avatar: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category[];
}

export interface PostWithCategories extends Post {
  post_categories: Array<{
    category_id: string;
    categories: Category;
  }>;
}
