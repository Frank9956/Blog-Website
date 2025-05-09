import { connect } from '@/lib/mongodb/mongoose';
import Authors from '@/lib/models/authors.model'; // Import connect function
import { auth } from '@clerk/nextjs/server';

// --- POST = Create a new author ---
export async function POST(req) {
    try {
      await connect(); // Connect to the database
  
      const { name, description } = await req.json();
  
      if (!name || !description) {
        return new Response(
          JSON.stringify({ message: "Name and description are required" }),
          { status: 400 }
        );
      }
  
      const existingAuthor = await Authors.findOne({ name });
      if (existingAuthor) {
        return new Response(
          JSON.stringify({ message: "Author with this name already exists" }),
          { status: 400 }
        );
      }
  
      // Generate slug from the name
      const slug = name.toLowerCase().split(' ').join('-');
  
      const newAuthor = await Authors.create({ name, description, slug });
      return new Response(
        JSON.stringify(newAuthor),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error('Error creating author:', error);
      return new Response(
        JSON.stringify({ message: "Failed to create author", error: error.message }),
        { status: 500 }
      );
    }
  }
  
  
  // --- GET = Get all authors ---
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
  
  // --- PUT = Update an author ---
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
  
  // --- DELETE = Delete an author ---
  export async function DELETE(req) {
    try {
      await connect();
  
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
  