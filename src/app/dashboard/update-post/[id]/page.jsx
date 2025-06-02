'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import NextImage from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../../firebase';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image'


import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';

// ✅ EditorToolbar with type="button" on all buttons
function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="flex gap-2 mb-3 border rounded-md p-2 bg-gray-50 dark:bg-gray-800">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}><Bold size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}><Italic size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}><UnderlineIcon size={16} /></button>
      <button type="button" onClick={() => {
        const url = prompt('Enter link URL');
        if (url) editor.chain().focus().setLink({ href: url }).run();
      }} className="p-2 rounded hover:bg-gray-100"><LinkIcon size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} className="p-2 rounded hover:bg-gray-100"><Unlink size={16} /></button>
      <button type="button" onClick={() => {
        const url = prompt('Enter image URL');
        if (url) editor.chain().focus().setImage({ src: url }).run();
      }} className="p-2 rounded hover:bg-gray-100"><ImageIcon size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="p-2 rounded hover:bg-gray-100"><TableIcon size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}><AlignLeft size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}><AlignCenter size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}><AlignRight size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}`}><AlignJustify size={16} /></button>
    </div>
  );
}

export default function UpdatePost() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split('/').pop();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Image, // ✅ Add this line
    ],
    content: formData.content || '',
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/post/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId }),
        });
        const data = await res.json();
        if (res.ok) {
          setFormData(data.posts[0]);
          if (editor && data.posts[0].content) {
            editor.commands.setContent(data.posts[0].content);
          }
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn && user?.publicMetadata?.isAdmin) {
      fetchPost();
    }
  }, [postId, user?.publicMetadata?.isAdmin, isSignedIn, editor]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleUploadImage = async () => {
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
          setFormData((prev) => ({ ...prev, image: downloadURL }));
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Optionally, generate slug here in case backend doesn't do it or for immediate redirect
      const newSlug = slugify(formData.title || '', { lower: true, strict: true });

      const res = await fetch('/api/post/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // Remove slug here, backend will generate and return the updated slug
          userMongoId: user.publicMetadata.userMongoId,
          postId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      router.push(`/post/${data.slug}`); // Redirect to updated slug URL
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };


  if (!isLoaded || loading) return <p className="text-center mt-10">Loading...</p>;

  if (!isSignedIn || !user.publicMetadata.isAdmin)
    return (
      <h1 className="text-center text-3xl my-7 font-semibold min-h-screen">
        You need to be an admin to update a post
      </h1>
    );

  return (

    <div className="mx-auto p-3" style={{ maxWidth: '1280px', height: 'calc(100vh - 50px)', overflowY: 'auto', }}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between my-7 max-w-[1280px] ">
          <h1 className="text-3xl font-bold">Update a Post</h1>
          <Button type="submit" className="bg-purple-600 w-36 h-12 hover:bg-purple-700">
            Update Post
          </Button>
        </div>
        <div className="flex gap-9">
          {/* Left Column: Inputs stacked */}
          <div className="flex flex-col gap-4 flex-1 max-w-[600px]">
            <Select
              value={formData.category || ''}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="w-full max-w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Title"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <Button
              type="button"
              variant="outline"
              disabled={!!imageUploadProgress}
              onClick={handleUploadImage}
              className="w-36 h-12 bg-purple-600 text-white"
            >
              {imageUploadProgress ? (
                <div style={{ width: 40, height: 40 }}>
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

          {/* Right Column: Image preview */}
          <div className="flex-1 max-w-[600px] flex items-center justify-center border rounded-md min-h-[200px]">
            {formData.image ? (
              <NextImage
                src={formData.image}
                alt="upload"
                width={200}        // set width
                height={200}       // set height or aspect ratio
                className="object-contain rounded-md"
                priority={false}   // true if you want it to load ASAP
              />
            ) : (
              <p className="text-gray-500">No image uploaded yet</p>
            )}
          </div>
        </div>

        {/* Editor Toolbar */}
        <EditorToolbar editor={editor} />

        {/* Editor with fixed height and scroll */}
        <div
          className="border rounded-md p-2 no-scrollbar"
          style={{ height: '400px', overflowY: 'auto' }}
        >
          <EditorContent editor={editor} />
        </div>


        {publishError && (
          <Alert variant="destructive" className="mt-5">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{publishError}</AlertDescription>
          </Alert>
        )}
      </form>

    </div>
  );
}
