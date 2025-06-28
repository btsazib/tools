'use client';
import { useState, useRef } from 'react'
import { Loader2, Upload, RefreshCw, Copy } from 'lucide-react'

export default function ImageCaptionGenerator() {
  const [image, setImage] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(URL.createObjectURL(file))
    setCaption('')
    setLoading(true)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/caption', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setCaption(data.caption)
      } else {
        setCaption('Error: ' + data.error)
      }
    } catch (err) {
      setCaption('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Image Caption Generator</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={inputRef}
        className="mb-4 border"
      />
      {image && (
        <img src={image} alt="Preview" className="mb-4 rounded-md max-h-64 object-contain" />
      )}
      {loading && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="animate-spin" /> Generating caption...
        </div>
      )}
      {caption && (
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="mb-2">{caption}</p>
          <button
            onClick={() => navigator.clipboard.writeText(caption)}
            className="text-sm flex items-center gap-1 text-blue-500 hover:underline"
          >
            <Copy size={16} /> Copy
          </button>
        </div>
      )}
      <button
        onClick={() => {
          setImage(null)
          setCaption('')
          inputRef.current.value = ''
        }}
        className="mt-4 text-sm text-gray-600 hover:text-red-500 flex items-center gap-1"
      >
        <RefreshCw size={16} /> Reset
      </button>
    </div>
  )
}
