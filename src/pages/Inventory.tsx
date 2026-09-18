import { useState } from 'react';
import { Package, Plus, AlertTriangle, TrendingDown, Search, Download, Edit2, Check } from 'lucide-react';
import { inventoryItems } from '../data/mockData';

type InventoryItem = typeof inventoryItems[0];

const categoryColors: Record<string, string> = {
  '農薬': 'bg-red-100 text-red-700',
  '肥料': 'bg-green-100 text-green-700',
  '資材': 'bg-blue-100 text-blue-700',
};

export default function Inventory() {
  const [items, setItems] = useState(inventoryItems);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  const categories = ['all', ...Array.from(new Set(inventoryItems.map(i => i.category)))];

  const filtered = items.filter(item => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (search && !item.name.includes(search)) return false;
    return true;
  });

  const lowStockItems = items.filter(i => i.currentStock < i.minStock);
  const stockRatio = (item: InventoryItem) => Math.min(100, (item.currentStock / (item.minStock * 2)) * 100);
  const stockColor = (item: InventoryItem) => {
    const ratio = item.currentStock / item.minStock;
    if (ratio < 1) return 'bg-farm-red';
    if (ratio < 1.5) return 'bg-orange-400';
    return 'bg-farm-green';
  };

  const saveEdit = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, currentStock: editValue, lastUpdated: '2024-08-14' } : i));
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-farm-green" size={24} />
            月次棚卸・在庫管理
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">農薬・肥料・資材の在庫を一元管理</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm">
            <Download size={16} />
            CSV出力
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
            <Plus size={16} />
            品目を追加
          </button>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={18} className="text-orange-600" />
            <p className="font-semibold text-orange-800 text-sm">在庫不足アラート ({lowStockItems.length}件)</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(item => (
              <div key={item.id} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 text-sm">
                <AlertTriangle size={13} className="text-orange-500" />
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="text-gray-400">{item.currentStock}{item.unit} / 最低{item.minStock}{item.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-gray-800">{items.length}</p>
          <p className="text-sm text-gray-500">管理品目数</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-farm-red">{lowStockItems.length}</p>
          <p className="text-sm text-gray-500">要補充品目</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-farm-green">{items.filter(i => i.currentStock >= i.minStock * 1.5).length}</p>
          <p className="text-sm text-gray-500">在庫十分</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-blue-600">{new Set(items.map(i=>i.category)).size}</p>
          <p className="text-sm text-gray-500">カテゴリ数</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="品目名で検索"
            className="input pl-8 text-sm w-48"
          />
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${categoryFilter === cat ? 'bg-white text-farm-green shadow-sm' : 'text-gray-500'}`}
            >
              {cat === 'all' ? '全て' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => {
          const isLow = item.currentStock < item.minStock;
          const isEditing = editingId === item.id;
          return (
            <div key={item.id} className={`card hover:shadow-md transition-all ${isLow ? 'border border-orange-200' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.category === '農薬' ? 'bg-red-100' :
                    item.category === '肥料' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <Package size={18} className={
                      item.category === '農薬' ? 'text-red-600' :
                      item.category === '肥料' ? 'text-green-600' : 'text-blue-600'
                    } />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <span className={`badge text-xs mt-0.5 ${categoryColors[item.category] ?? 'badge-gray'}`}>
                      {item.category}
                    </span>
                  </div>
                </div>
                {isLow && <AlertTriangle size={18} className="text-orange-500 flex-shrink-0" />}
              </div>

              {/* Stock display */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">現在庫</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={e => setEditValue(Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-farm-green rounded-lg text-sm text-right focus:outline-none"
                      />
                      <span className="text-xs text-gray-400">{item.unit}</span>
                      <button onClick={() => saveEdit(item.id)} className="w-7 h-7 bg-farm-green rounded-lg flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${isLow ? 'text-farm-red' : 'text-gray-800'}`}>
                        {item.currentStock}
                      </span>
                      <span className="text-sm text-gray-400">{item.unit}</span>
                      <button
                        onClick={() => { setEditingId(item.id); setEditValue(item.currentStock); }}
                        className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${stockColor(item)}`}
                    style={{ width: `${stockRatio(item)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">最低在庫: {item.minStock}{item.unit}</span>
                  <span className="text-xs text-gray-400">更新: {item.lastUpdated}</span>
                </div>
              </div>

              {isLow && (
                <div className="mt-2 pt-3 border-t border-orange-100 flex items-center justify-between">
                  <span className="text-xs text-orange-600 font-medium">
                    在庫が {item.minStock - item.currentStock}{item.unit} 不足しています
                  </span>
                  <button className="text-xs text-farm-green font-medium hover:underline">発注記録</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">品目を追加</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">品目名</label>
                <input type="text" placeholder="例: アグロスリン乳剤" className="input" />
              </div>
              <div>
                <label className="label">カテゴリ</label>
                <select className="input">
                  <option>農薬</option><option>肥料</option><option>資材</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">現在庫数</label>
                  <input type="number" placeholder="0" className="input" />
                </div>
                <div>
                  <label className="label">最低在庫数</label>
                  <input type="number" placeholder="0" className="input" />
                </div>
              </div>
              <div>
                <label className="label">単位</label>
                <select className="input">
                  <option>L</option><option>mL</option><option>g</option><option>kg</option><option>個</option><option>枚</option><option>袋</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">キャンセル</button>
                <button onClick={() => setShowModal(false)} className="btn-primary flex-1">追加</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
