'use client'

import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { app } from '@/firebase'

// Tiptap imports
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextAlign from '@tiptap/extension-text-align'

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
} from 'lucide-react'

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const router = useRouter()

  const [file, setFile] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [formData, setFormData] = useState({})
  const [publishError, setPublishError] = useState(null)
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '<p>Write your post...</p>',
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }))
    },
  })

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/category')
      const data = await res.json()
      if (res.ok) setCategories(data)
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchAuthors = async () => {
      const res = await fetch('/api/authors')
      const data = await res.json()
      if (res.ok) setAuthors(data)
    }
    fetchAuthors()
  }, [])

  // --- Updated code for unsaved changes warning (removed router.beforePopState) ---
  useEffect(() => {
    const hasUnsavedChanges = () => {
      return (
        formData.title ||
        formData.content ||
        formData.category ||
        formData.author ||
        formData.image ||
        file !== null
      )
    }

    const handleWindowClose = (e) => {
      if (!hasUnsavedChanges()) return

      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handleWindowClose)

    // Removed router.beforePopState because it's not supported in next/navigation

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
    }
  }, [formData, file])
  // --- End updated code ---

  const handleUploadImage = async () => {
    if (!file) return setImageUploadError('Please select an image')

    const storage = getStorage(app)
    const fileName = new Date().getTime() + '-' + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageUploadProgress(progress.toFixed(0))
      },
      () => {
        setImageUploadError('Image upload failed')
        setImageUploadProgress(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, image: downloadURL }))
          setImageUploadProgress(null)
          setImageUploadError(null)
        })
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userMongoId: user?.publicMetadata?.userMongoId,
        }),
      })

      const data = await res.json()
      if (!res.ok) return setPublishError(data.message)

      setPublishError(null)
      router.push(`/post/${data.slug}`)
    } catch {
      setPublishError('Something went wrong')
    }
  }

  if (!isLoaded) return null

  if (!isSignedIn || !user?.publicMetadata?.isAdmin)
    return (
      <h1 className="text-center text-3xl my-7 font-semibold">
        You are not authorized to view this page
      </h1>
    )

  return (
    <div
      className="mx-auto p-3"
      style={{ minWidth: '1280px', height: 'calc(100vh - 50px)', overflowY: 'auto' }}
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Header: Title + Submit Button */}
        <div className="flex items-center justify-between my-7 max-w-[1280px]">
          <h1 className="text-3xl font-bold">Create a Post</h1>
          <Button type="submit" className="bg-purple-600 w-36 h-12 hover:bg-purple-700">
            Publish Post
          </Button>
        </div>

        <div className="flex gap-9">
          {/* Left Column */}
          <div className="flex flex-col gap-4 flex-1 max-w-[600px]">
            {/* Category & Author */}
            <div className="flex gap-4">
              <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
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

              <Select onValueChange={(value) => setFormData({ ...formData, author: value })}>
                <SelectTrigger className="w-full max-w-[180px]">
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((a) => (
                    <SelectItem key={a._id} value={a.slug}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title Input */}
            <Input
              type="text"
              placeholder="Title"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            {/* File Upload */}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {/* Upload Button with Progress */}
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

            {/* Error Alert */}
            {imageUploadError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{imageUploadError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Right Column: Image Preview */}
          <div className="flex-1 max-w-[600px] flex items-center justify-center border rounded-md min-h-[200px]">
            {formData.image ? (
              <img
                src={formData.image}
                alt="Uploaded"
                className="object-contain max-h-72 rounded-md"
              />
            ) : (
              <p className="text-gray-500">No image uploaded yet</p>
            )}
          </div>
        </div>

        {/* --- Tiptap Editor Section --- */}
        <div className="border rounded-md shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 p-2 border-b bg-white rounded-t-md">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              type="button"
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              type="button"
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              type="button"
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('underline') ? 'bg-gray-200' : ''}`}
            >
              <UnderlineIcon size={16} />
            </button>

            <button
              onClick={() => editor?.chain().focus().unsetLink().run()}
              type="button"
              disabled={!editor?.isActive('link')}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Unlink size={16} />
            </button>

            <button
              onClick={() => {
                const url = prompt('Enter URL')
                if (url) {
                  editor?.chain().focus().setLink({ href: url }).run()
                }
              }}
              type="button"
              className="p-2 rounded hover:bg-gray-100"
            >
              <LinkIcon size={16} />
            </button>

            <button
              onClick={() => {
                const url = prompt('Enter image URL')
                if (url) {
                  editor?.chain().focus().setImage({ src: url }).run()
                }
              }}
              type="button"
              className="p-2 rounded hover:bg-gray-100"
            >
              <ImageIcon size={16} />
            </button>

            <button
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              type="button"
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
            >
              <AlignLeft size={16} />
            </button>
            <button
              onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              type="button"
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
            >
              <AlignCenter size={16} />
            </button>
            <button
              onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              type="button"
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
            >
              <AlignRight size={16} />
            </button>
            <button
              onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
              type="button"
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}`}
            >
              <AlignJustify size={16} />
            </button>
          </div>

          {/* Editor Content */}
          <EditorContent editor={editor} className="min-h-[250px] p-3" />
        </div>

        {publishError && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{publishError}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  )
}
