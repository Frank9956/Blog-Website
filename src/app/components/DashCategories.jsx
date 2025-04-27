'use client';

import { useEffect, useState } from 'react';

export default function DashCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState(''); // Added state for description
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/category');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !slug || !description) {  // Make sure description is also filled
      alert('Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description }),  // Send description in the request body
      });

      if (res.ok) {
        setName('');
        setSlug('');
        setDescription('');  // Reset description field
        fetchCategories(); // Refresh the list
      } else {
        alert('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold mb-6">Manage Categories</h1>

      {/* Add Category Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-4 py-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Category Slug (e.g. mobile-phones)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border px-4 py-2 rounded-md"
        />
        <textarea
          placeholder="Category Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-4 py-2 rounded-md"
          rows="4"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>

      {/* List of Categories */}
      <div className="space-y-3">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="flex justify-between items-center border p-3 rounded-md"
            >
              <div>
                <h2 className="text-lg font-semibold">{cat.name}</h2>
                <p className="text-sm text-gray-500">{cat.slug}</p>
                <p className="text-sm text-gray-700 mt-2">{cat.description}</p> {/* Display description */}
              </div>
            </div>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </div>
    </div>
  );
}
