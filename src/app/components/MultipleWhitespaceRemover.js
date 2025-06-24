"use client";
import React, { useState } from "react";

const MultipleWhitespaceRemover = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRemoveSpaces = () => {
    const cleaned = text.replace(/\s+/g, " ").trim();
    setText(cleaned);
  };

  const handleReset = () => {
    setText("");
  };

  const handleCopy = async () => {
    if (text.trim() !== "") {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
      } catch (error) {
        console.error("Failed to copy text:", error);
      }
    }
  };

  return (
    <section className="max-w-[64rem] mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-5 text-gray-700 text-center">
        Multiple Whitespace Remover
      </h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        className="w-full border rounded-lg mb-5 h-64 border-gray-300 focus:outline-gray-400 p-3 resize-none text-lg text-gray-700"
      ></textarea>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <button className="btn" onClick={handleRemoveSpaces}>
          Remove Multiple Spaces
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={text.trim() === ""} // খালি হলে disable
            className={`btn px-4 py-2 rounded text-white ${
              text.trim() === ""
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            Reset
          </button>

          <div className="relative">
            <button
              onClick={handleCopy}
              className="btn bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Copy
            </button>
            {/* 🔹 Copied Message */}
            {copied && (
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-sm text-green-600 font-medium">
                Copied!
              </span>
            )}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultipleWhitespaceRemover;
