'use client';

import React, { useState } from 'react';
import { Loader2, ImageIcon, UploadCloud, Sparkles } from 'lucide-react';

export default function ImageCaption() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);
    setCaption('');
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const generateCaption = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    try {
      const res = await fetch('/api/caption', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setCaption(data.caption || 'No caption generated.');
    } catch (error) {
      setCaption('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-100">
      <div className="w-full max-w-xl p-6 bg-white rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">🖼️ Image Caption Generator</h1>

        <div className="flex items-center justify-center w-full mb-4">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-400">PNG, JPG or JPEG</p>
              </div>
            )}
            <input
              id="dropzone-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>

        <button
          onClick={generateCaption}
          disabled={!image || loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Caption
            </>
          )}
        </button>

        {caption && (
          <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-sm font-medium text-gray-700">📝 Caption:</p>
            <p className="mt-1 text-gray-900">{caption}</p>
          </div>
        )}
      </div>
    </main>
  );
}
