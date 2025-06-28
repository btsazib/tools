// "use client";

// import { useState, useRef } from "react";
// import { Upload, FileImage, Sparkles, Copy, RefreshCw } from "lucide-react";
// import { genkit } from "genkit";
// import { googleAI } from "@genkit-ai/googleai";

// const ai = genkit({ plugins: [googleAI()] });

// export default function ImageTitleGenkit() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [generatedTitles, setGeneratedTitles] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const fileInputRef = useRef(null);

//   const handleImageUpload = (file) => {
//     if (file && file.type.startsWith("image/")) {
//       setSelectedImage(file);
//       setError("");
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setError("Please select a valid image file");
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     handleImageUpload(file);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const generateTitles = async () => {
//     if (!imagePreview) {
//       setError("Please upload an image first.");
//       return;
//     }
//     setIsLoading(true);
//     setError("");
//     try {
//       const { text } = await ai.generate({
//         model: googleAI.model("gemini-2.5-flash"),
//         prompt: [
//           { media: { url: imagePreview } },
//           { text: "Generate a short, creative, catchy title for this image." },
//         ],
//       });

//       const base = text.trim();
//       const titles = [
//         base,
//         `✨ ${base}`,
//         `📸 ${base}`,
//         `🎨 ${base}`,
//         `🖼️ ${base}`,
//         `🌟 ${base}`,
//       ];
//       setGeneratedTitles(titles);
//     } catch (err) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-10">
//           AI Image Title Generator (Genkit + Gemini)
//         </h1>

//         <div className="grid md:grid-cols-2 gap-8">
//           <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
//             <h2 className="text-xl font-semibold mb-4 flex items-center">
//               <Upload className="mr-2 text-blue-500" /> Upload Image
//             </h2>
//             <div
//               onDrop={handleDrop}
//               onDragOver={handleDragOver}
//               onClick={() => fileInputRef.current?.click()}
//               className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:bg-blue-50"
//             >
//               <FileImage className="w-12 h-12 mx-auto text-gray-400 mb-3" />
//               <p className="text-gray-600">Drag & drop or click to select image</p>
//             </div>
//             <input
//               type="file"
//               ref={fileInputRef}
//               accept="image/*"
//               onChange={(e) => handleImageUpload(e.target.files[0])}
//               className="hidden"
//             />
//             {imagePreview && (
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="mt-6 rounded-lg border border-gray-200 object-contain max-h-64 w-full"
//               />
//             )}
//             <button
//               onClick={generateTitles}
//               disabled={!imagePreview || isLoading}
//               className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:scale-105 disabled:opacity-50 flex items-center justify-center"
//             >
//               {isLoading ? (
//                 <>
//                   <RefreshCw className="animate-spin mr-2 h-4 w-4" /> Generating...
//                 </>
//               ) : (
//                 <>
//                   <Sparkles className="mr-2 h-4 w-4" /> Generate Titles
//                 </>
//               )}
//             </button>
//             {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
//             <h2 className="text-xl font-semibold mb-4 flex items-center">
//               <Sparkles className="mr-2 text-purple-500" /> Generated Titles
//             </h2>
//             {generatedTitles.length === 0 && !isLoading ? (
//               <p className="text-gray-500">Upload image and generate to see titles.</p>
//             ) : (
//               <div className="space-y-3">
//                 {generatedTitles.map((title, idx) => (
//                   <div
//                     key={idx}
//                     className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex justify-between items-center group"
//                   >
//                     <span className="text-gray-800 font-medium">{title}</span>
//                     <button
//                       onClick={() => copyToClipboard(title)}
//                       className="text-gray-400 hover:text-blue-600 ml-3 opacity-0 group-hover:opacity-100 transition"
//                     >
//                       <Copy className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
