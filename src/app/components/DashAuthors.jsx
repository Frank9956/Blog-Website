'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function DashauthorsList() {
  const { user } = useUser();
  const [authorsList, setAuthorsList] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editAuthorId, setEditAuthorId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [authorIdToDelete, setAuthorIdToDelete] = useState('');

  useEffect(() => {
    fetchAuthorsList();
  }, []);

  async function fetchAuthorsList() {
    try {
      const res = await fetch('/api/authors');
      const data = await res.json();
      setAuthorsList(data);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    }
  }

  // Function to generate a slug from the author name
  function generateSlug(name) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
      .trim()
      .split(' ')
      .join('-'); // Replace spaces with hyphens
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      // Generate slug based on the author name
      const slug = generateSlug(name);

      const res = await fetch('/api/authors', {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, slug, id: editAuthorId }),
      });

      if (res.ok) {
        setName('');
        setDescription('');
        setEditMode(false);
        setEditAuthorId(null);
        fetchAuthorsList();
      } else {
        alert('Failed to save author');
      }
    } catch (error) {
      console.error('Error saving author:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setShowModal(false);
    try {
      const res = await fetch('/api/authors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorsId: authorIdToDelete }),
      });

      if (res.ok) {
        fetchAuthorsList();
      } else {
        alert('Failed to delete author');
      }
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  }

  function handleEdit(author) {
    setName(author.name);
    setDescription(author.description);
    setEditMode(true);
    setEditAuthorId(author._id);
  }

  function openDeleteModal(id) {
    setAuthorIdToDelete(id);
    setShowModal(true);
  }

  if (!user?.publicMetadata?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <h1 className="text-2xl font-semibold">You are not an admin!</h1>
      </div>
    );
  }

  return (
    <div className="p-6 w-full flex flex-col lg:flex-row gap-10">
      {/* Form Section */}
      <div className="w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-6">{editMode ? 'Edit Author' : 'Manage Authors'}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            placeholder="Author Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />
          <textarea
            placeholder="Author Description"
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
            {loading ? 'Saving...' : editMode ? 'Update Author' : 'Add Author'}
          </button>
        </form>
      </div>

      {/* List Section */}
      <div className="w-full lg:w-1/2 pt-14">
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-3 pr-2 no-scrollbar">
          {authorsList.length > 0 ? (
            authorsList.map((author) => (
              <div key={author._id} className="flex justify-between items-center border p-3 rounded-md">
                <div>
                  <h2 className="text-lg font-semibold">{author.name}</h2>
                  <p className="text-sm text-gray-500">{author.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(author)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(author._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No authors found.</p>
          )}
        </div>
      </div>


      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-black dark:text-white p-6 rounded-md w-[300px]">
            <h2 className="text-xl font-semibold text-center mb-4">
              Are you sure you want to delete this author?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold text-base"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-300 dark:border-gray-600 text-black dark:text-white px-5 py-2 rounded-md font-medium text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
