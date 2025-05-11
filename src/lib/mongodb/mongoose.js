import mongoose from 'mongoose';
import Post from '@/lib/models/post.model';

let initialized = false;

export const connect = async () => {
  mongoose.set('strictQuery', true);
  if (initialized) {
    console.log('Already connected to MongoDB');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'next-blog',
    });
    console.log('Connected to MongoDB');
    initialized = true;
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
};

export const getTotalPostsCount = async () => {
  await connect(); // ensures DB is connected before counting
  const count = await Post.countDocuments();
  return count;
};
