'use client';

import { useEffect, useState } from 'react';

export default function DashCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState('');

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
    if (!name || !slug || !description) {
      alert('Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/category', {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, id: editCategoryId }),
      });

      if (res.ok) {
        setName('');
        setSlug('');
        setDescription('');
        setEditMode(false);
        setEditCategoryId(null);
        fetchCategories();
      } else {
        alert('Failed to save category');
      }
    } catch (error) {
      console.error('Error adding/updating category:', error);
    } finally {
      setLoading(false);
    }
  }

  // Handle category deletion
  async function handleDelete() {
    setShowModal(false);
    try {
      const res = await fetch('/api/category', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: categoryIdToDelete,
        }),
      });

      if (res.ok) {
        fetchCategories(); // Refresh categories after deletion
      } else {
        alert('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }

  // Prepare category for edit
  function handleEdit(cat) {
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setEditMode(true);
    setEditCategoryId(cat._id);
  }

  // Open the delete confirmation modal
  function openDeleteModal(id) {
    setCategoryIdToDelete(id);
    setShowModal(true);
  }

  return (
    <div className="p-6 w-full flex gap-10">
      <div className="w-[50%]">
        <h1 className="text-2xl font-semibold mb-6">{editMode ? 'Edit Category' : 'Manage Categories'}</h1>

        {/* Add or Edit Category Form */}
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
            {loading ? 'Saving...' : editMode ? 'Update Category' : 'Add Category'}
          </button>
        </form>
      </div>

      {/* List of Categories */}
      <div className="space-y-3 w-[50%] pt-14">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div key={cat._id} className="flex justify-between items-center border p-3 rounded-md">
              <div>
                <h2 className="text-lg font-semibold">{cat.name}</h2>
                <p className="text-sm text-gray-500">{cat.slug}</p>
                {/* <p className="text-sm text-gray-700 mt-2">{cat.description}</p> */}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(cat._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md dark:bg-black dark:text-white w-[300px]">
            <h2 className="text-xl font-semibold text-center mb-4">Are you sure you want to delete this category?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold text-base"
              >
                Yes, I’m sure
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-300 dark:border-gray-600 text-black dark:text-white px-5 py-2 rounded-md font-medium text-base"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
