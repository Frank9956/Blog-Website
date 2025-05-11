import Post from '../../../../lib/models/post.model.js';
import Author from '../../../../lib/models/authors.model.js';
import { connect } from '../../../../lib/mongodb/mongoose.js';
import { auth, clerkClient } from '@clerk/nextjs/server';

export const POST = async (req) => {
  try {
    const { userId } = auth(); // Safe in App Router

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const clerkUser = await clerkClient.users.getUser(userId); // fetch full user object

    if (!clerkUser.publicMetadata?.isAdmin) {
      return new Response('Unauthorized', { status: 401 });
    }

    await connect();

    const data = await req.json();
    const { title, content, image, category, author } = data;

    if (!title || !content || !author) {
      return new Response('Missing required fields', { status: 400 });
    }

    const authorDoc = await Author.findOne({ slug: author }); // you're sending `slug`, not name

    if (!authorDoc) {
      return new Response('Author not found', { status: 404 });
    }

    const slug = title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = await Post.create({
      userId: clerkUser.publicMetadata.userMongoId,
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
