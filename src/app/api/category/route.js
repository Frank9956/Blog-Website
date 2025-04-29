import { connect } from '@/lib/mongodb/mongoose';
import Category from '@/lib/models/category.model';
import { auth } from '@clerk/nextjs/server';

// --- POST = Create a new category ---
export async function POST(req) {
  try {
    await connect();

    const { name, slug, description } = await req.json();

    if (!name || !slug) {
      return new Response(JSON.stringify({ message: "Name and slug are required" }), { status: 400 });
    }

    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(slug)) {
      return new Response(JSON.stringify({ message: "Slug must be lowercase and contain only letters, numbers, and hyphens." }), { status: 400 });
    }

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return new Response(JSON.stringify({ message: "Category with this slug already exists" }), { status: 400 });
    }

    const newCategory = await Category.create({ name, slug, description });
    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return new Response(JSON.stringify({ message: "Failed to create category", error: error.message }), { status: 500 });
  }
}

// --- GET = Get all categories ---
export async function GET() {
  try {
    await connect();

    const categories = await Category.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(JSON.stringify({ message: "Failed to fetch categories", error: error.message }), { status: 500 });
  }
}

// --- PUT = Update a category ---
export async function PUT(req) {
  try {
    await connect();

    const { id, name, slug, description } = await req.json();

    if (!id || !name || !slug) {
      return new Response(JSON.stringify({ message: "ID, name, and slug are required" }), { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) {
      return new Response(JSON.stringify({ message: "Category not found" }), { status: 404 });
    }

    // Check if slug is being changed and if new slug already exists
    if (slug !== category.slug) {
      const slugExists = await Category.findOne({ slug });
      if (slugExists) {
        return new Response(JSON.stringify({ message: "Slug already in use by another category" }), { status: 400 });
      }
    }

    category.name = name;
    category.slug = slug;
    category.description = description;
    await category.save();

    return new Response(JSON.stringify({ message: 'Category updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return new Response(JSON.stringify({ message: 'Failed to update category', error: error.message }), { status: 500 });
  }
}

// --- DELETE = Delete a category ---
export async function DELETE(req) {
  try {
    await connect();

    const { userId } = auth();
    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { categoryId } = await req.json();

    if (!categoryId) {
      return new Response(JSON.stringify({ message: 'Category ID required' }), { status: 400 });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new Response(JSON.stringify({ message: 'Category not found' }), { status: 404 });
    }

    await Category.findByIdAndDelete(categoryId);

    return new Response(JSON.stringify({ message: 'Category deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete category', error: error.message }), { status: 500 });
  }
}
