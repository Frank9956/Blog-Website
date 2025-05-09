import Post from '../../../../lib/models/post.model';
import { connect } from '../../../../lib/mongodb/mongoose';
import { currentUser } from '@clerk/nextjs/server';

export const DELETE = async (req) => {
  try {
    // Ensure headers are awaited properly and that currentUser is called with req
    const user = await currentUser(req);  // Ensure this is awaited properly

    // Check if the user is authenticated
    if (!user) {
      console.log('Unauthorized access - No user session');
      return new Response('Unauthorized', { status: 401 });
    }

    // Get the request body data
    const data = await req.json();
    if (!data.postId || !data.userId) {
      console.log('Bad Request: Missing postId or userId');
      return new Response('Bad Request: Missing postId or userId', { status: 400 });
    }

    // Authorization check: ensure user is admin or the owner of the post
    if (
      !user.publicMetadata.isAdmin &&
      user.publicMetadata.userMongoId !== data.userId
    ) {
      console.log('Unauthorized access - User is not admin or post owner');
      return new Response('Unauthorized', { status: 401 });
    }

    // Connect to MongoDB
    await connect();

    // Attempt to delete the post
    const deletedPost = await Post.findByIdAndDelete(data.postId);
    if (!deletedPost) {
      console.log(`Post not found: ${data.postId}`);
      return new Response('Post not found', { status: 404 });
    }

    console.log(`Post deleted successfully: ${data.postId}`);
    return new Response('Post deleted', { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response('Error deleting post', { status: 500 });
  }
};
