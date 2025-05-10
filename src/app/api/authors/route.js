import { connect } from '@/lib/mongodb/mongoose';
import Authors from '@/lib/models/authors.model';
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

// --- POST --- Create or fetch a single author ---
export async function POST(req) {
  try {
    await connect(); // Connect to the database
    const { author, name, description } = await req.json();

    // --- Fetch a single author by ID ---
    if (author) {
      // Ensure the author ID is a valid ObjectId string
      if (!mongoose.Types.ObjectId.isValid(author)) {
        return new Response(
          JSON.stringify({ message: 'Invalid author ID format' }),
          { status: 400 }
        );
      }

      const authorId = mongoose.Types.ObjectId(author); // Convert to ObjectId
      const foundAuthor = await Authors.findById(authorId);
      if (!foundAuthor) {
        return new Response(
          JSON.stringify({ message: 'Author not found' }),
          { status: 404 }
        );
      }
      return new Response(
        JSON.stringify({ author: foundAuthor }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // --- Create a new author ---
    if (!name || !description) {
      return new Response(
        JSON.stringify({ message: "Name and description are required" }),
        { status: 400 }
      );
    }

    // Check if an author with the same name already exists
    const existingAuthor = await Authors.findOne({ name });
    if (existingAuthor) {
      return new Response(
        JSON.stringify({ message: "Author with this name already exists" }),
        { status: 400 }
      );
    }

    // Create a new slug from the name
    const slug = name.toLowerCase().split(' ').join('-');
    const newAuthor = await Authors.create({ name, description, slug });

    return new Response(
      JSON.stringify(newAuthor),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in POST handler:', error);
    return new Response(
      JSON.stringify({ message: "POST request failed", error: error.message }),
      { status: 500 }
    );
  }
}

// --- GET --- Get all authors ---
export async function GET() {
  try {
    await connect();
    const authorsList = await Authors.find().sort({ createdAt: -1 });
    return new Response(
      JSON.stringify(authorsList),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error fetching authors:', error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch authors", error: error.message }),
      { status: 500 }
    );
  }
}

// --- PUT --- Update an author ---
export async function PUT(req) {
  try {
    await connect();
    const { id, name, description } = await req.json();

    if (!id || !name || !description) {
      return new Response(
        JSON.stringify({ message: "ID, name, and description are required" }),
        { status: 400 }
      );
    }

    // Ensure the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ message: "Invalid author ID format" }),
        { status: 400 }
      );
    }

    const existing = await Authors.findById(id);
    if (!existing) {
      return new Response(
        JSON.stringify({ message: "Author not found" }),
        { status: 404 }
      );
    }

    existing.name = name;
    existing.description = description;
    await existing.save();

    return new Response(
      JSON.stringify({ message: 'Author updated successfully' }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error updating author:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to update author', error: error.message }),
      { status: 500 }
    );
  }
}

// --- DELETE --- Delete an author ---
export async function DELETE(req) {
  try {
    await connect();

    // Check if user is authenticated
    const { userId } = auth();
    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const { authorsId } = await req.json();
    if (!authorsId) {
      return new Response(
        JSON.stringify({ message: 'Author ID required' }),
        { status: 400 }
      );
    }

    // Ensure the author ID is valid
    if (!mongoose.Types.ObjectId.isValid(authorsId)) {
      return new Response(
        JSON.stringify({ message: 'Invalid author ID format' }),
        { status: 400 }
      );
    }

    const existing = await Authors.findById(authorsId);
    if (!existing) {
      return new Response(
        JSON.stringify({ message: 'Author not found' }),
        { status: 404 }
      );
    }

    await Authors.findByIdAndDelete(authorsId);

    return new Response(
      JSON.stringify({ message: 'Author deleted successfully' }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error deleting author:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to delete author', error: error.message }),
      { status: 500 }
    );
  }
}
