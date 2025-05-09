'use client';

import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '@/firebase';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category');
        const data = await res.json();
        if (res.ok) setCategories(data);
        else console.error('Failed to load categories:', data.message);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch authors
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch('/api/authors');
        const data = await res.json();
        if (res.ok) setAuthors(data);
        else console.error('Failed to load authors:', data.message);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };
    fetchAuthors();
  }, []);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        () => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData((prev) => ({ ...prev, image: downloadURL }));
          });
        }
      );
    } catch (error) {
      console.error(error);
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userMongoId: user?.publicMetadata?.userMongoId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      router.push(`/post/${data.slug}`);
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  if (!isLoaded) return null;

  if (isSignedIn && user?.publicMetadata?.isAdmin) {
    return (
      <div className="p-4 max-w-3xl mx-auto min-h-screen no-scrollbar">
        <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Title */}
          <Input
            type="text"
            placeholder="Title"
            required
            id="title"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          {/* Category and Author */}
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <Select
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="loading">
                    Loading...
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => setFormData({ ...formData, author: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an author" />
              </SelectTrigger>
              <SelectContent>
                {authors.length > 0 ? (
                  authors.map((author) => (
                    <SelectItem key={author._id} value={author.slug}>
                      {author.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="loading">
                    Loading...
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div className="flex gap-4 items-center justify-between rounded-md">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button
              type="button"
              variant="outline"
              disabled={!!imageUploadProgress}
              onClick={handleUploadImage}
              className="w-36 h-12 flex items-center justify-center"
            >
              {imageUploadProgress ? (
                <div style={{ width: 50, height: 50 }}>
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress}%`}
                    styles={{
                      root: { width: '100%', height: '100%' },
                      path: { stroke: '#f97316' },
                      text: { fontSize: '18px', fill: '#f97316' },
                    }}
                  />
                </div>
              ) : (
                'Upload Image'
              )}
            </Button>
          </div>

          {imageUploadError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{imageUploadError}</AlertDescription>
            </Alert>
          )}

          {formData.image && (
            <img
              src={formData.image}
              alt="Uploaded"
              className="w-full h-72 object-cover rounded-md"
            />
          )}

          {/* Content Editor */}
          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="h-72 mb-12"
            onChange={(value) => setFormData({ ...formData, content: value })}
          />

          {/* Submit */}
          <Button type="submit" className="w-full">
            Publish
          </Button>

          {publishError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{publishError}</AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    );
  }

  return (
    <h1 className="text-center text-3xl my-7 font-semibold">
      You are not authorized to view this page
    </h1>
  );
}
