"use client";
import React, { useState } from "react";

export default function LetterCounter() {
  const [text, setText] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const sentenceCount = text
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0).length;

  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "").length;

  const letterCount = text.length;

  const limits = [
    {
      name: "Meta Title",
      type: "Letter",
      limit: 55,
      condition: "max",
      platform: "Meta",
    },
    {
      name: "Meta Description",
      type: "Letter",
      limit: 160,
      condition: "max",
      platform: "Meta",
    },
    {
      name: "Google Ideal Post Content",
      type: "Word",
      limit: 300,
      condition: "min",
      platform: "Google",
    },
    {
      name: "Instagram Captions/Comments",
      type: "Letter",
      limit: 2200,
      condition: "max",
      platform: "Instagram",
    },
    {
      name: "Twitter Post",
      type: "Letter",
      limit: 280,
      condition: "max",
      platform: "Twitter",
    },
    {
      name: "Twitter Username",
      type: "Letter",
      limit: 20,
      condition: "max",
      platform: "Twitter",
    },
    {
      name: "Facebook Wall Post (Truncation)",
      type: "Letter",
      limit: 477,
      condition: "max",
      platform: "Facebook",
    },
    {
      name: "Facebook Wall Post (All)",
      type: "Letter",
      limit: 63206,
      condition: "max",
      platform: "Facebook",
    },
    {
      name: "Facebook Comment",
      type: "Letter",
      limit: 8000,
      condition: "max",
      platform: "Facebook",
    },
    {
      name: "Facebook Page Description",
      type: "Letter",
      limit: 255,
      condition: "max",
      platform: "Facebook",
    },
    {
      name: "Facebook Username",
      type: "Letter",
      limit: 50,
      condition: "max",
      platform: "Facebook",
    },
    {
      name: "Facebook Messenger Message",
      type: "Letter",
      limit: 20000,
      condition: "max",
      platform: "Facebook",
    },
    {
      name: "YouTube Video Title",
      type: "Letter",
      limit: 70,
      condition: "max",
      platform: "YouTube",
    },
    {
      name: "YouTube Video Description",
      type: "Letter",
      limit: 5000,
      condition: "max",
      platform: "YouTube",
    },
    {
      name: "Snapchat Caption",
      type: "Letter",
      limit: 250,
      condition: "max",
      platform: "Snapchat",
    },
    {
      name: "Pinterest Pin Description",
      type: "Letter",
      limit: 500,
      condition: "max",
      platform: "Pinterest",
    },
  ];

  const filteredLimits =
    selectedPlatform === "all"
      ? limits
      : limits.filter((item) => item.platform === selectedPlatform);

  return (
    <section className="max-w-[64rem] mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-5 text-gray-700 text-center">
        Letter Counter
      </h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        className="w-full border rounded-lg mb-5 h-64 border-gray-300 focus:outline-gray-400 p-3 resize-none text-lg text-gray-700"
      ></textarea>

      <div className="grid grid-cols-3 items-center justify-center gap-5 text-gray-700 mb-10">
        <div className="w-full flex flex-col items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg bg-gray-200">
          <span className="font-medium text-2xl">{sentenceCount}</span>
          <span>Sentence</span>
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg bg-gray-200">
          <span className="font-medium text-2xl">{wordCount}</span>
          <span>Words</span>
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg bg-gray-200">
          <span className="font-medium text-2xl">{letterCount}</span>
          <span>Letters</span>
        </div>
      </div>

      <div className="pt-10 text-gray-700">
        <div className="grid gap-5">
          <div className="flex justify-between items-center gap-5">
            <h2 className="text-xl">Web and Social Media Limits</h2>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="min-w-52 border border-gray-300 rounded-lg p-2 text-gray-700 outline-none"
            >
              <option value="all">All</option>
              <option value="Meta">Meta</option>
              <option value="Google">Google</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter</option>
              <option value="Facebook">Facebook</option>
              <option value="YouTube">YouTube</option>
              <option value="Snapchat">Snapchat</option>
              <option value="Pinterest">Pinterest</option>
            </select>
          </div>

          <div className="overflow-x-auto pb-8 pt-4">
            <table className="min-w-full border border-gray-300 text-left text-sm">
              <thead className="bg-gray-100">
                <tr className="text-gray-700">
                  <th className="px-4 py-3 border-b border-gray-300">Name</th>
                  <th className="px-4 py-3 border-b border-gray-300">
                    Min/Max
                  </th>
                  <th className="px-4 py-3 border-b border-gray-300">Limit</th>
                  <th className="px-4 py-3 border-b border-gray-300">Type</th>
                  <th className="px-4 py-3 border-b border-gray-300">
                    Current Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLimits.map((item, idx) => {
                  const currentValue =
                    item.type === "Word" ? wordCount : letterCount;
                  const passed =
                    item.condition === "max"
                      ? currentValue <= item.limit
                      : currentValue >= item.limit;

                  return (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-2 border-b border-gray-300">
                        {item.name}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300 capitalize">
                        {item.condition}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {item.limit}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {item.type}
                      </td>
                      <td className={`px-4 py-2 border-b border-gray-300 ${letterCount === 0 ? "text-gray-600 font-medium" : ""}`}>
                        {letterCount === 0 ? (
                          "Empty"
                        ) : (
                          <div
                            className={`flex items-center gap-2 font-medium ${
                              passed ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            <i
                              className={`bx ${
                                passed ? "bxs-check-circle" : "bxs-x-circle"
                              }`}
                            ></i>
                            {passed ? "Pass" : "Fail"}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
