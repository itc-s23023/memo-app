"use client";

import { useRouter } from "next/navigation";

export default function ListPageSkeleton() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      {/* 上部バー */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="🔍 Search"
          className="px-4 py-2 border rounded-full w-full max-w-md shadow-sm text-black"
        />
        <div className="flex items-center gap-2 ml-4">
          <button className="px-4 py-2 bg-gray-200 rounded shadow hover:bg-gray-300 text-black">
            ログアウト
          </button>

          {/* プラスボタン */}
          <button
            onClick={() => router.push("./pages/create")}
            className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl hover:bg-blue-600"
          >
            ＋
          </button>
        </div>
      </div>

      {/* タグ別の黄色いカード */}
      <div className="grid grid-cols-2 gap-6">
        {["学校", "買い物", "仕事"].map((tag) => (
          <div
            key={tag}
            className="bg-yellow-200 rounded-xl p-4 cursor-pointer hover:opacity-90 transition"
          >
            <h2 className="text-sm font-bold bg-gray-200 inline-block px-2 py-1 rounded mb-3 text-black">
              {tag}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-yellow-400 rounded p-2 h-16 text-black"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

