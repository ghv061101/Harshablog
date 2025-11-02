import { supabase } from "@/integrations/supabase/client";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const { data: existingCategories } = await supabase
      .from("categories")
      .select("id")
      .limit(1);

    if (existingCategories && existingCategories.length > 0) {
      return { success: true, message: "Database already seeded" };
    }

    // Seed categories
    const categories = [
      { name: "Design", slug: "design", description: "UI/UX design, visual design, and design thinking", color: "#EC4899" },
      { name: "Research", slug: "research", description: "Research methodologies and insights", color: "#8B5CF6" },
      { name: "Presentation", slug: "presentation", description: "Presentation skills and techniques", color: "#F59E0B" },
      { name: "Software", slug: "software", description: "Software development and engineering", color: "#3B82F6" },
      { name: "Product", slug: "product", description: "Product management and strategy", color: "#10B981" },
      { name: "Frameworks", slug: "frameworks", description: "Development frameworks and tools", color: "#EF4444" },
      { name: "Leadership", slug: "leadership", description: "Leadership and management principles", color: "#6366F1" },
      { name: "Management", slug: "management", description: "Team and project management", color: "#14B8A6" },
      { name: "Tools", slug: "tools", description: "Software tools and utilities", color: "#F59E0B" },
      { name: "SaaS", slug: "saas", description: "Software as a Service products", color: "#EC4899" },
      { name: "Podcasts", slug: "podcasts", description: "Podcast content and discussions", color: "#8B5CF6" },
      { name: "Customer Success", slug: "customer-success", description: "Customer success strategies", color: "#10B981" },
    ];

    const { data: insertedCategories, error: catError } = await supabase
      .from("categories")
      .insert(categories)
      .select();

    if (catError) throw catError;

    // Create a map of category slugs to IDs
    const categoryMap = new Map(
      insertedCategories?.map((cat) => [cat.slug, cat.id]) || []
    );

    // Seed posts
    const posts = [
      {
        title: "UX review presentations",
        slug: "ux-review-presentations",
        content: `# Creating Compelling UX Review Presentations

## Introduction

How do you create compelling presentations that wow your colleagues and impress your managers? In this post, we'll explore the essential elements of effective UX review presentations.

## Key Elements

### 1. Tell a Story
Don't just present screens. Walk your audience through the user journey and explain the reasoning behind your design decisions.

### 2. Show the Process
Include your research, wireframes, and iterations. This demonstrates your thorough approach and builds credibility.

### 3. Use Real Data
Whenever possible, support your designs with user research findings, analytics, and usability test results.

## Best Practices

- **Keep it visual**: Use high-quality mockups and prototypes
- **Be concise**: Focus on key insights and decisions
- **Invite feedback**: Create space for discussion and questions
- **Show impact**: Demonstrate how your designs solve user problems

## Conclusion

Effective UX presentations are about communication, not just showcasing pretty screens. Focus on the story, the process, and the impact of your work.`,
        excerpt: "How do you create compelling presentations that wow your colleagues and impress your managers?",
        author_name: "Olivia Rhye",
        author_avatar: null,
        published: true,
        published_at: new Date("2025-01-20").toISOString(),
      },
      {
        title: "Migrating to Linear 101",
        slug: "migrating-to-linear-101",
        content: `# Migrating to Linear: A Complete Guide

## Why Linear?

Linear helps streamline software projects, sprints, tasks, and bug tracking with an intuitive and fast interface.

## Migration Steps

### 1. Export Your Data
Start by exporting your existing project data from your current tool.

### 2. Clean Up Your Workflow
Before migrating, take time to:
- Archive old projects
- Update status labels
- Review team permissions

### 3. Import to Linear
Use Linear's import tools or API to migrate your data systematically.

## Tips for Success

- **Start small**: Migrate one project first as a test
- **Train your team**: Ensure everyone understands the new workflow
- **Customize**: Set up Linear to match your team's needs
- **Iterate**: Adjust your setup based on feedback

## Conclusion

Migrating tools can be daunting, but with proper planning and execution, the transition to Linear can significantly improve your team's productivity.`,
        excerpt: "Linear helps streamline software projects, sprints, tasks, and bug tracking...",
        author_name: "Phoenix Baker",
        author_avatar: null,
        published: true,
        published_at: new Date("2025-01-19").toISOString(),
      },
      {
        title: "Building your API stack",
        slug: "building-your-api-stack",
        content: `# Building Your API Stack

## The Modern API Landscape

The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.

## Essential Components

### 1. API Gateway
Choose a robust gateway that handles:
- Authentication
- Rate limiting
- Request routing
- Monitoring

### 2. Documentation
Use tools like:
- OpenAPI/Swagger
- Postman
- ReadMe

### 3. Testing
Implement comprehensive testing:
- Unit tests
- Integration tests
- Load testing
- Security testing

## Best Practices

- **Version your APIs**: Always use semantic versioning
- **Implement proper error handling**: Return meaningful error messages
- **Monitor performance**: Track API usage and response times
- **Security first**: Use HTTPS, implement authentication, and validate inputs

## Conclusion

A well-architected API stack is crucial for modern applications. Invest time in choosing the right tools and following best practices.`,
        excerpt: "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them...",
        author_name: "Lana Steiner",
        author_avatar: null,
        published: true,
        published_at: new Date("2025-01-18").toISOString(),
      },
      {
        title: "Bill Walsh leadership lessons",
        slug: "bill-walsh-leadership-lessons",
        content: `# Leadership Lessons from Bill Walsh

## Introduction

Bill Walsh transformed the San Francisco 49ers from one of the worst teams in the NFL to a three-time Super Bowl champion. His leadership principles apply far beyond football.

## Key Lessons

### 1. Standard of Performance
Walsh believed in establishing a "Standard of Performance" - a comprehensive set of behaviors and expectations that applied to everyone in the organization.

### 2. Attention to Detail
Success comes from mastering the fundamentals and paying attention to every detail, no matter how small.

### 3. Teaching Over Yelling
Walsh was known as a teacher first. He believed in explaining the "why" behind every decision and helping his team understand the game deeply.

### 4. Innovation
He wasn't afraid to challenge conventional wisdom and implement new strategies, including the famous "West Coast Offense."

## Application to Business

These principles translate directly to business leadership:
- Set clear standards
- Focus on fundamentals
- Develop your team through teaching
- Don't be afraid to innovate

## Conclusion

Bill Walsh's leadership transformed not just a football team, but provided a blueprint for organizational excellence that remains relevant today.`,
        excerpt: "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
        author_name: "Alec Whitten",
        author_avatar: null,
        published: true,
        published_at: new Date("2025-01-17").toISOString(),
      },
      {
        title: "PM mental models",
        slug: "pm-mental-models",
        content: `# Product Management Mental Models

## What Are Mental Models?

Mental models are simple expressions of complex processes or relationships that help us understand and navigate the world.

## Essential PM Mental Models

### 1. Jobs to Be Done
Focus on the job your customers are "hiring" your product to do, rather than just features.

### 2. The Eisenhower Matrix
Prioritize tasks based on urgency and importance:
- Urgent & Important: Do first
- Important, Not Urgent: Schedule
- Urgent, Not Important: Delegate
- Neither: Eliminate

### 3. The 80/20 Rule (Pareto Principle)
80% of effects come from 20% of causes. Focus on the features that deliver the most value.

### 4. Opportunity Cost
Every choice has a cost - the value of the best alternative you didn't choose.

### 5. Network Effects
Products become more valuable as more people use them.

## How to Apply These

1. **Jobs to Be Done**: Interview customers about their workflows and pain points
2. **Eisenhower Matrix**: Use it for feature prioritization
3. **80/20 Rule**: Analyze feature usage data
4. **Opportunity Cost**: Make it explicit in roadmap discussions
5. **Network Effects**: Design viral loops into your product

## Conclusion

Mental models provide frameworks for making better product decisions. Develop your toolkit and apply them consistently.`,
        excerpt: "Mental models are simple expressions of complex processes or relationships.",
        author_name: "Demi Wilkinson",
        author_avatar: null,
        published: true,
        published_at: new Date("2025-01-16").toISOString(),
      },
      {
        title: "What is wireframing?",
        slug: "what-is-wireframing",
        content: `# Introduction to Wireframing and Its Principles

## What is Wireframing?

Wireframing is the practice of creating simple, low-fidelity layouts that outline the structure and functionality of a digital product.

## Why Wireframe?

### Speed
Wireframes are quick to create and easy to iterate on, allowing for rapid exploration of ideas.

### Focus
By removing visual design elements, wireframes help teams focus on:
- Information architecture
- User flows
- Functionality
- Content hierarchy

### Communication
Wireframes serve as a common language between designers, developers, and stakeholders.

## Types of Wireframes

### Low-Fidelity
- Sketches or basic digital wireframes
- Focus on layout and structure
- Quick to create and modify

### Mid-Fidelity
- More detailed digital wireframes
- Include some content
- Show interaction patterns

### High-Fidelity
- Detailed wireframes with actual content
- Close to final design
- May include interactions

## Best Practices

1. **Start with sketches**: Use pen and paper for initial exploration
2. **Use a grid system**: Maintain consistent spacing and alignment
3. **Annotate**: Add notes to explain functionality
4. **Test early**: Get feedback on wireframes before moving to visual design
5. **Iterate**: Wireframes should evolve based on feedback

## Tools

Popular wireframing tools include:
- Figma
- Sketch
- Balsamiq
- Adobe XD
- Whimsical

## Conclusion

Wireframing is an essential step in the design process that helps teams align on functionality and structure before investing in visual design and development.`,
        excerpt: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
        author_name: "Candice Wu",
        author_avatar: null,
        published: true,
        published_at: new Date("2025-01-15").toISOString(),
      },
    ];

    const { data: insertedPosts, error: postError } = await supabase
      .from("posts")
      .insert(posts)
      .select();

    if (postError) throw postError;

    // Create post-category relationships
    const postCategories = [
      { postSlug: "ux-review-presentations", categories: ["design", "research", "presentation"] },
      { postSlug: "migrating-to-linear-101", categories: ["design", "research"] },
      { postSlug: "building-your-api-stack", categories: ["software", "research"] },
      { postSlug: "bill-walsh-leadership-lessons", categories: ["leadership", "management"] },
      { postSlug: "pm-mental-models", categories: ["product", "research", "frameworks"] },
      { postSlug: "what-is-wireframing", categories: ["design", "research"] },
    ];

    const postMap = new Map(
      insertedPosts?.map((post) => [post.slug, post.id]) || []
    );

    const relationships = postCategories.flatMap((pc) =>
      pc.categories
        .map((catSlug) => ({
          post_id: postMap.get(pc.postSlug),
          category_id: categoryMap.get(catSlug),
        }))
        .filter((rel) => rel.post_id && rel.category_id)
    );

    const { error: relError } = await supabase
      .from("post_categories")
      .insert(relationships);

    if (relError) throw relError;

    return { 
      success: true, 
      message: `Successfully seeded database with ${insertedCategories?.length} categories and ${insertedPosts?.length} posts` 
    };
  } catch (error) {
    console.error("Seed error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to seed database" 
    };
  }
}
