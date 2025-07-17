"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  const [tags, setTags] = useState(["学校", "仕事", "趣味"]);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4 text-black">
      {/* 上部バー */}
      <div className="flex justify-between items-center bg-white p-2 mb-2">
        <button
          onClick={() => router.push("../../")}
          className="text-2xl px-2"
        >
          ✕
        </button>
        <div className="flex gap-4">
          {["軍線", "斜線", "蛍光ペン", "色変え", "太字"].map((label) => (
            <button
              key={label}
              className="bg-white px-2 py-1 rounded shadow text-sm"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
          <button
            onClick={() => router.push("../../")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </div>

      {/* 本文記入欄 */}
      <div className="bg-gray-300 rounded h-96 mb-6 p-4 shadow-inner"></div>

      {/* タグ追加エリア */}
      <div className="bg-white p-2 rounded shadow">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder="タグを追加"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="px-3 py-1 border rounded w-40"
          />
          <button
            onClick={addTag}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            追加
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <div
              key={tag}
              className="bg-indigo-300 text-white px-3 py-1 rounded-full flex items-center gap-1"
            >
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-1">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

