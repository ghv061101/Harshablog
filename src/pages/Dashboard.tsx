import { useState } from "react";
import { Navbar } from "./../components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsManager } from "@/components/dashboard/PostManager";
import { CategoriesManager } from "@/components/dashboard/CategoriesManager";
import { SeedButton } from "@/components/SeedButton";
import { LayoutDashboard, FolderOpen } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your blog posts and categories</p>
          </div>
          <SeedButton />
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <PostsManager />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoriesManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
