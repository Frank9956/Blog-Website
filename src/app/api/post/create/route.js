import mongoose from 'mongoose';
import Post from '../../../../lib/models/post.model.js';
import Author from '../../../../lib/models/authors.model.js';
import { connect } from '../../../../lib/mongodb/mongoose.js';
import { currentUser } from '@clerk/nextjs/server';

export const POST = async (req) => {
  const user = await currentUser();

  try {
    await connect();
    const data = await req.json();

    // Validate user authentication and authorization
    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Validate required fields
    const { title, content, image, category, author } = data;
    if (!title || !content || !author) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Find the author by name
    const authorDoc = await Author.findOne({ name: author });
    if (!authorDoc) {
      return new Response('Author not found', { status: 404 });
    }

    // Generate slug from title
    const slug = title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    // Create a new post
    const newPost = await Post.create({
      userId: user.publicMetadata.userMongoId,
      content,
      title,
      image,
      category,
      slug,
      author: authorDoc._id,
    });

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response('Error creating post', { status: 500 });
  }
};
