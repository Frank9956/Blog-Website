import Post from '../../../../lib/models/post.model.js';
import { connect } from '../../../../lib/mongodb/mongoose.js';
import { currentUser } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

export const PUT = async (req) => {
  const user = await currentUser();

  try {
    await connect();
    const data = await req.json();

    // Validate postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(data.postId)) {
      return new Response('Invalid postId', { status: 400 });
    }

    // Check authorization
    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      data.postId,
      {
        $set: {
          title: data.title,
          content: data.content,
          category: data.category,
          image: data.image,
          author: data.author,
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return new Response('Post not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedPost), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error updating post:', error);
    return new Response('Error updating post', { status: 500 });
  }
};
