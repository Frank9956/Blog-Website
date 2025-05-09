// components/CategoryWrapper.js
import Sidebar from './sidebar';

async function fetchCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/category`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data || []; // Ensure fallback to empty array
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoryWrapper() {
  const categories = await fetchCategories();
  return <Sidebar categories={categories} />;
}
