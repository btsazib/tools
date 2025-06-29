'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Copy, Download, RotateCcw, Sparkles, Eye, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const ImageToText = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInfo, setImageInfo] = useState({ name: '', type: '', size: '' });
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Preload Tesseract when component mounts
  useEffect(() => {
    const loadTesseract = async () => {
      if (!window.Tesseract) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/tesseract.min.js';
        document.head.appendChild(script);
      }
    };
    loadTesseract();
  }, []);

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(resolve, file.type, 0.7);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const performOCR = async (imageFile) => {
    setIsProcessing(true);
    setError('');
    setProgress(0);

    try {
      const Tesseract = window.Tesseract;
      const compressedFile = await compressImage(imageFile);
      const imageUrl = URL.createObjectURL(compressedFile);

      const { data: { text } } = await Tesseract.recognize(
        imageUrl,
        'eng+ben+hin',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          },
          workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/worker.min.js',
          corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@4.0.2/tesseract-core.wasm.js'
        }
      );

      URL.revokeObjectURL(imageUrl);
      if (text.trim()) {
        setExtractedText(text.trim());
      } else {
        setError("Sorry, we couldn't find any text in this image. Try using a clearer image with visible text.");
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setError('Failed to extract text. Please try again with a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setImageInfo({
          name: file.name,
          type: file.type.split('/')[1].toUpperCase(),
          size: (file.size / 1024).toFixed(2) + ' KB'
        });
      };
      reader.readAsDataURL(file);
      await performOCR(file);
      setError('');
    } else {
      setError('Please select a valid image file (PNG, JPG, JPEG, WEBP)');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy text to clipboard');
    }
  };

  const downloadAsText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsDoc = () => {
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:w="urn:schemas-microsoft-com:office:word" 
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Extracted Text</title>
      </head>
      <body>
        <div>${extractedText.replace(/\n/g, '</div><div>')}</div>
      </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff', html], { 
      type: 'application/msword' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startOver = () => {
    setSelectedImage(null);
    setExtractedText('');
    setIsProcessing(false);
    setError('');
    setCopySuccess(false);
    setImageInfo({ name: '', type: '', size: '' });
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Image to Text Converter
            </h1>
          </div>
          <p className="text-center text-gray-600 mt-2">
            Extract text from images using advanced OCR technology
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className="p-8">
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="mb-4">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Upload your image to extract text
                </h3>
                <p className="text-gray-500 mb-6">
                  Supports PNG, JPG, JPEG, WEBP • Auto-detects text in multiple languages
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Choose Image
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Processing/Results Section */}
        {(selectedImage || isProcessing) && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Image Preview */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Image Preview</h3>
                  </div>
                  <div className="relative">
                    {selectedImage && (
                      <>
                        <img
                          src={selectedImage}
                          alt="Selected"
                          className="w-full h-80 object-contain bg-gray-50 rounded-xl border border-gray-200"
                        />
                        <div className="mt-2 text-sm text-gray-500">
                          <p>File: {imageInfo.name}</p>
                          <p>Type: {imageInfo.type} • Size: {imageInfo.size}</p>
                        </div>
                      </>
                    )}
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl">
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                          <p className="text-gray-600 font-medium">Extracting text... {progress}%</p>
                          <p className="text-gray-500 text-sm mt-1">Processing may take 10-30 seconds</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Extracted Text */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Extracted Text</h3>
                    {extractedText && !isProcessing && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={extractedText}
                      onChange={(e) => setExtractedText(e.target.value)}
                      placeholder={isProcessing ? "Extracting text from your image..." : "Extracted text will appear here..."}
                      className="w-full h-80 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      disabled={isProcessing}
                    />
                    {extractedText && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {extractedText.length} characters
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {extractedText && !isProcessing && (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                      </button>
                      
                      <button
                        onClick={downloadAsText}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download TXT</span>
                      </button>

                      <button
                        onClick={downloadAsDoc}
                        className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download DOC</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              {(selectedImage || extractedText) && (
                <div className="flex justify-center pt-8 border-t border-gray-200 mt-8">
                  <button
                    onClick={startOver}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Start Over</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        {!selectedImage && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Fast Processing</h3>
                <p className="text-gray-600">Optimized OCR engine with image compression for faster results</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Multiple Formats</h3>
                <p className="text-gray-600">Download extracted text as TXT or DOC files</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Multi-language</h3>
                <p className="text-gray-600">Supports English, Bengali, Hindi and more</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToText;