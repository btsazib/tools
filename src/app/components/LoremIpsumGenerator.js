"use client";
import React, { useState, useEffect } from "react";

const generateLoremIpsum = (paragraphs, sentencesPerPar, wordsPerSentence) => {
  const words = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
    "adipisicing", "elit", "sed", "do", "eiusmod", "tempor",
    "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"
  ];

  const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

  const getSentence = (wordCount) =>
    Array.from({ length: wordCount }, getRandomWord).join(" ").replace(/^\w/, (c) => c.toUpperCase()) + ".";

  const getParagraph = () =>
    Array.from({ length: sentencesPerPar }, () => getSentence(wordsPerSentence)).join(" ");

  return Array.from({ length: paragraphs }, getParagraph).join("\n\n");
};

const LoremIpsumGenerator = () => {
  const [paragraphs, setParagraphs] = useState(1);
  const [wordsPerSentence, setWordsPerSentence] = useState(6);
  const [sentencesPerPar, setSentencesPerPar] = useState(4);
  const [text, setText] = useState("");

  // Generate real-time when any value changes
  useEffect(() => {
    const generated = generateLoremIpsum(paragraphs, sentencesPerPar, wordsPerSentence);
    setText(generated);
  }, [paragraphs, wordsPerSentence, sentencesPerPar]);

  const handleReset = () => {
    setParagraphs(1);
    setWordsPerSentence(6);
    setSentencesPerPar(4);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      alert("Failed to copy.");
    }
  };

  return (
    <section className="max-w-[64rem] mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-700">
        Lorem Ipsum Generator
      </h1>

      <div className="flex flex-col gap-6 sm:flex-row sm:justify-between mb-6">
        <div>
          <p className="mb-1">Paragraphs: {paragraphs}</p>
          <input
            type="range"
            min="1"
            max="50"
            value={paragraphs}
            onChange={(e) => setParagraphs(+e.target.value)}
          />
        </div>
        <div>
          <p className="mb-1">Words/Sentence: {wordsPerSentence}</p>
          <input
            type="range"
            min="3"
            max="25"
            value={wordsPerSentence}
            onChange={(e) => setWordsPerSentence(+e.target.value)}
          />
        </div>
        <div>
          <p className="mb-1">Sentences/Paragraph: {sentencesPerPar}</p>
          <input
            type="range"
            min="1"
            max="25"
            value={sentencesPerPar}
            onChange={(e) => setSentencesPerPar(+e.target.value)}
          />
        </div>
      </div>

      {/* Preview Box */}
      <div className="w-full text-gray-700 p-4 rounded-md text-lg h-64 overflow-auto border border-gray-300 whitespace-pre-line mb-6">
        {text}
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleReset}
          className="btn"
        >
          Reset
        </button>
        <button
          onClick={handleCopy}
          className="btn"
        >
          Copy
        </button>
      </div>
    </section>
  );
};

export default LoremIpsumGenerator;
