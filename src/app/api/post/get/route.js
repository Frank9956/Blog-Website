// app/api/post/get/route.js

import Post from '../../../../lib/models/post.model.js';
import { connect } from '../../../../lib/mongodb/mongoose.js';

export async function POST(req) {
  await connect();
  const data = await req.json();

  try {
    // Handling parameters with fallback values
    const startIndex = parseInt(data.startIndex) || 0;
    const limit = parseInt(data.limit) || 9;
    const sortDirection = data.order === 'asc' ? 1 : -1;

    // Query to fetch posts with optional filters
    const posts = await Post.find({
      ...(data.userId && { userId: data.userId }),
      ...(data.category && data.category !== 'null' && data.category !== 'undefined' && { category: data.category }),
      ...(data.slug && { slug: data.slug }),
      ...(data.postId && { _id: data.postId }),
      ...(data.searchTerm && {
        $or: [
          { title: { $regex: data.searchTerm, $options: 'i' } },
          { content: { $regex: data.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Count the total number of posts (for pagination or general statistics)
    const totalPosts = await Post.countDocuments();

    // Determine the number of posts created in the last month
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Respond with the posts, total posts, and posts from last month
    return new Response(
      JSON.stringify({ posts, totalPosts, lastMonthPosts }),
      { status: 200 }
    );
  } catch (error) {
    console.log('Error getting posts:', error);

    // In case of an error, send a response with an error message
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), { status: 500 });
  }
}
