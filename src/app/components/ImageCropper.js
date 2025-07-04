"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  Upload,
  RotateCw,
  Download,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";
import CustomSelect from "./CustomSelect"; // Adjust the path based on your file structure

function ImageCropper() {
  const inputRef = useRef(null);
  const cropperRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(null);
  const [cropSize, setCropSize] = useState({ width: 200, height: 200 });
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCropperLoading, setIsCropperLoading] = useState(false);

  // Aspect ratios for reference
  const aspectRatios = [
    { value: "", label: "Free Selection", ratio: null, exampleSize: null },
    {
      value: "1",
      label: "Square (Instagram / Product)",
      ratio: "1:1",
      exampleSize: [1080, 1080],
    },
    {
      value: "1.5",
      label: "Classic Photo (DSLR / Landscape)",
      ratio: "3:2",
      exampleSize: [1500, 1000],
    },
    {
      value: "1.333",
      label: "Standard (Monitor / Gallery)",
      ratio: "4:3",
      exampleSize: [1200, 900],
    },
    {
      value: "1.25",
      label: "Frame Print",
      ratio: "5:4",
      exampleSize: [1250, 1000],
    },
    {
      value: "1.777",
      label: "Widescreen (YouTube / Twitter)",
      ratio: "16:9",
      exampleSize: [1920, 1080],
    },
    {
      value: "1.91",
      label: "Social Post (Facebook / Twitter)",
      ratio: "1.91:1",
      exampleSize: [1200, 628],
    },
    {
      value: "2.63",
      label: "Facebook Cover",
      ratio: "2.63:1",
      exampleSize: [820, 312],
    },
    {
      value: "3",
      label: "Wide Web Banner",
      ratio: "3:1",
      exampleSize: [1920, 640],
    },
    {
      value: "4",
      label: "Ultra Wide Banner",
      ratio: "4:1",
      exampleSize: [1920, 480],
    },
    {
      value: "0.8",
      label: "Instagram Portrait",
      ratio: "4:5",
      exampleSize: [1080, 1350],
    },
    {
      value: "0.75",
      label: "Passport Size (3.5×4.5 cm)",
      ratio: "3:4",
      exampleSize: [413, 531],
    },
    {
      value: "0.85",
      label: "Stamp Size (2.5×3 cm)",
      ratio: "~0.85",
      exampleSize: [295, 354],
    },
    {
      value: "0.5625",
      label: "Mobile Story (Reel / Shorts)",
      ratio: "9:16",
      exampleSize: [1080, 1920],
    },
    {
      value: "0.4615",
      label: "Splash Screen (iPhone X)",
      ratio: "9:19.5",
      exampleSize: [1242, 2688],
    },
    {
      value: "1.414",
      label: "A-Series (A4, A3)",
      ratio: "1.414:1",
      exampleSize: [2100, 2970],
    },
    {
      value: "2.4",
      label: "Cinematic (Movie Screen)",
      ratio: "2.4:1",
      exampleSize: [2400, 1000],
    },
    {
      value: "1.618",
      label: "Golden Ratio (Aesthetic)",
      ratio: "1.618:1",
      exampleSize: [1618, 1000],
    },
  ];

  // Handle image upload with loading effect
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropData(null);
      setZoom(1);
      setRotation(0);
      setAspect(null);
      setCropSize({ width: 200, height: 200 });
      setIsUploading(false);
      setIsCropperLoading(true);
    };
    reader.readAsDataURL(file);
  };

  // Handle crop data update
  const onCrop = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    // Hide cropper loading once cropper is ready
    if (isCropperLoading) {
      setIsCropperLoading(false);
    }

    const cropBox = cropper.getCropBoxData();
    setCropSize({ width: cropBox.width, height: cropBox.height });

    const selectedRatio = aspectRatios.find(
      (opt) => opt.value === (aspect || "").toString()
    );

    const imageData = cropper.getImageData();
    const canvasData = cropper.getCanvasData();
    const cropBoxData = cropper.getCropBoxData();

    // Scale the crop box back to original image size
    const scaleX = imageData.naturalWidth / canvasData.width;
    const scaleY = imageData.naturalHeight / canvasData.height;

    let targetWidth = cropBoxData.width * scaleX;
    let targetHeight = cropBoxData.height * scaleY;

    // If fixed exampleSize exists, use that instead
    if (selectedRatio?.exampleSize) {
      [targetWidth, targetHeight] = selectedRatio.exampleSize;
    }

    const canvas = cropper.getCroppedCanvas({
      width: targetWidth,
      height: targetHeight,
      fillColor: "transparent",
    });

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCropData(url);
        }
      },
      "image/png",
      1.0
    );
  }, [isCropperLoading, aspect]);

  // Handle aspect ratio change
  const handleAspectChange = (e) => {
    const newAspect = e.target.value ? parseFloat(e.target.value) : null;
    setAspect(newAspect);
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.setAspectRatio(newAspect);
      onCrop();
    }
  };

  // Reset all settings
  const reset = () => {
    setImageSrc(null);
    setCropData(null);
    setRotation(0);
    setZoom(1);
    setAspect(null);
    setCropSize({ width: 200, height: 200 });
    setIsUploading(false);
    setIsCropperLoading(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.reset();
    }
  };

  // Download cropped image with loading state
  const downloadImage = async () => {
    if (!cropData) {
      alert("Please adjust the crop area to generate a preview!");
      return;
    }

    setIsDownloading(true);

    const a = document.createElement("a");
    a.href = cropData;
    a.download = `cropped-image-${Date.now()}.png`;
    a.click();
    setIsDownloading(false);
  };

  // Handle zoom
  const handleZoom = (value) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoomTo(value);
      setZoom(value);
      onCrop();
    }
  };

  // Handle rotation
  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.rotateTo(newRotation);
      onCrop();
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 bg-gradient-to-br from-blue-50 to-purple-50 h-auto">
      <style jsx>{`
        .cropper-container {
          position: relative;
          width: 100%;
          height: 400px;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC")
            repeat;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .cropper-container .cropper-crop-box {
          transition: all 0.1s ease-out;
        }
        .cropper-container .cropper-point {
          background-color: #3b82f6;
          border: 2px solid white;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          opacity: 1;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }
        .cropper-container .cropper-point:hover {
          background-color: #2563eb;
          transform: scale(1.2);
        }
        .cropper-container .cropper-view-box {
          outline: none;
        }
        .cropper-container .cropper-face {
          background-color: transparent;
          opacity: 0.3;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .pulse-animation {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #888 #f1f1f1;
        }
      `}</style>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Advanced Image Cropper
        </h1>

        {/* File Input */}
        <div className="mb-6">
          {isUploading ? (
            <div className="w-full p-6 border-2 border-blue-300 bg-blue-50 rounded-lg">
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-2" />
                <p className="text-blue-700 font-medium">Uploading Image...</p>
              </div>
            </div>
          ) : (
            <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                <p className="text-gray-600">
                  Click to upload image or drag and drop
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Main Editor */}
        {imageSrc && !isUploading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Cropper Area */}
            <div className="lg:col-span-2">
              <div className="cropper-container relative">
                {isCropperLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">
                        Loading cropper...
                      </p>
                    </div>
                  </div>
                )}
                <Cropper
                  src={imageSrc}
                  style={{ height: "100%", width: "100%" }}
                  initialAspectRatio={1}
                  aspectRatio={aspect}
                  guides={true}
                  crop={onCrop}
                  ready={() => setIsCropperLoading(false)}
                  ref={cropperRef}
                  viewMode={0}
                  minCropBoxWidth={50} // Increased minimum crop box size
                  minCropBoxHeight={50}
                  background={true}
                  responsive={true}
                  autoCropArea={0.5}
                  dragMode="move"
                  cropBoxMovable={true}
                  cropBoxResizable={true}
                  toggleDragModeOnDblclick={false}
                  wheelZoomRatio={0.1}
                  checkCrossOrigin={false}
                  checkOrientation={false}
                  center={true}
                  highlight={true}
                />
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => handleZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium">
                  {Math.round(zoom * 100)}%
                </span>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => handleZoom(parseFloat(e.target.value))}
                  className="w-32"
                />
                <button
                  onClick={() => handleZoom(Math.min(3, zoom + 0.1))}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="space-y-4">
              {/* Real-time Preview */}
              {cropData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Live Preview
                  </h4>
                  <div className="flex justify-center">
                    <img
                      src={cropData}
                      alt="Live Preview"
                      className="max-w-full max-h-32 border border-gray-300 rounded shadow-sm"
                      style={{ background: "transparent" }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Size: {Math.round(cropSize.width)} ×{" "}
                    {Math.round(cropSize.height)} pixels
                  </p>
                </div>
              )}

              {/* Custom Select Component */}
              <CustomSelect
                value={aspect || ""}
                onChange={handleAspectChange}
              />

              <div className="space-y-2">
                <button
                  onClick={handleRotate}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <RotateCw className="h-4 w-4" />
                  Rotate 90°
                </button>

                <button
                  onClick={downloadImage}
                  disabled={!cropData || isDownloading}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download Cropped Image
                    </>
                  )}
                </button>

                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageCropper;
