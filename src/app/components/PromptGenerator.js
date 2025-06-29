'use client'
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function PromptGenerator() {
  const [promptType, setPromptType] = useState('story');
  const [keywords, setKeywords] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const promptTypes = [
    { value: 'story', label: 'Story Prompt' },
    { value: 'poem', label: 'Poem Prompt' },
    { value: 'article', label: 'Article Prompt' },
    { value: 'marketing', label: 'Marketing Prompt' },
    { value: 'code', label: 'Code Prompt' },
  ];

  async function handleGenerate() {
    if (!keywords.trim()) {
      alert('Please enter keywords!');
      return;
    }

    setIsLoading(true);
    setGeneratedPrompt('');

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
      // Updated model name here
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

      const promptText = `Generate a ${promptType} prompt using these keywords: ${keywords}. Make it creative and detailed.`;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();
      setGeneratedPrompt(text);
    } catch (error) {
      console.error('Error:', error);
      setGeneratedPrompt('Failed to generate prompt. Try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          AI Prompt Generator
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Prompt Type</label>
            <select
              value={promptType}
              onChange={(e) => setPromptType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              {promptTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Keywords (comma-separated)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., space, adventure, mystery"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Prompt'}
          </button>

          {generatedPrompt && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h2 className="font-semibold mb-2">Generated Prompt:</h2>
              <p className="whitespace-pre-wrap">{generatedPrompt}</p>
              <button
                onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                className="mt-2 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}