import Post from '../../../../lib/models/post.model.js';
import { connect } from '../../../../lib/mongodb/mongoose.js';
import { currentUser } from '@clerk/nextjs/server';

export const PUT = async (req) => {
  const user = await currentUser();
  try {
    await connect();
    const data = await req.json();

    // Check if the user is authorized to update the post
    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }

    // Update the post with the new data, including the author
    const updatedPost = await Post.findByIdAndUpdate(
      data.postId,
      {
        $set: {
          title: data.title,
          content: data.content,
          category: data.category,
          image: data.image,
          author: data.author, // Make sure to pass the author's ObjectId
        },
      },
      { new: true }
    );

    // Return the updated post as a response
    return new Response(JSON.stringify(updatedPost), {
      status: 200,
    });
  } catch (error) {
    console.log('Error updating post:', error);
    return new Response('Error updating post', {
      status: 500,
    });
  }
};
