"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

// 型定義はファイル先頭に
type Memo = {
  id: number;
  title: string;
  content: string;
  plainText: string;
  tag?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
};
type GroupedMemos = { [tag: string]: Memo[] };

export default function ListPageSkeleton() {
  const router = useRouter();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [groupedMemos, setGroupedMemos] = useState<GroupedMemos>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredGroupedMemos, setFilteredGroupedMemos] = useState<GroupedMemos>({});
  const [selectedTag, setSelectedTag] = useState<string>("");

  // メモをタグ別にグループ化する関数（複数タグ対応）
  const groupMemosByTag = useCallback((memoList: Memo[]): GroupedMemos => {
    const grouped: GroupedMemos = {};
    memoList.forEach((memo: Memo) => {
      let tags: string[] = [];
      if (Array.isArray(memo.tags)) {
        tags = memo.tags.filter((tag: string) => tag && tag.trim() !== "");
      } else if (memo.tag && typeof memo.tag === "string" && memo.tag.trim() !== "") {
        tags = [memo.tag];
      }
      if (tags.length === 0) {
        if (!grouped["タグなし"]) grouped["タグなし"] = [];
        grouped["タグなし"].push(memo);
      } else {
        tags.forEach((tag: string) => {
          if (!grouped[tag]) grouped[tag] = [];
          grouped[tag].push(memo);
        });
      }
    });
    return grouped;
  }, []);

  // メモを読み込む関数
  // メモを読み込む関数
  const loadMemos = useCallback(() => {
    const savedMemos: Memo[] = JSON.parse(localStorage.getItem('memos') || '[]');
    setMemos(savedMemos);
    const grouped = groupMemosByTag(savedMemos);
    setGroupedMemos(grouped);
    setFilteredGroupedMemos(grouped);
  }, [groupMemosByTag]);

  // 検索機能（テキスト検索とタグ検索）
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, selectedTag);
  };

  // タグ検索機能
  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    applyFilters(searchTerm, tag);
  };

  // フィルタリング機能（統合）
  const applyFilters = (textTerm: string, tagFilter: string) => {
    let filtered: GroupedMemos = groupedMemos;

    // テキスト検索
    if (textTerm && textTerm.trim()) {
      const textFiltered: GroupedMemos = {};
      Object.entries(groupedMemos).forEach(([tag, tagMemos]) => {
        const filteredMemos = tagMemos.filter((memo: Memo) => 
          memo.title.toLowerCase().includes(textTerm.toLowerCase()) ||
          memo.plainText.toLowerCase().includes(textTerm.toLowerCase()) ||
          (memo.content && memo.content.toLowerCase().includes(textTerm.toLowerCase()))
        );
        if (filteredMemos.length > 0) {
          textFiltered[tag] = filteredMemos;
        }
      });
      filtered = textFiltered;
    }

    // タグ検索
    if (tagFilter && tagFilter.trim()) {
      const tagFiltered: GroupedMemos = {};
      if (filtered[tagFilter]) {
        tagFiltered[tagFilter] = filtered[tagFilter];
      }
      filtered = tagFiltered;
    }

    setFilteredGroupedMemos(filtered);
  };

  // メモを削除する関数
  const deleteMemo = (memoId: number) => {
    if (confirm("このメモを削除しますか？")) {
      const updatedMemos = memos.filter((memo: Memo) => memo.id !== memoId);
      setMemos(updatedMemos);
      localStorage.setItem('memos', JSON.stringify(updatedMemos));
      const grouped = groupMemosByTag(updatedMemos);
      setGroupedMemos(grouped);
      applyFilters(searchTerm, selectedTag);
    }
  };

  // 初期化時にメモを読み込み
  useEffect(() => {
    loadMemos();
  }, [groupMemosByTag, loadMemos]);

  // ページに戻ってきたときにメモを再読み込み
  useEffect(() => {
    const handleFocus = () => {
      loadMemos();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [groupMemosByTag, loadMemos]);

  // タグの色を決定する関数
  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      "学校": "bg-blue-200",
      "買い物": "bg-green-200", 
      "仕事": "bg-red-200",
      "趣味": "bg-purple-200",
      "娯楽": "bg-pink-200",
      "健康": "bg-indigo-200",
      "タグなし": "bg-gray-200"
    };
    return colors[tag] || "bg-yellow-200";
  };

  // メモカードの色を決定する関数
  const getMemoCardColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      "学校": "bg-blue-400",
      "買い物": "bg-green-400",
      "仕事": "bg-red-400", 
      "趣味": "bg-purple-400",
      "娯楽": "bg-pink-400",
      "健康": "bg-indigo-400",
      "タグなし": "bg-gray-400"
    };
    return colors[tag] || "bg-yellow-400";
  };

  // メモを開く関数
  const openMemo = (memoId: number) => {
    router.push(`./edit/${memoId}`);
  };

  // 利用可能なタグの一覧を取得
  const getAllTags = (): string[] => {
    const allTags = new Set<string>();
    memos.forEach((memo: Memo) => {
      const tags = getMemoTags(memo);
      tags.forEach((tag: string) => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  // HTMLタグを除去してプレーンテキストにする関数
  const stripHtml = (html: string) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // メモのタグを表示する関数
  const getMemoTags = (memo: Memo): string[] => {
    if (Array.isArray(memo.tags)) {
      return memo.tags.filter((tag: string) => tag && tag.trim() !== "");
    } else if (memo.tag && typeof memo.tag === "string" && memo.tag.trim() !== "") {
      return [memo.tag];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-white p-5 text-black">
      {/* 上部バー */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 w-full max-w-2xl">
          <input
            type="text"
            placeholder="🔍 メモを検索..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2 border rounded-full flex-1 shadow-sm text-black"
          />
          <select
            value={selectedTag}
            onChange={(e) => handleTagFilter(e.target.value)}
            className="px-4 py-2 border rounded-full shadow-sm text-black"
          >
            <option value="">🏷️ すべてのタグ</option>
            {getAllTags().map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          {(searchTerm || selectedTag) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedTag("");
                setFilteredGroupedMemos(groupedMemos);
              }}
              className="px-4 py-2 bg-gray-200 rounded-full shadow hover:bg-gray-300 text-black"
            >
              クリア
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={() => router.push("./login")}
            className="px-4 py-2 bg-gray-200 rounded shadow hover:bg-gray-300 text-black"
          >
            ログアウト
          </button>
          {/* プラスボタン */}
          <button
            onClick={() => router.push("./create")}
            className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl hover:bg-blue-600"
          >
            ＋
          </button>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          総メモ数: {memos.length}件 | タグ数: {Object.keys(groupedMemos).length}個
          {(searchTerm || selectedTag) && (
            <span className="ml-2 text-blue-600">
              検索結果: {Object.values(filteredGroupedMemos).flat().length}件
              {selectedTag && ` (タグ: ${selectedTag})`}
            </span>
          )}
        </p>
      </div>

      {/* 動的タグ別のカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(filteredGroupedMemos).map(([tag, tagMemos]) => (
          <div
            key={tag}
            className={`${getTagColor(tag)} rounded-xl p-4 shadow-md`}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold bg-white bg-opacity-80 inline-block px-3 py-1 rounded text-black">
                {tag} ({tagMemos.length})
              </h2>
            </div>
            <div className="space-y-2">
              {tagMemos.map((memo) => (
                <div
                  key={memo.id}
                  className={`${getMemoCardColor(tag)} rounded-lg p-3 text-black hover:opacity-80 transition-opacity cursor-pointer relative group`}
                  onDoubleClick={() => openMemo(memo.id)}
                  onClick={() => {
                    // シングルクリックでのメモ詳細表示（今後実装可能）
                    console.log("メモの詳細:", memo);
                  }}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMemo(memo.id);
                      }}
                      className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-sm font-semibold truncate pr-6 mb-1">
                    {memo.title}
                  </div>
                  <div className="text-xs opacity-70 line-clamp-2">
                    {stripHtml(memo.content).slice(0, 100)}
                    {stripHtml(memo.content).length > 100 && '...'}
                  </div>
                  {/* メモに設定されているタグを表示 */}
                  {getMemoTags(memo).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getMemoTags(memo).map((memoTag, index) => (
                        <span
                          key={index}
                          className="bg-white bg-opacity-50 text-xs px-2 py-0.5 rounded-full cursor-pointer hover:bg-opacity-70"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagFilter(memoTag);
                          }}
                        >
                          {memoTag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs opacity-50 mt-1">
                    {new Date(memo.createdAt).toLocaleDateString('ja-JP')}
                  </div>
                  <div className="text-xs opacity-60 mt-1 italic">
                    ダブルクリックで編集
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* メモがない場合の表示 */}
      {memos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">まだメモがありません</p>
          <p className="text-gray-400 text-sm mt-2">「＋」ボタンを押してメモを作成してください</p>
        </div>
      )}

      {/* 検索結果がない場合の表示 */}
      {memos.length > 0 && Object.keys(filteredGroupedMemos).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">検索結果が見つかりませんでした</p>
          <p className="text-gray-400 text-sm mt-2">別のキーワードで検索してみてください</p>
        </div>
      )}
    </div>
  );
}
