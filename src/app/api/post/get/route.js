import Post from '../../../../lib/models/post.model.js';
import '../../../../lib/models/authors.model.js';
import { connect } from '../../../../lib/mongodb/mongoose.js';

export async function POST(req) {
  await connect();

  let data = {};
  try {
    data = await req.json(); // Parse the request body
  } catch (err) {
    console.warn('Warning: No JSON body provided or invalid JSON');
  }

  // Pagination configuration (default values)
  const skip = parseInt(data.skip) || 0; // This is equivalent to `startIndex`
  const limit = parseInt(data.limit) || 9; // Default limit of 9 posts per page
  const sortDirection = data.order === 'asc' ? 1 : -1; // Sorting by updated date (default is descending)

  // Construct the query with dynamic filters
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
    // Fetch the posts from the database with pagination and sorting
    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection }) // Sort by updatedAt field
      .skip(skip) // Skip the first `skip` posts (for pagination)
      .limit(limit) // Limit to `limit` posts per page
      .populate('author', 'name description'); // Populate author details

    // Get total number of posts for pagination (for dynamic page calculation)
    const [totalPosts, lastMonthPosts] = await Promise.all([
      Post.countDocuments(query), // Total number of posts matching the query
      Post.countDocuments({
        createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }, // Posts from the last month
      }),
    ]);

    // Return the results in the response
    return new Response(
      JSON.stringify({
        posts,
        totalPosts, // Total number of posts (for pagination calculation)
        lastMonthPosts, // Number of posts created in the last month
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting posts:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch posts', details: error.message }),
      { status: 500 }
    );
  }
}
