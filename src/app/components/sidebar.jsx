import Link from 'next/link';
import { FaGraduationCap } from 'react-icons/fa';

async function fetchCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/category`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Sidebar() {
  const categories = await fetchCategories();

  return (
    <div className="md:w-100 mr-2">
      <aside className="w-[100%] hidden md:block sticky top-0 max-h-screen dark:border-gray-700 p-6 pl-15">
        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat._id}>
                <Link
                  href={`/${cat.slug}`}
                  className="font-bold text-lg hover:text-blue-500 block"
                >
                  <div className="flex  justify-between items-center border p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex gap-2 items-center">
                      <FaGraduationCap className="text-xl text-orange-500" />
                      <span className="ml-1">{cat.name}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>Loading....</p>
          )}
        </div>
      </aside>
    </div>
  );
}
