import { connect } from '@/lib/mongodb/mongoose';
import Category from '@/lib/models/category.model';

export async function POST(req) {
  try {
    await connect();

    const { slug } = await req.json();

    if (!slug) {
      return new Response(JSON.stringify({ message: 'Slug is required' }), { status: 400 });
    }

    const category = await Category.findOne({ slug });

    if (!category) {
      return new Response(JSON.stringify({ message: 'Category not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    console.error('Error fetching category:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch category', error: error.message }), { status: 500 });
  }
}
