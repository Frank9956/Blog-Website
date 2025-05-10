import Post from '../../../../lib/models/post.model.js';
import  '../../../../lib/models/authors.model.js';
import { connect } from '../../../../lib/mongodb/mongoose.js';

export async function POST(req) {
  await connect();

  let data = {};
  try {
    data = await req.json(); // Try parsing body
  } catch (err) {
    console.warn('Warning: No JSON body provided or invalid JSON');
  }

  // Default values for pagination
  const startIndex = parseInt(data.startIndex) || 0;
  const limit = parseInt(data.limit) || 9;
  const sortDirection = data.order === 'asc' ? 1 : -1;

  // Build the query with filters
  const query = {
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
  };

  try {
    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate('author', 'name description');

    const [totalPosts, lastMonthPosts] = await Promise.all([
      Post.countDocuments(query),
      Post.countDocuments({
        createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
      }),
    ]);

    return new Response(
      JSON.stringify({ posts, totalPosts, lastMonthPosts }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch posts', details: error.message }), { status: 500 });
  }
}
