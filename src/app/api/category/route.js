import { connect } from '../../../lib/mongodb/mongoose.js';
import { Category } from "@/lib/models/category";

// POST = Create a new category
export async function POST(req) {
  try {
    await connect();

    // Parse the request body to extract name, slug, and description
    const { name, slug, description } = await req.json();

    // Validate required fields
    if (!name || !slug) {
      return new Response(
        JSON.stringify({ message: "Name and slug are required" }),
        { status: 400 }
      );
    }

    // Validate slug format (only lowercase letters and hyphens allowed)
    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(slug)) {
      return new Response(
        JSON.stringify({ message: "Slug must be lowercase and contain only letters, numbers, and hyphens." }),
        { status: 400 }
      );
    }

    // Check if category with the same slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return new Response(
        JSON.stringify({ message: "Category with this slug already exists" }),
        { status: 400 }
      );
    }

    // Create the new category
    const newCategory = await Category.create({ name, slug, description });

    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return new Response(
      JSON.stringify({ message: "Failed to create category", error: error.message }),
      { status: 500 }
    );
  }
}

// 🆕 GET = Get all categories
export async function GET() {
  try {
    await connect();
    
    // Fetch all categories sorted by creation date in descending order
    const categories = await Category.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch categories", error: error.message }),
      { status: 500 }
    );
  }
}
