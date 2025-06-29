'use client';

import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-markup.min.js';
import { Copy, Trash2 } from 'lucide-react';

export default function Home() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Converter!

Type your markdown text here, or upload a .md file to get started.`);
  const [customCSS, setCustomCSS] = useState(`body {
  font-family: Arial, sans-serif;
  padding: 1rem;
}
h1 { color: #4f46e5; }`);
  const [activeTab, setActiveTab] = useState('preview');
  const [rawHTML, setRawHTML] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef();
  const iframeRef = useRef();

  useEffect(() => {
    const html = marked.parse(markdown);
    setRawHTML(html);
  }, [markdown]);

  useEffect(() => {
    if (activeTab === 'preview') {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html><head><style>${customCSS}</style></head><body>${rawHTML}</body></html>
      `);
      doc.close();
    }
    if (activeTab === 'raw') {
      Prism.highlightAll();
    }
  }, [rawHTML, customCSS, activeTab]);

  const handleDownload = () => {
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>${customCSS}</style>
</head>
<body>${rawHTML}</body>
</html>`;
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'converted.html';
    link.click();
  };

  const handleCopyHTML = async () => {
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>${customCSS}</style>
</head>
<body>${rawHTML}</body>
</html>`;
    try {
      await navigator.clipboard.writeText(fullHTML);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClearMarkdown = () => {
    setMarkdown('');
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Markdown to HTML Converter
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold">Markdown Input</label>
            <div className="flex gap-2">
              <button
                onClick={handleClearMarkdown}
                className="flex items-center gap-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
                title="Clear Markdown"
              >
                <Trash2 size={16} />
                Clear
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-72 p-4 border border-gray-300 rounded font-mono text-sm"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />

          <div className="mt-4 flex gap-2">
            <label htmlFor="file-upload" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-indigo-700">
              Upload .md File
            </label>
            <input
              type="file"
              id="file-upload"
              accept=".md"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => setMarkdown(event.target.result);
                  reader.readAsText(file);
                }
              }}
              ref={fileInputRef}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex border-b">
            {['preview', 'raw', 'css'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold border-b-2 ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent hover:text-indigo-600'
                }`}
              >
                {tab === 'preview' ? 'HTML Preview' : tab === 'raw' ? 'Raw HTML' : 'Custom CSS'}
              </button>
            ))}
          </div>

          <div className="flex-grow h-72 overflow-auto border p-3 bg-white rounded">
            {activeTab === 'preview' && (
              <iframe ref={iframeRef} className="w-full h-full border-none" />
            )}
            {activeTab === 'raw' && (
              <pre className="language-html text-sm rounded overflow-auto">
                <code className="language-html">{rawHTML}</code>
              </pre>
            )}
            {activeTab === 'css' && (
              <textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                className="w-full h-full p-2 font-mono border-none outline-none resize-none"
              />
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCopyHTML}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
            >
              <Copy size={16} />
              {copySuccess ? 'Copied!' : 'Copy HTML'}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              <download size={16} />
              Download HTML
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}