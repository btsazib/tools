"use client";

import { useState } from "react";

export default function CaseConverter() {
  const [text, setText] = useState("");

  // ✅ Sentence Case: Each sentence starts with capital
  const toSentenceCase = (str) => {
    return str
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  // ✅ Upper Case
  const toUpperCase = (str) => str.toUpperCase();

  // ✅ Lower Case
  const toLowerCase = (str) => str.toLowerCase();

  // ✅ Title Case: Every Word's First Letter Capital
  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // ✅ Mixed Case: Alternate letters upper/lower
  const toMixedCase = (str) => {
    return str
      .split("")
      .map((char, i) => (i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
      .join("");
  };

  // ✅ Inverse Case: All lower -> upper, upper -> lower
  const toInverseCase = (str) => {
    return str
      .split("")
      .map((char) =>
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      )
      .join("");
  };

  return (
    <section className="max-w-[64rem] mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-5 text-gray-700 text-center">
        Case Converter
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        className="w-full border rounded-lg mb-5 h-64 border-gray-300 focus:outline-gray-400 p-3 resize-none text-lg text-gray-700"
      ></textarea>

      <div className="flex flex-wrap items-center gap-4 justify-center">
        <button onClick={() => setText(toSentenceCase(text))} className="btn">
          Sentence Case
        </button>
        <button onClick={() => setText(toUpperCase(text))} className="btn">
          UPPER CASE
        </button>
        <button onClick={() => setText(toLowerCase(text))} className="btn">
          lower case
        </button>
        <button onClick={() => setText(toTitleCase(text))} className="btn">
          Title Case
        </button>
        <button onClick={() => setText(toMixedCase(text))} className="btn">
          MiXeD CaSe
        </button>
        <button onClick={() => setText(toInverseCase(text))} className="btn">
          iNvErSe cAsE
        </button>
      </div>
    </section>
  );
}
