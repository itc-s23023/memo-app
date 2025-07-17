"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  const [tags, setTags] = useState(["学校", "仕事", "趣味"]);
  const [newTag, setNewTag] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [memoTitle, setMemoTitle] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // メモの保存
  const saveMemo = () => {
    const content = contentRef.current?.innerHTML || "";
    const plainText = contentRef.current?.textContent || "";
    
    if (!memoTitle.trim() && !plainText.trim()) {
      alert("タイトルまたは内容を入力してください");
      return;
    }

    const newMemo = {
      id: Date.now(),
      title: memoTitle.trim() || "無題のメモ",
      content: content,
      plainText: plainText,
      tag: selectedTag || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 既存のメモを取得
    const existingMemos = JSON.parse(localStorage.getItem('memos') || '[]');
    const updatedMemos = [...existingMemos, newMemo];
    
    // メモを保存
    localStorage.setItem('memos', JSON.stringify(updatedMemos));
    
    // タグも保存
    localStorage.setItem('tags', JSON.stringify(tags));
    
    alert("メモが保存されました！");
    router.push("../../");
  };

  // タグの追加
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");
      // タグをローカルストレージに保存
      localStorage.setItem('tags', JSON.stringify(updatedTags));
    }
  };

  // タグの削除
  const removeTag = (tag) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
    if (selectedTag === tag) {
      setSelectedTag("");
    }
    // タグをローカルストレージに保存
    localStorage.setItem('tags', JSON.stringify(updatedTags));
  };

  // リッチテキストエディタの機能
  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  // 初期化時にタグを読み込み
  useEffect(() => {
    const savedTags = JSON.parse(localStorage.getItem('tags') || '[]');
    if (savedTags.length > 0) {
      setTags(savedTags);
    }
  }, []);

  // Enterキーでタグ追加
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTag();
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4 text-black">
      {/* 上部バー */}
      <div className="flex justify-between items-center bg-white p-2 mb-2 rounded shadow">
        <button
          onClick={() => router.push("../../")}
          className="text-2xl px-2 hover:bg-gray-100 rounded"
        >
          ✕
        </button>
        
        {/* リッチテキストエディタのツールバー */}
        <div className="flex gap-2">
          <button
            onClick={() => applyFormat('bold')}
            className="bg-gray-100 px-3 py-1 rounded shadow text-sm hover:bg-gray-200 font-bold"
            title="太字"
          >
            B
          </button>
          <button
            onClick={() => applyFormat('italic')}
            className="bg-gray-100 px-3 py-1 rounded shadow text-sm hover:bg-gray-200 italic"
            title="斜体"
          >
            I
          </button>
          <button
            onClick={() => applyFormat('underline')}
            className="bg-gray-100 px-3 py-1 rounded shadow text-sm hover:bg-gray-200 underline"
            title="下線"
          >
            U
          </button>
          <button
            onClick={() => applyFormat('strikeThrough')}
            className="bg-gray-100 px-3 py-1 rounded shadow text-sm hover:bg-gray-200 line-through"
            title="取り消し線"
          >
            S
          </button>
          <button
            onClick={() => applyFormat('hiliteColor', '#ffff00')}
            className="bg-yellow-300 px-3 py-1 rounded shadow text-sm hover:bg-yellow-400"
            title="蛍光ペン"
          >
            蛍光
          </button>
          <button
            onClick={() => applyFormat('foreColor', '#ff0000')}
            className="bg-red-200 px-3 py-1 rounded shadow text-sm hover:bg-red-300"
            title="文字色（赤）"
          >
            赤
          </button>
          <button
            onClick={() => applyFormat('foreColor', '#0000ff')}
            className="bg-blue-200 px-3 py-1 rounded shadow text-sm hover:bg-blue-300"
            title="文字色（青）"
          >
            青
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={saveMemo}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </div>

      {/* タイトル入力 */}
      <div className="bg-white p-3 rounded shadow mb-2">
        <input
          type="text"
          placeholder="メモのタイトルを入力..."
          value={memoTitle}
          onChange={(e) => setMemoTitle(e.target.value)}
          className="w-full text-lg font-semibold border-none outline-none"
        />
      </div>

      {/* 本文記入欄（リッチテキストエディタ） */}
      <div className="bg-white rounded shadow mb-6 p-4">
        <div
          ref={contentRef}
          contentEditable
          className="min-h-96 outline-none text-black leading-relaxed"
          style={{ minHeight: '24rem' }}
          placeholder="メモの内容を入力..."
          onInput={(e) => {
            // プレースホルダーの処理
            if (e.target.textContent === '') {
              e.target.innerHTML = '';
            }
          }}
        />
      </div>

      {/* タグ選択・追加エリア */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">タグ設定</h3>
        
        {/* 新しいタグ追加 */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="新しいタグを追加"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleTagKeyPress}
            className="px-3 py-2 border rounded w-40"
          />
          <button
            onClick={addTag}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            追加
          </button>
        </div>

        {/* タグ選択 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">メモに付けるタグを選択:</label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 border rounded w-full max-w-md"
          >
            <option value="">タグなし</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* 既存タグ一覧 */}
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <div
              key={tag}
              className={`px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer transition ${
                selectedTag === tag 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-indigo-300 text-white hover:bg-indigo-400'
              }`}
              onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
            >
              {tag}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }} 
                className="ml-1 hover:bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        
        {selectedTag && (
          <p className="text-sm text-gray-600 mt-2">
            選択中のタグ: <span className="font-semibold">{selectedTag}</span>
          </p>
        )}
      </div>
    </div>
  );
}
